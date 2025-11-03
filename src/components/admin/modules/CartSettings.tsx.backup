// --- END OF FILE ---
"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { dataService } from "@/lib/dataService";
import { DollarSign, Edit, Save, X } from "lucide-react";

interface CartSettingsProps {
  restaurantId: string;
}

const CartSettings: React.FC<CartSettingsProps> = ({ restaurantId }) => {
  // const { isDarkMode } = useTheme();
  const { currentLanguage: language } = useLanguage();
  const [cartSettings, setCartSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  useEffect(() => {
    loadCartSettings();
    // eslint-disable-next-line
  }, [restaurantId]);

  const loadCartSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await dataService.getCartSettings(restaurantId);
      if (settings) {
        setCartSettings(settings);
        setDeliveryPrice(settings.deliveryPrice || 0);
      } else {
        const defaultSettings = {
          id: `cart_${restaurantId}`,
          restaurantId,
          deliveryZones: [],
          deliveryPrice: 0,
          minOrderAmount: 50,
          freeDeliveryAmount: 200,
          currency: "ТМТ",
          workingHours: { from: "09:00", to: "22:00" },
          workingDays: [1, 2, 3, 4, 5, 6],
          isDeliveryEnabled: true,
          isTakeawayEnabled: true,
          orderProcessingTime: { min: 30, max: 60 },
          settings: {
            allowScheduledOrders: true,
            requirePhone: true,
            requireAddress: true,
            autoConfirmOrders: false,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCartSettings(defaultSettings);
        setDeliveryPrice(0);
        await dataService.saveCartSettings(defaultSettings);
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек корзины:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!cartSettings) return;
    try {
      const updatedSettings = {
        ...cartSettings,
        deliveryPrice: deliveryPrice,
        updatedAt: new Date().toISOString(),
      };
      await dataService.saveCartSettings(updatedSettings);
      setCartSettings(updatedSettings);
      setIsEditing(false);
      dataService.emitEvent({
        type: "cart_settings_updated",
        data: updatedSettings,
      });
    } catch (error) {
      console.error("Ошибка сохранения настроек:", error);
    }
  };

  const handleEditSettings = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDeliveryPrice(cartSettings?.deliveryPrice || 0);
  };

  if (isLoading || !cartSettings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === "ru" ? "Настройки доставки" : "Eltip bermek sazlamalary"}
          </h2>
        </div>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEditSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>{language === "ru" ? "Редактировать" : "Üýtgetmek"}</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{language === "ru" ? "Сохранить" : "Ýatda saklamak"}</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>{language === "ru" ? "Отмена" : "Ýatyr"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Глобальная цена доставки */}
  <div className="p-6 rounded-lg border bg-white border-gray-200">
        <div className="flex items-center mb-4">
          <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{language === "ru" ? "Цена доставки" : "Eltip bermek bahasy"}</h3>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={deliveryPrice}
              onChange={e => setDeliveryPrice(Number(e.target.value))}
              className="w-32 px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-900"
              min={0}
            />
            <span className="text-gray-600">{cartSettings.currency}</span>
          </div>
        ) : (
          <div className="text-xl font-bold">
            {cartSettings.deliveryPrice} {cartSettings.currency}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSettings;
