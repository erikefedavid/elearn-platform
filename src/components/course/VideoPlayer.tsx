/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer with SSR disabled to prevent hydration errors
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
  url: string;
  title?: string;
  lessonId?: string;
  onComplete?: () => void;
}

export default function VideoPlayer({ url, lessonId, onComplete }: VideoPlayerProps) {
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
  const containerId = `yt-player-${lessonId || 'youtube'}`;

  // YouTube Iframe Player API integration for progress tracking, resumption, and completion
  useEffect(() => {
    if (!youtubeId || !mounted) return;

    let player: any;
    let progressInterval: NodeJS.Timeout;

    const initPlayer = () => {
      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      player = new YT.Player(containerId, {
        videoId: youtubeId,
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 0,
          rel: 0,
          showinfo: 0,
          controls: 1,
        },
        events: {
          onReady: (event: any) => {
            playerRef.current = event.target;
            if (lessonId) {
              const savedProgress = localStorage.getItem(`video-progress-${lessonId}`);
              if (savedProgress) {
                event.target.seekTo(parseFloat(savedProgress), true);
              }
            }
          },
          onStateChange: (event: any) => {
            const YTState = (window as any).YT.PlayerState;
            if (event.data === YTState.PLAYING) {
              progressInterval = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                  const currentTime = playerRef.current.getCurrentTime();
                  if (currentTime > 0 && lessonId) {
                    localStorage.setItem(`video-progress-${lessonId}`, currentTime.toString());
                  }
                }
              }, 2000);
            } else {
              clearInterval(progressInterval);
            }

            if (event.data === YTState.ENDED) {
              if (onComplete) {
                onComplete();
              }
            }
          },
        },
      });
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    } else if (!(window as any).YT.Player) {
      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      clearInterval(progressInterval);
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime > 0 && lessonId) {
            localStorage.setItem(`video-progress-${lessonId}`, currentTime.toString());
          }
        } catch {
          // ignore any player reference errors during unmount
        }
      }
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [youtubeId, lessonId, containerId, mounted, onComplete]);

  // Fallback handlers for generic ReactPlayer URLs
  const handleProgress = (state: any) => {
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

  if (youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-border/50 shadow-lg">
        <div id={containerId} className="w-full h-full" />
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
        onEnded={onComplete}
        progressInterval={2000}
      />
    </div>
  );
}
