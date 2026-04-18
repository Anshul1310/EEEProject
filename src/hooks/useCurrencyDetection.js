import { useRef, useState, useCallback, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const requiredConsecutive = 60; // Adjust for scanning speed (60 frames ~ 1 sec)

export function useCurrencyDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  
  const lastDetectionRef = useRef(null);
  const detectionCountRef = useRef(0);
  const firebaseNoteRef = useRef(null); // Stores real-time note from DB

  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedDenomination, setDetectedDenomination] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen to Firebase Realtime DB
    const noteRef = ref(db, 'notedenomination');
    const unsubscribe = onValue(noteRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // If they store simple int or an object holding the latest amount
        const val = typeof data === 'object' ? data.amount || data.value || Object.values(data).pop() : data;
        if (val) {
          firebaseNoteRef.current = Number(val);
        }
      }
    }, (error) => {
      console.error('Firebase read error: ', error);
    });

    return () => unsubscribe();
  }, []);

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

      // Draw camera stream to canvas
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
        // Use Firebase mock detection
        const denomination = firebaseNoteRef.current;

        if (denomination) {
          if (denomination === lastDetectionRef.current) {
            detectionCountRef.current += 1;
          } else {
            lastDetectionRef.current = denomination;
            detectionCountRef.current = 1;
          }

          const targetRepeat = requiredConsecutive;
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
