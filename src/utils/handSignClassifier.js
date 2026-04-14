/**
 * ASL Hand Sign Classifier
 * 
 * Uses MediaPipe hand landmarks to classify ASL alphabet letters.
 * Each hand has 21 landmarks. We analyze finger positions (extended/curled)
 * and relative positions to determine the signed letter.
 * 
 * Landmark indices:
 * 0: WRIST
 * 1-4: THUMB (CMC, MCP, IP, TIP)
 * 5-8: INDEX (MCP, PIP, DIP, TIP)
 * 9-12: MIDDLE (MCP, PIP, DIP, TIP)
 * 13-16: RING (MCP, PIP, DIP, TIP)
 * 17-20: PINKY (MCP, PIP, DIP, TIP)
 */

// Landmark indices
const WRIST = 0;
const THUMB_CMC = 1, THUMB_MCP = 2, THUMB_IP = 3, THUMB_TIP = 4;
const INDEX_MCP = 5, INDEX_PIP = 6, INDEX_DIP = 7, INDEX_TIP = 8;
const MIDDLE_MCP = 9, MIDDLE_PIP = 10, MIDDLE_DIP = 11, MIDDLE_TIP = 12;
const RING_MCP = 13, RING_PIP = 14, RING_DIP = 15, RING_TIP = 16;
const PINKY_MCP = 17, PINKY_PIP = 18, PINKY_DIP = 19, PINKY_TIP = 20;

function distance(p1, p2) {
  return Math.sqrt(
    (p1.x - p2.x) ** 2 + 
    (p1.y - p2.y) ** 2 + 
    (p1.z - p2.z) ** 2
  );
}

