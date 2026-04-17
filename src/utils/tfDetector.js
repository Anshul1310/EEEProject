let tfModel = null;

export async function initTensorFlow() {
  try {
    const tf = await import('@tensorflow/tfjs');
    const cocoSsd = await import('@tensorflow-models/coco-ssd');
    
    console.log('Loading Coco-SSD model...');
    tfModel = await cocoSsd.load();
    console.log('TensorFlow model loaded successfully');
    return tfModel;
  } catch (error) {
    console.error('Failed to initialize TensorFlow:', error);
    return null;
  }
}

export async function detectObjectInFrame(imageData, model) {
  if (!model) {
    return { detected: false, confidence: 0 };
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);

    const predictions = await model.estimateSingleImage(canvas);

    if (!predictions || predictions.length === 0) {
      return { detected: false, confidence: 0 };
    }

    let maxConfidence = 0;
    let objectDetected = false;

    for (const prediction of predictions) {
      const score = prediction.score || 0;
      if (score > 0.5) {
        objectDetected = true;
        maxConfidence = Math.max(maxConfidence, score);
      }
    }

    return {
      detected: objectDetected || maxConfidence > 0.3,
      confidence: Math.min(1, maxConfidence)
    };
  } catch (error) {
    console.error('TensorFlow detection error:', error);
    return { detected: false, confidence: 0 };
  }
}

export function getTFModel() {
  return tfModel;
}

export function disposeTensorFlow() {
  if (tfModel) {
    tfModel.dispose?.();
    tfModel = null;
  }
}
