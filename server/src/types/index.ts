export interface User {
  id: string;
  email: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal?: string;
  hasSecondLastName: boolean;
  phone: string;
  passwordHash: string;
  createdAt: string;
}

export type PlateColor = 'yellow' | 'red' | 'black';

export interface MenuItem {
  id: string;
  name: string;
  japaneseName: string;
  category: 'Nigiri' | 'Gunkan' | 'Makimono' | 'Side Dishes' | 'Desserts' | 'Drinks';
  plateColor: PlateColor;
  priceYen: number;
  description: string;
  emoji: string;
  calories: number;
  isSpicy?: boolean;
  allergens?: string[];
  stock: number;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
}

export interface SauceSelection {
  shoyuNormal: boolean;
  shoyuSweet: boolean;
  wasabiExtra: boolean;
  gariGinger: boolean;
  matchaPowderDrops: number;
}

export interface SatisfactionSurvey {
  rating: number;
  willingToReturn: boolean;
  comments: string;
}

export interface Order {
  id: string;
  userId: string;
  tableNumber: number;
  items: OrderItem[];
  sauces: SauceSelection;
  survey?: SatisfactionSurvey;
  deliveryDetails: {
    firstName: string;
    lastNamePaternal: string;
    lastNameMaternal?: string;
    phone: string;
  };
  totalYen: number;
  taxYen: number;
  status: 'PENDING' | 'PREPARING' | 'ON_CONVEYOR_BELT' | 'COMPLETED' | 'CANCELLED';
  paid: boolean;
  paymentMethod?: string;
  createdAt: string;
}
