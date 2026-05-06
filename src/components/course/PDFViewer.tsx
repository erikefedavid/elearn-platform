'use client';

interface PDFViewerProps {
  url: string;
  title?: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  return (
    <div className="w-full h-[70vh] rounded-xl overflow-hidden bg-muted/50 border border-border">
      <iframe
        src={`${url}#toolbar=1&navpanes=0`}
        title={title || 'PDF Document'}
        className="w-full h-full"
      />
    </div>
  );
}
