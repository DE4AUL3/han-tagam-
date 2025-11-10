

export interface DatabaseClient {
  id: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseCategory {
  id: string;
  nameRu: string;
  nameTk: string;
  descriptionRu?: string | null;
  descriptionTk?: string | null;
  imageCard: string;
  imageBackground: string;
  order: number;
  status: boolean;
  restaurantId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseMeal {
  id: string;
  nameRu: string;
  nameTk: string;
  categoryId: string;
  price: number;
  descriptionRu?: string | null;
  descriptionTk?: string | null;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseOrder {
  id: string;
  phoneNumber: string;
  clientId?: string | null;
  totalAmount: number;
  status: string;
  notes?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseOrderItem {
  id: string;
  orderId: string;
  mealId: string;
  amount: number;
  price: number;
  createdAt: Date;
}

// Типы для создания новых записей
export interface CreateClient {
  phoneNumber: string;
}

export interface CreateCategory {
  nameRu: string;
  nameTk: string;
  descriptionRu?: string;
  descriptionTk?: string;
  imageCard: string;
  imageBackground: string;
  order: number;
  status?: boolean;
  restaurantId?: number;
}

export interface CreateMeal {
  nameRu: string;
  nameTk: string;
  categoryId: string;
  price: number;
  descriptionRu?: string;
  descriptionTk?: string;
  image: string;
}

export interface CreateOrder {
  phoneNumber: string;
  clientId?: string;
  products: Array<{
    id: string;
    amount: number;
  }>;
}

// Типы для обновления записей
export interface UpdateCategory {
  nameRu?: string;
  nameTk?: string;
  descriptionRu?: string | null;
  descriptionTk?: string | null;
  imageCard?: string;
  imageBackground?: string;
  order?: number;
  status?: boolean;
  restaurantId?: number;
}

export interface UpdateMeal {
  nameRu?: string;
  nameTk?: string;
  categoryId?: string;
  price?: number;
  descriptionRu?: string | null;
  descriptionTk?: string | null;
  image?: string;
}

export interface UpdateOrder {
  status?: string;
  totalAmount?: number;
}

// Локализованные типы для фронтенда
export interface LocalizedCategory {
  id: string;
  name: string;
  description?: string | null;
  imageCard: string;
  imageBackground: string;
  order: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  restaurantId?: string;
  meals?: LocalizedMeal[];
}

export interface LocalizedMeal {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  description?: string | null;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  category?: LocalizedCategory;
}

export interface LocalizedOrder {
  id: string;
  phoneNumber: string;
  clientId?: string | null;
  totalAmount: number;
  status: string;
  notes?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
  client?: DatabaseClient;
  orderItems?: LocalizedOrderItem[];
}

export interface LocalizedOrderItem {
  id: string;
  orderId: string;
  mealId: string;
  amount: number;
  price: number;
  createdAt: Date;
  meal?: LocalizedMeal;
}

// Языки
export type Language = 'ru' | 'tk';

// Утилитарные типы для работы с локализацией
export interface LocalizationFields {
  nameRu: string;
  nameTk: string;
  descriptionRu?: string | null;
  descriptionTk?: string | null;
}

export function getLocalizedName(item: LocalizationFields, language: Language): string {
  return language === 'tk' ? item.nameTk : item.nameRu;
}

export function getLocalizedDescription(item: LocalizationFields, language: Language): string | null {
  const description = language === 'tk' ? item.descriptionTk : item.descriptionRu;
  return description ?? null;
}