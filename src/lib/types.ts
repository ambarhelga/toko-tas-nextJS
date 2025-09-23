export interface Bag {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  imageHint: string;
  type: 'Tote' | 'Crossbody' | 'Backpack' | 'Clutch' | 'Satchel' | 'Hobo';
  brand: 'ChicVogue' | 'LuxeCarry' | 'UrbanTote' | 'Eleganté';
}

export interface CartItem {
  bag: Bag;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveryOption: 'Standard' | 'Express';
}

export interface User {
  id: string;
  name: string;
  email: string;
}
