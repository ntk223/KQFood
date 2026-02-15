export interface SavedLocation {
  name: string;    // VD: "Nhà riêng", "Công ty"
  address: string; // VD: "123 Đường A, Quận B..."
  lat: number;
  long: number;
}

export interface AutoCompleteResponseFormatted {
  name: string;
  address: string;
  lat: number;
  long: number;
}

export interface RoutingRespnseFormatted {
  distanceMeters: number;
  timeSeconds: number;
  shippingFee: number;
}