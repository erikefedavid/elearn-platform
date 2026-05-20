'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer with SSR disabled to prevent hydration errors
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
  url: string;
  title?: string;
  lessonId?: string;
}

export default function VideoPlayer({ url, title, lessonId }: VideoPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const playerRef = useRef<any>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to check if URL is a YouTube video and extract the ID
  const getYouTubeId = (videoUrl: string) => {
    if (!videoUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeId(url);

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

  // If it's a YouTube URL, use the native YouTube Embed (100% reliable, fast, bypasses bundler SSR/lazy registry bugs)
  if (youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-border/50 shadow-lg">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&showinfo=0&controls=1`}
          title={title || "Video Player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback for other video urls (raw file paths, Vimeo, etc.)
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
      />
    </div>
  );
}