function distance2D(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/**
 * Check if a finger is extended (straight) based on landmarks
 * A finger is considered extended if its tip is farther from the wrist
 * than its PIP joint (for non-thumb) or if the angle is relatively straight
 */
function isFingerExtended(landmarks, fingerTip, fingerDip, fingerPip, fingerMcp) {
  const tip = landmarks[fingerTip];
  const dip = landmarks[fingerDip];
  const pip = landmarks[fingerPip];
  const mcp = landmarks[fingerMcp];
  
  // Check if tip is farther from wrist than PIP in the y-direction
  // (Remember: y increases downward in screen coords)
  // A finger is extended if tip.y < pip.y (tip is higher than pip)
  const tipHigherThanPip = tip.y < pip.y;
  const tipHigherThanDip = tip.y < dip.y;
  
  // Also check distance-based: tip should be far from MCP
  const tipToMcp = distance(tip, mcp);
  const pipToMcp = distance(pip, mcp);
  
  return tipHigherThanPip && tipHigherThanDip && tipToMcp > pipToMcp * 0.8;
}

function isThumbExtended(landmarks) {
  const tip = landmarks[THUMB_TIP];
  const ip = landmarks[THUMB_IP];
  const mcp = landmarks[THUMB_MCP];
  const wrist = landmarks[WRIST];
  const indexMcp = landmarks[INDEX_MCP];
  
  // Thumb is extended if its tip is far from the palm center
  const palmCenterX = (landmarks[INDEX_MCP].x + landmarks[PINKY_MCP].x) / 2;
  const palmCenterY = (landmarks[INDEX_MCP].y + landmarks[PINKY_MCP].y) / 2;
  
  const tipDist = Math.sqrt((tip.x - palmCenterX) ** 2 + (tip.y - palmCenterY) ** 2);
  const mcpDist = Math.sqrt((mcp.x - palmCenterX) ** 2 + (mcp.y - palmCenterY) ** 2);
  
  return tipDist > mcpDist * 1.2;
}

function isFingerCurled(landmarks, fingerTip, fingerDip, fingerPip, fingerMcp) {
  const tip = landmarks[fingerTip];
  const pip = landmarks[fingerPip];
  const mcp = landmarks[fingerMcp];
  
  // Finger is curled if tip is close to or below the MCP
  const tipToMcp = distance(tip, mcp);
  const pipToMcp = distance(pip, mcp);
  
  return tip.y >= pip.y || tipToMcp < pipToMcp * 1.1;
}

/**
 * Get the state of all fingers
 */
function getFingerStates(landmarks) {
  return {
    thumb: isThumbExtended(landmarks),
    index: isFingerExtended(landmarks, INDEX_TIP, INDEX_DIP, INDEX_PIP, INDEX_MCP),
    middle: isFingerExtended(landmarks, MIDDLE_TIP, MIDDLE_DIP, MIDDLE_PIP, MIDDLE_MCP),
    ring: isFingerExtended(landmarks, RING_TIP, RING_DIP, RING_PIP, RING_MCP),
    pinky: isFingerExtended(landmarks, PINKY_TIP, PINKY_DIP, PINKY_PIP, PINKY_MCP),
  };
}

/**
 * Count extended fingers
 */
function countExtendedFingers(states) {
  let count = 0;
  if (states.thumb) count++;
  if (states.index) count++;
  if (states.middle) count++;
  if (states.ring) count++;
  if (states.pinky) count++;
  return count;
}

/**
 * Check if fingertips are touching (tips close to each other)
 */
function areTipsTouching(landmarks, tip1, tip2, threshold = 0.06) {
  return distance(landmarks[tip1], landmarks[tip2]) < threshold;
}

/**
 * Classify the ASL letter from hand landmarks
 */
export function classifyASLLetter(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  const fingers = getFingerStates(landmarks);
  const extendedCount = countExtendedFingers(fingers);
  
  // Get specific measurements
  const thumbTip = landmarks[THUMB_TIP];
  const indexTip = landmarks[INDEX_TIP];
  const middleTip = landmarks[MIDDLE_TIP];
  const ringTip = landmarks[RING_TIP];
  const pinkyTip = landmarks[PINKY_TIP];
  const wrist = landmarks[WRIST];
  const indexMcp = landmarks[INDEX_MCP];
  const middleMcp = landmarks[MIDDLE_MCP];
  
  // Finger positions
  const indexCurled = isFingerCurled(landmarks, INDEX_TIP, INDEX_DIP, INDEX_PIP, INDEX_MCP);
  const middleCurled = isFingerCurled(landmarks, MIDDLE_TIP, MIDDLE_DIP, MIDDLE_PIP, MIDDLE_MCP);
  const ringCurled = isFingerCurled(landmarks, RING_TIP, RING_DIP, RING_PIP, RING_MCP);
  const pinkyCurled = isFingerCurled(landmarks, PINKY_TIP, PINKY_DIP, PINKY_PIP, PINKY_MCP);

  // Thumb-index touching
  const thumbIndexTouching = areTipsTouching(landmarks, THUMB_TIP, INDEX_TIP, 0.07);
  const thumbMiddleTouching = areTipsTouching(landmarks, THUMB_TIP, MIDDLE_TIP, 0.07);
  
  // All fingertips touching thumb (O sign)
  const allTipsToThumb = 
    areTipsTouching(landmarks, THUMB_TIP, INDEX_TIP, 0.08) &&
    areTipsTouching(landmarks, INDEX_TIP, MIDDLE_TIP, 0.08);

  // Check hand orientation
  const handPointingDown = indexTip.y > indexMcp.y;
  const handPointingSideways = Math.abs(indexTip.x - indexMcp.x) > Math.abs(indexTip.y - indexMcp.y);

  // ---- CLASSIFICATION ----
  
  // A: Fist with thumb on side (not tucked in)
  if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && 
      fingers.thumb && !handPointingDown) {
    return 'A';
  }

  // B: Four fingers up, thumb tucked
  if (fingers.index && fingers.middle && fingers.ring && fingers.pinky && !fingers.thumb) {
    // Check fingers are close together (not spread like W or 5)
    const indexMiddleDist = distance2D(indexTip, middleTip);
    const middleRingDist = distance2D(middleTip, ringTip);
    if (indexMiddleDist < 0.08 && middleRingDist < 0.08) {
      return 'B';
    }
  }

  // C: Curved hand shape
  if (extendedCount >= 3 && !allTipsToThumb) {
    const thumbIndexDist = distance(thumbTip, indexTip);
    const indexPinkyDist = distance(indexTip, pinkyTip);
    if (thumbIndexDist > 0.05 && thumbIndexDist < 0.15 && fingers.thumb) {
      // Check curvature - all fingers somewhat curved, not fully extended
      const indexAngle = landmarks[INDEX_TIP].y - landmarks[INDEX_PIP].y;
      if (Math.abs(indexAngle) < 0.05) {
        return 'C';
      }
    }
  }

  // D: Index up, others form circle with thumb
  if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && 
      thumbMiddleTouching && !handPointingDown) {
    return 'D';
  }

  // F: Thumb and index touch, other three fingers up
  if (thumbIndexTouching && fingers.middle && fingers.ring && fingers.pinky) {
    return 'F';
  }

  // I: Only pinky extended
  if (!fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && fingers.pinky) {
    return 'I';
  }

  // K: Index and middle up in V, thumb between them
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    const indexMiddleDist = distance2D(indexTip, middleTip);
    const thumbBetween = thumbTip.x > Math.min(indexTip.x, middleTip.x) && 
                          thumbTip.x < Math.max(indexTip.x, middleTip.x);
    if (indexMiddleDist > 0.05 && thumbBetween && fingers.thumb) {
      return 'K';
    }
  }

  // L: Index up, thumb out (perpendicular)
  if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && fingers.thumb) {
    const angleCheck = Math.abs(thumbTip.y - indexTip.y) > 0.05;
    if (angleCheck && !handPointingDown) {
      return 'L';
    }
  }

  // O: All fingertips touching to form circle
  if (allTipsToThumb && !fingers.index && !fingers.middle) {
    return 'O';
  }

  // R: Index and middle crossed
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    const indexMiddleDist = distance2D(indexTip, middleTip);
    if (indexMiddleDist < 0.04) {
      return 'R';
    }
  }

  // U: Index and middle up and together
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    const indexMiddleDist = distance2D(indexTip, middleTip);
    if (indexMiddleDist < 0.06 && !handPointingDown) {
      return 'U';
    }
  }

  // V: Index and middle up and spread (peace sign)
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    const indexMiddleDist = distance2D(indexTip, middleTip);
    if (indexMiddleDist >= 0.06 && !handPointingDown && !fingers.thumb) {
      return 'V';
    }
  }

  // W: Index, middle, ring up and spread
  if (fingers.index && fingers.middle && fingers.ring && !fingers.pinky) {
    return 'W';
  }

  // Y: Thumb and pinky extended
  if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && fingers.pinky) {
    return 'Y';
  }

  // S: Fist with thumb over fingers (no thumb visible from front)
  if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb) {
    return 'S';
  }

  // E: All fingers curled, thumb tucked (similar to S but more curled)
  if (indexCurled && middleCurled && ringCurled && pinkyCurled && !fingers.thumb) {
    return 'E';
  }

  // X: Index finger hooked/bent
  if (!fingers.middle && !fingers.ring && !fingers.pinky) {
    const indexBent = landmarks[INDEX_TIP].y > landmarks[INDEX_DIP].y && 
                      landmarks[INDEX_DIP].y < landmarks[INDEX_PIP].y;
    if (indexBent) {
      return 'X';
    }
  }

  // Five / open hand - not an ASL letter per se, but useful for detecting B variants
  if (extendedCount === 5) {
    return 'B'; // Open hand defaults to B
  }

  // G/H: Horizontal pointing gestures
  if (handPointingSideways) {
    if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
      return 'G';
    }
    if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
      return 'H';
    }
  }

  // P/Q: Downward pointing gestures
  if (handPointingDown) {
    if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
      return 'P';
    }
    if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
      return 'Q';
    }
  }

  return null;
}

