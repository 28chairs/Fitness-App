'use client';

import { useState, useEffect } from 'react';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lon: number; address: string }) => void;
  initialLocation?: { lat: number; lon: number; address: string };
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [lat, setLat] = useState(initialLocation?.lat || 0);
  const [lon, setLon] = useState(initialLocation?.lon || 0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  const handleGeocode = async () => {
    // In production, use a geocoding service like Google Maps Geocoding API
    // For MVP, we'll use a simple approach
    if (address) {
      // Mock geocoding - would be replaced with actual API call
      const mockLocation = {
        lat: 37.7749,
        lon: -122.4194,
        address,
      };
      setLat(mockLocation.lat);
      setLon(mockLocation.lon);
      onLocationSelect(mockLocation);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Location Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or city"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={handleGeocode}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Find
          </button>
        </div>
      </div>

      {lat !== 0 && lon !== 0 && (
        <div className="text-sm text-gray-600">
          <p>Coordinates: {lat.toFixed(6)}, {lon.toFixed(6)}</p>
        </div>
      )}

      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map view coming soon</p>
      </div>
    </div>
  );
}

