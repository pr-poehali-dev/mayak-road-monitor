import { useEffect, useRef } from 'react';
import { load } from '@2gis/mapgl';

interface Map2GISProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string | number;
    coordinates: [number, number];
    type: string;
    title: string;
  }>;
  onMapClick?: (coordinates: [number, number]) => void;
}

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'accident': return '#ea384c';
    case 'ice': return '#3b82f6';
    case 'snow': return '#94a3b8';
    case 'repair': return '#f97316';
    case 'police': return '#6366f1';
    default: return '#0EA5E9';
  }
};

export const Map2GIS = ({ center, zoom = 13, markers = [], onMapClick }: Map2GISProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: any;
    const apiKey = 'ruxyzab';

    load().then((mapglAPI) => {
      map = new mapglAPI.Map(mapContainerRef.current!, {
        center,
        zoom,
        key: apiKey,
      });

      mapInstanceRef.current = map;

      if (onMapClick) {
        map.on('click', (e: any) => {
          const coords: [number, number] = [e.lngLat[0], e.lngLat[1]];
          onMapClick(coords);
        });
      }

      markers.forEach((markerData) => {
        const markerElement = document.createElement('div');
        markerElement.style.width = '30px';
        markerElement.style.height = '30px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = getMarkerColor(markerData.type);
        markerElement.style.border = '3px solid white';
        markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        markerElement.style.cursor = 'pointer';
        markerElement.title = markerData.title;

        const marker = new mapglAPI.HtmlMarker(map, {
          coordinates: markerData.coordinates,
          html: markerElement,
        });

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach(marker => marker.destroy());
      markersRef.current = [];
      if (map) {
        map.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => marker.destroy());
    markersRef.current = [];

    load().then((mapglAPI) => {
      markers.forEach((markerData) => {
        const markerElement = document.createElement('div');
        markerElement.style.width = '30px';
        markerElement.style.height = '30px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = getMarkerColor(markerData.type);
        markerElement.style.border = '3px solid white';
        markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        markerElement.style.cursor = 'pointer';
        markerElement.title = markerData.title;

        const marker = new mapglAPI.HtmlMarker(mapInstanceRef.current, {
          coordinates: markerData.coordinates,
          html: markerElement,
        });

        markersRef.current.push(marker);
      });
    });
  }, [markers]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }} 
    />
  );
};
