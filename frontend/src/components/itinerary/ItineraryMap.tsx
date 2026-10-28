import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Activity } from '../../types/itinerary';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { formatCurrency, formatDuration } from '../../utils/formatters';

export interface ItineraryMapProps {
  activities: Activity[];
  destinationName?: string;
}

const createNumberedPin = (num: number) => {
  return L.divIcon({
    className: 'custom-pin-marker',
    html: `
      <div style="
        background: #2D5016;
        color: #FFFFF0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 12px;
        border: 2px solid #FFFFF0;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        ${num}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to dynamically fit map bounds to markers
const MapBoundsAdjuster: React.FC<{ coordinates: [number, number][] }> = ({ coordinates }) => {
  const map = useMap();

  React.useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates.map((c) => L.latLng(c[0], c[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [coordinates, map]);

  return null;
};

export const ItineraryMap: React.FC<ItineraryMapProps> = ({ activities, destinationName }) => {
  // Filter activities with valid coords
  const markers = useMemo(() => {
    return activities
      .filter((act) => act.latitude !== undefined && act.longitude !== undefined)
      .map((act, index) => ({
        ...act,
        lat: act.latitude as number,
        lng: act.longitude as number,
        displayOrder: index + 1,
      }));
  }, [activities]);

  const defaultCenter: [number, number] =
    markers.length > 0 ? [markers[0].lat, markers[0].lng] : [35.0116, 135.7681]; // Default Kyoto coords

  const coordinates: [number, number][] = markers.map((m) => [m.lat, m.lng]);

  return (
    <div className="bg-white rounded-3xl border border-[#E8F0E4] p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Interactive Route Map
          </span>
          <h3 className="font-serif text-xl font-bold text-[#1A1A2E]">
            {destinationName || 'Destinations & Landmarks'}
          </h3>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing {markers.length} pinned sights with day sequence
        </div>
      </div>

      <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-gray-200 relative">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {coordinates.length > 0 && <MapBoundsAdjuster coordinates={coordinates} />}

          {markers.map((marker) => (
            <Marker
              key={marker.id || marker.displayOrder}
              position={[marker.lat, marker.lng]}
              icon={createNumberedPin(marker.displayOrder)}
            >
              <Popup className="custom-popup">
                <div className="p-1 space-y-1.5 max-w-xs">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E8F0E4] text-[#2D5016]">
                    Stop #{marker.displayOrder} • {marker.category}
                  </span>
                  <h4 className="font-bold text-sm text-[#1A1A2E] leading-tight">
                    {marker.name}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {marker.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#87A96B]" />
                      {marker.start_time}
                    </span>
                    <span className="font-semibold text-[#2D5016]">
                      {marker.estimated_cost === 0
                        ? 'Free'
                        : formatCurrency(marker.estimated_cost, marker.currency)}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
