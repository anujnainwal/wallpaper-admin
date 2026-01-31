import { useEffect } from 'react';

interface EventData {
  model: string;
  action: 'create' | 'update' | 'delete' | 'bulk_delete';
  id?: string;
  ids?: string[];
  data?: any;
}

export const useEventStream = (onUpdate?: (event: EventData) => void) => {
  useEffect(() => {
    const streamUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/events/stream`;
    
    // SSE requires the EventSource native API
    const eventSource = new EventSource(streamUrl);

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log('SSE Stream established:', data.message);
          return;
        }

        if (onUpdate) {
          onUpdate(data);
        } else {
          // Default behavior: just log and maybe show a toast if it's a mutation
          console.log('Real-time update received:', data);
          if (data.action) {
             // notifyInfo(`Real-time update: ${data.model} ${data.action}`);
          }
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      console.log('SSE connection closed');
    };
  }, [onUpdate]);
};
