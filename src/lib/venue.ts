// Ubicación de Plenty (Avinguda de s'Agaró, 93, Platja d'Aro) — el mismo pin
// que el enlace de Google Maps de la carta. Se usa para que "Pedir ya" solo
// funcione desde el local y no desde casa con el enlace guardado.
export const VENUE = { lat: 41.8141524, lng: 3.0640613 };

// Radio permitido alrededor del local. Es holgado a propósito: el GPS dentro
// de un edificio puede desviarse varias decenas de metros, y un falso "no estás
// aquí" a un cliente sentado en la mesa es peor que dejar pasar a un vecino.
export const VENUE_RADIUS_M = 150;

// El navegador indica la precisión de la lectura (en metros). La descontamos de
// la distancia, pero como mucho este margen: una lectura de ±2 km no debe
// bastar para "estar dentro".
const MAX_ACCURACY_MARGIN_M = 150;

export interface GeoReading {
  lat: number;
  lng: number;
  accuracy: number;
}

export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function isNearVenue({ lat, lng, accuracy }: GeoReading): boolean {
  const margin = Math.min(Math.max(accuracy || 0, 0), MAX_ACCURACY_MARGIN_M);
  return distanceMeters({ lat, lng }, VENUE) - margin <= VENUE_RADIUS_M;
}
