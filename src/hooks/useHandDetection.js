import { useRef, useState, useCallback, useEffect } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { classifyASLLetter, drawLandmarks } from '../utils/handSignClassifier';

/**
 * Custom hook for hand sign detection using MediaPipe
 */
export function useHandDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const lastDetectionRef = useRef(null);
  const detectionCountRef = useRef(0);
  const requiredConsecutive = 8; // Need N consecutive same-letter detections

  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedLetter, setDetectedLetter] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(0);

  // Initialize MediaPipe HandLandmarker
  const initializeHandLandmarker = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      handLandmarkerRef.current = handLandmarker;
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to initialize HandLandmarker:', err);
      setError('Failed to load hand detection model. Please check your internet connection.');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize hand landmarker if not done
      if (!handLandmarkerRef.current) {
        const success = await initializeHandLandmarker();
        if (!success) return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          setIsCameraActive(true);
          setIsLoading(false);
          startDetection();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a webcam.');
      } else {
        setError('Failed to start camera: ' + err.message);
      }
      setIsLoading(false);
    }
  }, [initializeHandLandmarker]);

  // Stop camera
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

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setIsCameraActive(false);
    setDetectedLetter(null);
    setIsCorrect(false);
    setConfidence(0);
    lastDetectionRef.current = null;
    detectionCountRef.current = 0;
  }, []);

  // Detection loop
  const startDetection = useCallback(() => {
    const detect = () => {
      if (!videoRef.current || !handLandmarkerRef.current || !canvasRef.current) {
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      const startTimeMs = performance.now();

      try {
        const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          
          // Draw landmarks
          drawLandmarks(ctx, landmarks, canvas.width, canvas.height);

          // Classify the ASL letter
          const letter = classifyASLLetter(landmarks);

          if (letter) {
            if (letter === lastDetectionRef.current) {
              detectionCountRef.current++;
            } else {
              lastDetectionRef.current = letter;
              detectionCountRef.current = 1;
            }

            // Update confidence
            const conf = Math.min(detectionCountRef.current / requiredConsecutive, 1);
            setConfidence(conf);

            // Only set detected letter after consecutive detections
            if (detectionCountRef.current >= requiredConsecutive) {
              setDetectedLetter(letter);
            }
          } else {
            // Gradually decrease confidence
            detectionCountRef.current = Math.max(0, detectionCountRef.current - 1);
            const conf = Math.max(0, detectionCountRef.current / requiredConsecutive);
            setConfidence(conf);
            
            if (detectionCountRef.current === 0) {
              lastDetectionRef.current = null;
              setDetectedLetter(null);
            }
          }
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          detectionCountRef.current = 0;
          lastDetectionRef.current = null;
          setDetectedLetter(null);
          setConfidence(0);
        }
      } catch (err) {
        // Silently handle detection errors (can happen during transitions)
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, []);

  // Check if detected letter matches target
  const checkLetter = useCallback((targetLetter) => {
    if (detectedLetter && detectedLetter === targetLetter) {
      setIsCorrect(true);
      return true;
    }
    setIsCorrect(false);
    return false;
  }, [detectedLetter]);

  // Reset detection state
  const resetDetection = useCallback(() => {
    setDetectedLetter(null);
    setIsCorrect(false);
    setConfidence(0);
    lastDetectionRef.current = null;
    detectionCountRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    isCameraActive,
    detectedLetter,
    isCorrect,
    error,
    confidence,
    startCamera,
    stopCamera,
    checkLetter,
    resetDetection,
  };
}
