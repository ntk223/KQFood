// location.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { Public } from '@/decorator/customize';
type DeliveryQuery = {
  userLat: number;
  userLon: number;
  merchantLat: number;
  merchantLon: number;
}
@Public()
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('autocomplete')
  async autocomplete(@Query('q') query: string) {
    return this.locationService.searchAddress(query);
  }

  @Get('shipping-fee')
  async calculateDeliveryFee(@Query() query: DeliveryQuery) {
    const route = await this.locationService.getRouting(
      query.merchantLat, 
      query.merchantLon,
      query.userLat, 
      query.userLon
    );

    return {
      distance: `${route.distanceMeters / 1000} km`,
      duration: `${Math.ceil(route.timeSeconds / 60)} phút`,
      shippingFee: `${route.shippingFee.toLocaleString('vi-VN')} VNĐ`
    };
  }
}