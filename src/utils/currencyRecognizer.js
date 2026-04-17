function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const delta = mx - mn;
  let hue = 0;
  const saturation = mx === 0 ? 0 : delta / mx;
  const value = mx;

  if (delta !== 0) {
    if (mx === r) {
      hue = 60 * (((g - b) / delta) % 6);
    } else if (mx === g) {
      hue = 60 * (((b - r) / delta) + 2);
    } else {
      hue = 60 * (((r - g) / delta) + 4);
    }
  }

  if (hue < 0) hue += 360;
  return { h: hue, s: saturation, v: value };
}

// Analyze color characteristics in a region
function analyzeColorProfile(imageData, regionX, regionY, regionW, regionH) {
  const { width, height, data } = imageData;
  let hueSum = 0, satSum = 0, valSum = 0, count = 0;
  let redPixels = 0, greenPixels = 0, bluePixels = 0;
  let brightPixels = 0, darkPixels = 0;

  for (let y = regionY; y < regionY + regionH; y += 4) {
    for (let x = regionX; x < regionX + regionW; x += 4) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const { h, s, v } = rgbToHsv(r, g, b);

      if (v > 0.15 && v < 0.95) {
        hueSum += h;
        satSum += s;
        valSum += v;
        if (r > g + 20 && r > b + 20) redPixels++;
        if (g > r + 20 && g > b + 20) greenPixels++;
        if (b > r + 20 && b > g + 20) bluePixels++;
        if (v > 0.7) brightPixels++;
        if (v < 0.35) darkPixels++;
        count++;
      }
    }
  }

  if (count === 0) return null;
  return {
    avgHue: hueSum / count,
    avgSat: satSum / count,
    avgVal: valSum / count,
    redRatio: redPixels / count,
    greenRatio: greenPixels / count,
    blueRatio: bluePixels / count,
    brightRatio: brightPixels / count,
    darkRatio: darkPixels / count,
  };
}

// Detect edges/texture using Sobel-like operator
function analyzeTextureContrast(imageData, regionX, regionY, regionW, regionH) {
  const { width, height, data } = imageData;
  let edgeStrength = 0;
  let edgeCount = 0;

  for (let y = regionY + 1; y < regionY + regionH - 1; y += 6) {
    for (let x = regionX + 1; x < regionX + regionW - 1; x += 6) {
      if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) continue;

      const idx = (y * width + x) * 4;
      const centerBright = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];

      const topBright = 0.2126 * data[((y - 1) * width + x) * 4] + 0.7152 * data[((y - 1) * width + x) * 4 + 1] + 0.0722 * data[((y - 1) * width + x) * 4 + 2];
      const bottomBright = 0.2126 * data[((y + 1) * width + x) * 4] + 0.7152 * data[((y + 1) * width + x) * 4 + 1] + 0.0722 * data[((y + 1) * width + x) * 4 + 2];
      const leftBright = 0.2126 * data[(y * width + (x - 1)) * 4] + 0.7152 * data[(y * width + (x - 1)) * 4 + 1] + 0.0722 * data[(y * width + (x - 1)) * 4 + 2];
      const rightBright = 0.2126 * data[(y * width + (x + 1)) * 4] + 0.7152 * data[(y * width + (x + 1)) * 4 + 1] + 0.0722 * data[(y * width + (x + 1)) * 4 + 2];

      const dx = Math.abs(rightBright - leftBright);
      const dy = Math.abs(bottomBright - topBright);
      edgeStrength += Math.sqrt(dx * dx + dy * dy);
      edgeCount++;
    }
  }

  return edgeCount > 0 ? edgeStrength / edgeCount / 255 : 0;
}

// Multi-factor denomination scoring
function scoreNote(imageData) {
  const { width, height } = imageData;
  const centerRegion = analyzeColorProfile(imageData, width * 0.1, height * 0.25, width * 0.8, height * 0.5);
  const topRegion = analyzeColorProfile(imageData, width * 0.15, 0, width * 0.7, height * 0.25);
  const bottomRegion = analyzeColorProfile(imageData, width * 0.15, height * 0.75, width * 0.7, height * 0.25);
  const textureScore = analyzeTextureContrast(imageData, width * 0.1, height * 0.2, width * 0.8, height * 0.6);

  if (!centerRegion) return null;

  const scores = { 20: 0, 50: 0, 100: 0, 500: 0 };

  // ₹20: Yellow/Orange - Hue 10-80°, Red dominant, high saturation
  if (centerRegion.avgHue >= 5 && centerRegion.avgHue <= 85) {
    let score20 = 0.3;
    if (centerRegion.redRatio > 0.12) score20 += 0.2;
    if (centerRegion.avgSat >= 0.25) score20 += 0.2;
    if (centerRegion.brightRatio > 0.25) score20 += 0.15;
    if (textureScore > 0.1) score20 += 0.15;
    scores[20] = score20;
  }

  // ₹50: Green - Hue 75-165°, Green dominant
  if (centerRegion.avgHue >= 70 && centerRegion.avgHue <= 170) {
    let score50 = 0.3;
    if (centerRegion.greenRatio > 0.12) score50 += 0.2;
    if (centerRegion.avgSat >= 0.2) score50 += 0.2;
    if (centerRegion.brightRatio > 0.2) score50 += 0.15;
    if (textureScore > 0.1) score50 += 0.15;
    scores[50] = score50;
  }

  // ₹100: Blue - Hue 155-280°, Blue dominant
  if (centerRegion.avgHue >= 150 && centerRegion.avgHue <= 285) {
    let score100 = 0.3;
    if (centerRegion.blueRatio > 0.12) score100 += 0.2;
    if (centerRegion.avgSat >= 0.18) score100 += 0.2;
    if (centerRegion.brightRatio > 0.2) score100 += 0.15;
    if (textureScore > 0.1) score100 += 0.15;
    scores[100] = score100;
  }

  // ₹500: Neutral beige/tan - Low saturation, balanced colors
  if (centerRegion.avgSat < 0.4 && centerRegion.avgVal >= 0.25 && centerRegion.avgVal <= 0.8) {
    let score500 = 0.3;
    const colorBalance = 1 - Math.max(centerRegion.redRatio, centerRegion.greenRatio, centerRegion.blueRatio) + 0.1;
    score500 += Math.min(colorBalance * 0.2, 0.2);
    if (centerRegion.avgVal >= 0.4 && centerRegion.avgVal <= 0.7) score500 += 0.15;
    if (textureScore > 0.08) score500 += 0.15;
    scores[500] = score500;
  }

  return scores;
}

export function classifyIndianRupeeNote(imageData) {
  if (!imageData || !imageData.data) return null;

  const scores = scoreNote(imageData);
  if (!scores) return null;

  const maxScore = Math.max(scores[20], scores[50], scores[100], scores[500]);
  if (maxScore < 0.15) return null;

  const candidates = [];
  for (const [note, score] of Object.entries(scores)) {
    if (score >= maxScore * 0.75) {
      candidates.push({ note: parseInt(note), score });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].note;
}

