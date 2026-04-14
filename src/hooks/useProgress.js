import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'signlingo_progress';

/**
 * Custom hook for managing chapter completion progress
 * Persists to localStorage
 */
export function useProgress() {
  const [completedLetters, setCompletedLetters] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLetters));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }, [completedLetters]);

  const markComplete = useCallback((letter) => {
    setCompletedLetters(prev => {
      if (prev.includes(letter)) return prev;
      return [...prev, letter];
    });
  }, []);

  const isComplete = useCallback((letter) => {
    return completedLetters.includes(letter);
  }, [completedLetters]);

  const resetProgress = useCallback(() => {
    setCompletedLetters([]);
  }, []);

  const progressPercent = (completedLetters.length / 26) * 100;

  return {
    completedLetters,
    markComplete,
    isComplete,
    resetProgress,
    progressPercent,
    completedCount: completedLetters.length,
    totalCount: 26,
  };
}
