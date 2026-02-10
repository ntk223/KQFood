import type { GeoPoint } from "@/interfaces/geopoint.interface";

export function calculateDeliveryFee(from : GeoPoint, to : GeoPoint): number {

    // const distance = Math.sqrt(
    //     Math.pow(to.coordinates[0] - from.coordinates[0], 2) 
    //     + Math.pow(to.coordinates[1] - from.coordinates[1], 2)) 
    //     * 111;
    const distance = 10; // Giả sử khoảng cách là 10km để test
    if (distance <= 3) {
        return 15000; // Phí giao hàng cho khoảng cách <= 3km
    }

    return 15000 + (distance - 3) * 5000; // Phí cơ bản + phí thêm cho mỗi km vượt quá 3km
}