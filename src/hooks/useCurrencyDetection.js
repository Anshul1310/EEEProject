import { useRef, useState, useCallback, useEffect } from 'react';
import { classifyIndianRupeeNote } from '../utils/currencyRecognizer';

const requiredConsecutive = 2;

export function useCurrencyDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const lastDetectionRef = useRef(null);
  const detectionCountRef = useRef(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedDenomination, setDetectedDenomination] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);

  const resetDetection = useCallback(() => {
    lastDetectionRef.current = null;
    detectionCountRef.current = 0;
    setDetectedDenomination(null);
    setConfidence(0);
    setError(null);
  }, []);

  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    resetDetection();
  }, [resetDetection]);

  const startDetection = useCallback(() => {
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }

    const detect = () => {
      if (!videoRef.current || !canvasRef.current) {
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 123, 255, 0.85)';
      ctx.lineWidth = 4;
      const guideWidth = Math.min(canvas.width * 0.95, canvas.height * 1.4);
      const guideHeight = Math.min(canvas.height * 0.7, canvas.width * 0.7);
      const guideX = (canvas.width - guideWidth) / 2;
      const guideY = (canvas.height - guideHeight) / 2;
      ctx.strokeRect(guideX, guideY, guideWidth, guideHeight);
      ctx.fillStyle = 'rgba(0, 123, 255, 0.08)';
      ctx.fillRect(guideX, guideY, guideWidth, guideHeight);

      try {
        const detectionWidth = 320;
        const detectionHeight = Math.round((video.videoHeight / video.videoWidth) * detectionWidth);
        const offscreen = offscreenCanvasRef.current;
        if (offscreen.width !== detectionWidth || offscreen.height !== detectionHeight) {
          offscreen.width = detectionWidth;
          offscreen.height = detectionHeight;
        }
        const offscreenCtx = offscreen.getContext('2d');
        offscreenCtx.drawImage(video, 0, 0, detectionWidth, detectionHeight);
        const imageData = offscreenCtx.getImageData(0, 0, detectionWidth, detectionHeight);
        const denomination = classifyIndianRupeeNote(imageData);

        if (denomination) {
          if (denomination === lastDetectionRef.current) {
            detectionCountRef.current += 1;
          } else {
            lastDetectionRef.current = denomination;
            detectionCountRef.current = 1;
          }

          const targetRepeat = denomination === 500 ? requiredConsecutive + 2 : requiredConsecutive;
          const conf = Math.min(detectionCountRef.current / targetRepeat, 1);
          setConfidence(conf);
          if (detectionCountRef.current >= targetRepeat && conf >= 0.75) {
            setDetectedDenomination(denomination);
          }
        } else {
          detectionCountRef.current = Math.max(0, detectionCountRef.current - 1);
          setConfidence(Math.max(0, detectionCountRef.current / requiredConsecutive));
          if (detectionCountRef.current === 0) {
            lastDetectionRef.current = null;
            setDetectedDenomination(null);
          }
        }
      } catch (err) {
        console.error('Currency detection error:', err);
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          setIsCameraActive(true);
          setIsLoading(false);
          resetDetection();
          startDetection();
        };
      }
    } catch (err) {
      console.error('Currency camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a webcam.');
      } else {
        setError('Failed to access the camera: ' + err.message);
      }
      setIsLoading(false);
    }
  }, [resetDetection, startDetection]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    isCameraActive,
    detectedDenomination,
    confidence,
    error,
    startCamera,
    stopCamera,
    resetDetection,
  };
}
