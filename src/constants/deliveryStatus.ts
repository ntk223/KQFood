export enum DeliveryStatus {
    SEARCHING='SEARCHING',
    ASSIGNED='ASSIGNED',
    ARRIVED_MERCHANT='ARRIVED_MERCHANT',
    PICKED_UP='PICKED_UP',
    DELIVERING='DELIVERING',
    DELIVERED='DELIVERED',
    FAILED='FAILED',
    CANCELLED='CANCELLED',
}

export const DELIVERY_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
    [DeliveryStatus.SEARCHING]: [DeliveryStatus.ASSIGNED, DeliveryStatus.CANCELLED],
    [DeliveryStatus.ASSIGNED]: [DeliveryStatus.ARRIVED_MERCHANT, DeliveryStatus.CANCELLED],
    [DeliveryStatus.ARRIVED_MERCHANT]: [DeliveryStatus.PICKED_UP, DeliveryStatus.CANCELLED],
    [DeliveryStatus.PICKED_UP]: [DeliveryStatus.DELIVERING, DeliveryStatus.FAILED],
    [DeliveryStatus.DELIVERING]: [DeliveryStatus.DELIVERED, DeliveryStatus.FAILED],
    [DeliveryStatus.DELIVERED]: [],
    [DeliveryStatus.FAILED]: [],
    [DeliveryStatus.CANCELLED]: []
};

export function canTransitionDeliveryStatus(currentStatus: DeliveryStatus, newStatus: DeliveryStatus): boolean {
    if (currentStatus === newStatus) {
        return true;
    }
    return DELIVERY_TRANSITIONS[currentStatus].includes(newStatus);
}
