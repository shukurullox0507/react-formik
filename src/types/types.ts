export interface Address {
    streetName?: string;
    postalCode?: string;
    apartmentNumber?: string | number;
    state?: string;
    country?: string;
}

export interface DataType {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    addresses?: Address[];
}