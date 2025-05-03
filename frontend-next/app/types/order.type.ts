export interface Address {
    city: string;
    country: string;
    state: string;
    zipcode: string;
}

export interface Order {
    id?: number;
    name: string;
    email?: string;
    address: Address;
    phone: string;
    book_ids: number[];
    total_price: number;
}

export interface OrderResponse extends Order {
    id: number;
    created_at: string;
    updated_at: string;
}