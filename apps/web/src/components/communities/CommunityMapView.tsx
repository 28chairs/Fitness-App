'use client';

import { useState, useEffect } from 'react';
import type { Community } from '@/lib/api/types';

interface CommunityMapViewProps {
  communities: Community[];
}

export function CommunityMapView({ communities }: CommunityMapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Mapbox GL JS
    if (typeof window !== 'undefined' && !mapLoaded) {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [mapLoaded]);

  // For MVP, show a placeholder map
  // Full Mapbox integration would go here
  return (
    <div className="bg-white rounded-lg shadow h-96 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-2">Map view coming soon</p>
        <p className="text-sm text-gray-400">
          {communities.length} communities found
        </p>
      </div>
    </div>
  );
}

