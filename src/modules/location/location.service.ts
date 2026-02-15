// location.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { calculateDeliveryFeeV2 } from '../../utils/caculateDeliveryFee.helper';
import type { AutoCompleteResponseFormatted, RoutingRespnseFormatted } from '@/interfaces/location.interface';
@Injectable()
export class LocationService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.getOrThrow<string>('GEOAPIFY_API_KEY');
    this.baseUrl = this.configService.getOrThrow<string>('GEOAPIFY_BASE_URL');
  }

  // 1. Gợi ý địa chỉ (Address Autocomplete)
  async searchAddress(query: string) : Promise<AutoCompleteResponseFormatted[]> {
    const url = `${this.baseUrl}/geocode/autocomplete`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            text: query,
            apiKey: this.apiKey,
            lang: 'vi', // Trả về tiếng Việt
            limit: 5,
            filter: 'countrycode:vn' // Chỉ tìm ở Việt Nam
          },
        }),
      );
    return response.data.features.map((feature): AutoCompleteResponseFormatted => ({
      name: feature.properties.name,
      address: feature.properties.formatted,
      lat: feature.properties.lat,
      long: feature.properties.lon,
    }));
    } catch (error) {
      throw new HttpException('Lỗi khi gọi Geoapify', HttpStatus.BAD_GATEWAY);
    }
  }

  // 2. Reverse Geocoding (Lấy địa chỉ từ tọa độ lat/lon)
  async getAddressFromCoordinates(lat: number, lon: number) {
    const url = `${this.baseUrl}/geocode/reverse`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            lat,
            lon,
            apiKey: this.apiKey,
            lang: 'vi',
          },
        }),
      );
      return response.data.features[0]?.properties?.formatted;
    } catch (error) {
      throw new HttpException('Không thể xác định vị trí', HttpStatus.BAD_GATEWAY);
    }
  }

  // 3. Tính khoảng cách và thời gian (Routing)
  // Dùng để tính phí ship chính xác
  async getRouting(startLat: number, startLon: number, endLat: number, endLon: number) : Promise<RoutingRespnseFormatted> {
    const url = `${this.baseUrl}/routing`;
    const waypoints = `${startLat},${startLon}|${endLat},${endLon}`;
    console.log(waypoints);
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            waypoints,
            mode: 'motorcycle', // Chế độ xe máy cho shipper
            apiKey: this.apiKey,
          },
        }),
      );
      
      const route = response.data.features[0].properties;
      return {
        distanceMeters: route.distance,
        timeSeconds: route.time,
        shippingFee: calculateDeliveryFeeV2(route.distance)
      };
    } catch (error) {
      throw new HttpException('Không thể tính đường đi', HttpStatus.BAD_GATEWAY);
    }
  }
}