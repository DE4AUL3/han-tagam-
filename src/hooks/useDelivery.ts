'use client';

import { useState, useEffect } from 'react';

export interface DeliverySettings {
  id: string;
  fee: number;
  freeDeliveryFrom: number;
  enabled: boolean;
  zones: {
    name: string;
    fee: number;
    radius: number;
  }[];
}

export interface DeliveryCalculation {
  deliveryFee: number;
  isFree: boolean;
  freeDeliveryFrom: number;
  remainingForFree?: number;
}

export function useDelivery() {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка настроек доставки
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/delivery');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
        setError(null);
      } else {
        setError(data.error || 'Ошибка загрузки настроек доставки');
      }
    } catch (err) {
      setError('Не удалось загрузить настройки доставки');
      console.error('Ошибка загрузки настроек доставки:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление настроек доставки
  const updateSettings = async (newSettings: Partial<DeliverySettings>) => {
    try {
      const response = await fetch('/api/delivery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
        setError(null);
        return true;
      } else {
        setError(data.error || 'Ошибка обновления настроек доставки');
        return false;
      }
    } catch (err) {
      setError('Не удалось обновить настройки доставки');
      console.error('Ошибка обновления настроек доставки:', err);
      return false;
    }
  };

  // Расчет стоимости доставки
  const calculateDelivery = async (cartTotal: number, zone = 'default'): Promise<DeliveryCalculation | null> => {
    try {
      const response = await fetch('/api/delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartTotal, zone }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          deliveryFee: data.deliveryFee,
          isFree: data.isFree,
          freeDeliveryFrom: data.freeDeliveryFrom,
          remainingForFree: data.remainingForFree,
        };
      } else {
        setError(data.error || 'Ошибка расчета стоимости доставки');
        return null;
      }
    } catch (err) {
      setError('Не удалось рассчитать стоимость доставки');
      console.error('Ошибка расчета стоимости доставки:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    calculateDelivery,
  };
}
