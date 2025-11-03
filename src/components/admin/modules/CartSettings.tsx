"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { dataService } from "@/lib/dataService";
import { DollarSign, Edit, Save, X } from "lucide-react";

interface CartSettingsProps {
  restaurantId: string;
}

const CartSettings: React.FC<CartSettingsProps> = ({ restaurantId }) => {
  const { currentLanguage: language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(50);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await dataService.getCartSettings(restaurantId);
      if (settings) {
        setDeliveryPrice(settings.deliveryPrice || 50);
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await dataService.saveCartSettings({
        id: `cart_${restaurantId}`,
        restaurantId,
        deliveryPrice,
        currency: "ТМТ",
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      // Уведомляем другие компоненты об изменении
      dataService.emitEvent({
        type: "cart_settings_updated",
        data: { deliveryPrice }
      });
    } catch (error) {
      console.error("Ошибка сохранения настроек:", error);
    }
  };

  if (isLoading) {
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
              onClick={() => setIsEditing(true)}
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
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>{language === "ru" ? "Отмена" : "Ýatyr"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Цена доставки */}
      <div className="p-6 rounded-lg border bg-white border-gray-200">
        <div className="flex items-center mb-4">
          <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {language === "ru" ? "Стоимость доставки" : "Eltip bermek bahasy"}
          </h3>
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={deliveryPrice}
              onChange={(e) => setDeliveryPrice(Number(e.target.value))}
              className="w-32 px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-900"
              min={0}
            />
            <span className="text-gray-600">ТМТ</span>
          </div>
        ) : (
          <div className="text-xl font-bold">
            {deliveryPrice} ТМТ
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSettings;
