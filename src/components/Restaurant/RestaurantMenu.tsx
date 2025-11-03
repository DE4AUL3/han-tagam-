'use client';

import type { MenuItem, CartItem } from "@/types/menu";
import { Star, Clock, Plus, Minus, ShoppingCart } from "lucide-react";
import Header from '@/components/Header';

import React, { useState } from "react";
interface RestaurantMenuProps {
  restaurant: {
    id: string;
    name: string;
    whatsapp: string;
    rating?: number;
    address?: string;
    // Добавьте другие поля, если нужно
  };
  menuItems: MenuItem[];
  categories: string[];
}

export default function RestaurantMenu({ restaurant, menuItems, categories }: RestaurantMenuProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const allCategories = ["Все", ...categories];
  const filteredItems = selectedCategory === "Все"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item: MenuItem) =>
    setCart((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...item, quantity: 1 }]
    );

  const removeFromCart = (itemId: string) =>
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );

  const getItemQuantity = (itemId: string) =>
    cart.find((item) => item.id === itemId)?.quantity || 0;

  const getCartSummary = (): { totalPrice: number; totalItems: number } => ({
    totalPrice: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    totalItems: cart.reduce((sum, i) => sum + i.quantity, 0),
  });

  const formatPrice = (value: number) =>
    value.toLocaleString("ru-RU") + " сом";

  const handleOrder = () => {
    if (cart.length === 0) return;

    const { totalPrice } = getCartSummary();
    const orderText =
      `🛒 *Заказ из ${restaurant.name}*\n\n` +
      cart
        .map(
          (item) =>
            `${item.name} x${item.quantity} - ${formatPrice(
              item.price * item.quantity
            )}`
        )
        .join("\n") +
      `\n\n💰 *Итого: ${formatPrice(totalPrice)}*\n\n📍 Адрес доставки: _укажите адрес_`;

    const whatsappUrl = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(
      orderText
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const { totalItems, totalPrice } = getCartSummary();

  return (
    <div>
      <Header restaurantName={restaurant.name} />
      <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Информация о ресторане */}
            <div className="text-center w-full">
              <h1 className="text-xl font-light text-[--text-main]">{restaurant.name}</h1>
              <div className="flex items-center justify-center gap-4 mt-1 text-sm text-[--text-secondary]">
                <div className="flex items-center gap-1">
                  {/* Здесь можно добавить иконку рейтинга, если нужно */}
                  {restaurant.rating && (
                    <>
                      <span className="font-semibold">{restaurant.rating}</span>
                      <span className="ml-1">★</span>
                    </>
                  )}
                </div>
                {restaurant.address && <div>{restaurant.address}</div>}
              </div>
            </div>
            {/* Корзина */}
            {cart.length > 0 && (
              <div className="flex items-center">
                <button
                  className="bg-[--gold] text-white rounded px-4 py-2 font-semibold shadow"
                  onClick={handleOrder}
                >
                  Оформить заказ ({totalItems})
                </button>
              </div>
            )}
          </div>
        </div>
      {/* Категории */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex gap-2 overflow-x-auto">
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border font-medium transition-colors whitespace-nowrap ${selectedCategory === cat ? "bg-[--gold] text-white border-[--gold]" : "bg-white text-[--text-main] border-gray-300"}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Меню */}
      <div className="container mx-auto px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-400 py-16">Нет блюд в этой категории</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                <div className="flex-1">
                  <div className="font-semibold text-lg text-[--text-main]">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-[--text-secondary] mt-1">{item.description}</div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="font-bold text-[--gold] text-lg">{formatPrice(item.price)}</div>
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-[--gold] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                    {getItemQuantity(item.id) > 0 && (
                      <>
                        <span className="mx-2 text-[--text-main]">{getItemQuantity(item.id)}</span>
                        <button
                          className="bg-gray-200 text-[--text-main] rounded-full w-8 h-8 flex items-center justify-center font-bold"
                          onClick={() => removeFromCart(item.id)}
                        >
                          -
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Фиксированная кнопка заказа для мобильных */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-gray-200 p-4 flex justify-center shadow-lg">
          <button
            className="bg-[--gold] text-white rounded-full px-8 py-3 font-bold text-lg shadow"
            onClick={handleOrder}
          >
            Оформить заказ • {formatPrice(totalPrice)}
          </button>
        </div>
      )}
    </div>
  );
}
