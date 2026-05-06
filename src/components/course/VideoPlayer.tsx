'use client';

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');

  if (isYouTube) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()
      : new URL(url).searchParams.get('v');
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/50">
        <iframe src={`https://www.youtube.com/embed/${videoId}`} title={title || 'Video'} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }

  if (isVimeo) {
    const videoId = url.split('/').pop();
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/50">
        <iframe src={`https://player.vimeo.com/video/${videoId}`} title={title || 'Video'} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/50">
      <video src={url} controls className="w-full h-full" controlsList="nodownload">
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
