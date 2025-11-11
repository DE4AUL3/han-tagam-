// Общие интерфейсы для всей системы

export interface RestaurantSettings {
  id: string;
  name: {
    ru: string;
    tk: string;
  };
  logo?: string;
  phones: string[];
  workingHours: {
    from: string;
    to: string;
  };
  address?: {
    ru: string;
    tk: string;
  };
  description?: {
    ru: string;
    tk: string;
  };
  currency?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameTk: string;
  description?: string;
  descriptionTk?: string;
  image: string;
  dishPageImage?: string; // Отдельное фото для страницы блюд
  gradient: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Dish {
  id: string;
  name: {
    ru: string;
    tk: string;
  };
  description?: {
    ru: string;
    tk: string;
  };
  price: number; // В ТМТ
  image?: string;
  categoryId: string;
  isActive: boolean;
  isAvailable?: boolean;
  isPopular?: boolean;
  preparationTime?: number; // в минутах
  calories?: number;
  weight?: number; // в граммах
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id?: string;
  dishId: string;
  mealId?: string; // Алиас для dishId для совместимости с БД
  dishName: string;
  dishNameTk: string;
  price: number;
  quantity: number;
  amount?: number; // Алиас для quantity для совместимости с БД
  total: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  customerAddress?: string; // Алиас для обратной совместимости
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  status: 'pending' | 'new' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: string;
  firstOrderDate: string;
  isActive: boolean;
}

// Настройки доставки и корзины
export interface DeliveryZone {
  id: string;
  name: {
    ru: string;
    tk: string;
  };
  price: number;
  isActive: boolean;
  minOrderAmount?: number;
  estimatedTime: {
    from: number;
    to: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartSettings {
  id: string;
  restaurantId: string;
  deliveryZones: DeliveryZone[];
  deliveryPrice: number; // Новое поле: глобальная цена доставки
  minOrderAmount: number;
  freeDeliveryAmount?: number;
  currency: string;
  workingHours: {
    from: string;
    to: string;
  };
  workingDays: number[]; // 0-6 (воскресенье-суббота)
  isDeliveryEnabled: boolean;
  isTakeawayEnabled: boolean;
  orderProcessingTime: {
    min: number;
    max: number;
  };
  settings: {
    allowScheduledOrders: boolean;
    requirePhone: boolean;
    requireAddress: boolean;
    maxItemsPerOrder?: number;
    autoConfirmOrders: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// События для системы уведомлений
export interface DataServiceEvent {
  type: 'order_created' | 'order_updated' | 'dish_created' | 'dish_updated' | 'dish_deleted' | 'category_updated' | 'restaurant_updated' | 'cart_settings_updated' | 'delivery_zone_updated';
  data: any;
  timestamp: string;
}

export type EventCallback = (event: DataServiceEvent) => void;