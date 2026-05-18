'use client';

import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';

interface VideoPlayerProps {
  url: string;
  title?: string;
  lessonId?: string;
}

export default function VideoPlayer({ url, title, lessonId }: VideoPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProgress = (state: { playedSeconds: number }) => {
    if (lessonId && state.playedSeconds > 0) {
      localStorage.setItem(`video-progress-${lessonId}`, state.playedSeconds.toString());
    }
  };

  const handleReady = () => {
    if (lessonId) {
      const savedProgress = localStorage.getItem(`video-progress-${lessonId}`);
      if (savedProgress && playerRef.current) {
        playerRef.current.seekTo(parseFloat(savedProgress), 'seconds');
      }
    }
  };

  if (!mounted) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/50 border border-border/50 shadow-lg">
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        controls
        onProgress={handleProgress}
        onReady={handleReady}
        progressInterval={2000} // Save every 2 seconds
        config={{
          youtube: {
            playerVars: { showinfo: 1 }
          }
        }}
      />
    </div>
  );
}