/**
 * Draw hand landmarks on canvas
 */
export function drawLandmarks(ctx, landmarks, width, height) {
  if (!landmarks || !ctx) return;

  // Connection pairs for drawing skeleton
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],       // Index
    [0, 9], [9, 10], [10, 11], [11, 12],   // Middle
    [0, 13], [13, 14], [14, 15], [15, 16], // Ring
    [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
    [5, 9], [9, 13], [13, 17],             // Palm
  ];

  ctx.clearRect(0, 0, width, height);

  // Draw connections
  ctx.strokeStyle = 'rgba(108, 92, 231, 0.6)';
  ctx.lineWidth = 2;
  connections.forEach(([i, j]) => {
    const p1 = landmarks[i];
    const p2 = landmarks[j];
    ctx.beginPath();
    ctx.moveTo(p1.x * width, p1.y * height);
    ctx.lineTo(p2.x * width, p2.y * height);
    ctx.stroke();
  });

  // Draw landmarks
  landmarks.forEach((landmark, i) => {
    const x = landmark.x * width;
    const y = landmark.y * height;
    
    // Fingertips get larger, glowing dots
    const isTip = [4, 8, 12, 16, 20].includes(i);
    const radius = isTip ? 6 : 3;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    
    if (isTip) {
      ctx.fillStyle = '#a29bfe';
      ctx.shadowColor = '#6c5ce7';
      ctx.shadowBlur = 10;
    } else {
      ctx.fillStyle = 'rgba(162, 155, 254, 0.8)';
      ctx.shadowBlur = 0;
    }
    
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}
