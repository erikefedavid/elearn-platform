// GET /api/analytics/stream — Server-Sent Events (SSE) for real-time analytics
import { verifyAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const payload = verifyAuthFromRequest(request);
  if (!payload || payload.role !== 'instructor') {
    return new Response('Unauthorized', { status: 403 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue('event: connected\ndata: connected\n\n');

      // Loop to send mock updates every 5 seconds (simulating near real-time DB changes)
      // In a real production system, this would listen to MongoDB Change Streams
      const intervalId = setInterval(() => {
        // We'll just push a ping, and the client will refetch the analytics API if they want,
        // or we could push the full analytics payload here.
        // For simplicity and thesis demonstration, sending a ping is enough to trigger a UI refresh.
        const data = JSON.stringify({ timestamp: new Date().toISOString() });
        controller.enqueue(`event: update\ndata: ${data}\n\n`);
      }, 5000);

      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
