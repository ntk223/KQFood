export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [Longitude, Latitude] - Cực kỳ lưu ý thứ tự này!
}