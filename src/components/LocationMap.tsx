import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const KYIV: [number, number] = [50.4501, 30.5234];
const FALLBACK_ZOOM = 12;
const GEOLOCATION_ZOOM = 14;
const ACCENT = '#c5433e';

const PIN_HTML = `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:${ACCENT};transform:rotate(-45deg);border:3px solid white;box-shadow:0 6px 14px rgba(61,44,46,0.35);"></div>`;

interface Props {
  date: string | null;
}

type AddressState = { status: 'loading' } | { status: 'ready'; label: string } | { status: 'error' };

export default function LocationMap({ date }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<AddressState | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      const pinIcon = L.divIcon({ className: '', html: PIN_HTML, iconSize: [32, 32], iconAnchor: [16, 32] });

      const map = L.map(containerRef.current).setView(KYIV, FALLBACK_ZOOM);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      map.on('click', (event: LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        setPosition({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng(event.latlng);
        } else {
          markerRef.current = L.marker(event.latlng, { icon: pinIcon }).addTo(map);
        }
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (geoPosition) => {
            if (cancelled) return;
            map.setView([geoPosition.coords.latitude, geoPosition.coords.longitude], GEOLOCATION_ZOOM);
          },
          () => {
            // geolocation denied or unavailable — keep the Kyiv fallback view
          },
          { timeout: 8000 },
        );
      }
    }

    init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!position) return;

    const controller = new AbortController();
    setAddress({ status: 'loading' });

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.lat}&lon=${position.lng}&accept-language=uk`;

    fetch(url, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('reverse geocode failed'))))
      .then((data: { display_name?: string }) => {
        setAddress(data.display_name ? { status: 'ready', label: data.display_name } : { status: 'error' });
      })
      .catch(() => {
        if (!controller.signal.aborted) setAddress({ status: 'error' });
      });

    return () => controller.abort();
  }, [position]);

  const params = new URLSearchParams();
  if (date) params.set('date', date);
  if (position) {
    params.set('lat', position.lat.toFixed(6));
    params.set('lng', position.lng.toFixed(6));
  }
  if (address?.status === 'ready') params.set('address', address.label);

  const addressLabel =
    address?.status === 'ready'
      ? address.label
      : address?.status === 'loading'
        ? 'Визначаємо адресу…'
        : position
          ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
          : '';

  return (
    <>
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {position && (
        <div className="absolute bottom-6 left-4 z-20 w-[calc(100%-2rem)] max-w-sm rounded-3xl bg-card/95 p-5 shadow-[0_20px_45px_-10px_rgba(61,44,46,0.35)] backdrop-blur sm:left-8">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Обране місце</p>
              <p className="truncate text-sm text-ink">{addressLabel}</p>
            </div>
          </div>
          <a
            href={`/confirm?${params.toString()}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white shadow-[0_10px_20px_-8px_rgba(197,67,62,0.6)] transition hover:bg-accent-dark"
          >
            Далі
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6l6 6-6 6M4.5 12h15" />
            </svg>
          </a>
        </div>
      )}
    </>
  );
}
