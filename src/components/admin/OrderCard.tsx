function getStatusBadgeClass(status: string) {
  const baseClass = 'px-2 py-1 rounded-full text-xs font-semibold shadow-sm';
  switch (status) {
    case 'new':
    case 'pending':
      return `${baseClass} bg-gray-100 text-gray-800 border border-gray-200`;
    case 'confirmed':
      return `${baseClass} bg-yellow-100 text-yellow-800 border border-yellow-200`;
    case 'preparing':
      return `${baseClass} bg-orange-50 text-orange-700 border border-orange-200`;
    case 'ready':
    case 'delivering':
      return `${baseClass} bg-emerald-50 text-emerald-700 border border-emerald-200`;
    case 'delivered':
    case 'completed':
      return `${baseClass} bg-green-50 text-green-700 border border-green-200`;
    case 'cancelled':
      return `${baseClass} bg-red-50 text-red-700 border border-red-200`;
    default:
      return baseClass;
  }
}
// Локальные утилиты для статусов, дат, валюты и названия блюда
const statusLabels: Record<string, { ru: string; tk: string }> = {
  new: { ru: 'Новый', tk: 'Täze' },
  pending: { ru: 'Ожидающий', tk: 'Garaşýan' },
  confirmed: { ru: 'Подтвержден', tk: 'Tassyklandy' },
  preparing: { ru: 'Готовится', tk: 'Taýýarlanýar' },
  ready: { ru: 'Готов', tk: 'Taýýar' },
  delivering: { ru: 'Доставляется', tk: 'Eltip berilýär' },
  delivered: { ru: 'Доставлен', tk: 'Eltip berildi' },
  completed: { ru: 'Завершен', tk: 'Tamamlandy' },
  cancelled: { ru: 'Отменен', tk: 'Ýatyryldy' },
};

function getStatusText(status: string, language: 'ru' | 'tk') {
  return statusLabels[status]?.[language] || status;
}

function formatDate(dateString: string, language: 'ru' | 'tk') {
  const date = new Date(dateString);
  return date.toLocaleString(language === 'ru' ? 'ru-RU' : 'tk-TM', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number) {
  return `${amount.toFixed(2)} TMT`;
}

function getDishTitle(item: any, lang: 'ru' | 'tk' = 'ru') {
  if (lang === 'ru') {
    return item.dishName || item.raw?.meal?.nameRu || item.raw?.meal?.name || item.nameRu || item.title || '';
  }
  return item.dishNameTk || item.raw?.meal?.nameTk || item.raw?.meal?.name || item.nameTk || '';
}
import React from 'react';
import { Clock, User, Phone, MapPin, Package, ChevronRight, MessageSquare } from 'lucide-react';
import CopyPhoneButton from './CopyPhoneButton';
import { useLanguage } from '@/hooks/useLanguage';
import { Order } from '@/types/common';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
  onStatusChange: (id: string, status: Order['status']) => void;
  activeTab: 'active' | 'history' | 'analytics';
  loading: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onClick,
  onStatusChange,
  activeTab,
  loading
}) => {
  const { currentLanguage } = useLanguage();

  // Кнопка "Подтвердить" только для new/pending
  const showConfirmButton = activeTab === 'active' && (order.status === 'new' || order.status === 'pending');

  // Для вкладки история: показывать только статус "Подтвержден" или "Отклонен"
  if (activeTab === 'history' && !(order.status === 'confirmed' || order.status === 'cancelled')) {
    return null;
  }

  return (
    <div
      className={
        `group block rounded-2xl border overflow-hidden cursor-pointer backdrop-blur-sm p-0
        bg-white
        border-gray-100
        shadow-sm hover:shadow-xl transition-all duration-200
        hover:border-emerald-400 hover:bg-emerald-50/60
        active:scale-[0.98]`
      }
      style={{ boxShadow: '0 2px 12px 0 rgba(16, 185, 129, 0.08)' }}
      onClick={onClick}
    >
      {/* Верхняя часть: статус, номер, дата */}
  <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 text-lg font-bold shadow-md group-hover:bg-emerald-200/80 transition-colors">
            <Package className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">#{order.id.slice(-6)}</span>
              <span className={getStatusBadgeClass(order.status)}>{getStatusText(order.status, currentLanguage === 'ru' ? 'ru' : 'tk')}</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(order.createdAt, currentLanguage === 'ru' ? 'ru' : 'tk')}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-extrabold text-xl text-emerald-900 group-hover:text-emerald-900 transition-colors">{formatCurrency(order.totalAmount)}</p>
          <span className="text-xs text-gray-400 group-hover:text-emerald-600 transition-colors">{order.items.length} {currentLanguage === 'ru' ? 'позиций' : 'pozisiýa'}</span>
        </div>
      </div>

      {/* Контент: клиент, состав заказа, кнопки */}
      <div className="px-6 pb-6 pt-2">
        {/* Информация о клиенте */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-4">
    <div className="flex items-center gap-2">
  <Phone className="w-4 h-4 text-gray-500" />
  <span className="text-sm text-gray-900">{order.customerPhone}</span>
  <CopyPhoneButton phone={order.customerPhone} />
    </div>
          {order.customerAddress && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-600 line-clamp-1">{order.customerAddress}</span>
            </div>
          )}
            {/* Небольшой превью комментария, если есть */}
            {order.notes && (
              <div className="mt-3 sm:mt-0 sm:ml-4 flex items-start gap-2 w-full max-w-md">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                <div className="text-sm text-gray-600 line-clamp-2 bg-gray-50/60 rounded-md p-2 border border-gray-100">
                  <span className="font-semibold text-gray-700 mr-1">{currentLanguage === 'ru' ? 'Комментарий:' : 'Teswirnama:'}</span>
                  <span>{order.notes}</span>
                </div>
              </div>
            )}
        </div>

        {/* Состав заказа */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">
            {currentLanguage === 'ru' ? 'Состав заказа' : 'Sargyt düzümi'}
          </h4>
          <div className="bg-white rounded-xl p-3 border border-gray-100 group-hover:border-emerald-300 transition-colors">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between py-1 text-sm">
                <div className="flex items-baseline">
                  <span className="font-medium text-gray-800">{item.quantity}×</span>
                  <span className="ml-2 text-gray-700 line-clamp-1">{currentLanguage === 'ru' ? getDishTitle(item, 'ru') : getDishTitle(item, 'tk')}</span>
                </div>
                <span className="text-emerald-900">{formatCurrency(item.total)}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-xs text-emerald-600 flex items-center justify-center mt-1 font-semibold group-hover:text-emerald-800 transition-colors">
                <span className="mr-1">+{order.items.length - 2} {currentLanguage === 'ru' ? 'еще' : 'has-da'}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>

        {/* Кнопки управления */}
        {activeTab === 'active' && (
          <div className="flex gap-2 mt-2">
            {showConfirmButton && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onStatusChange(order.id, 'confirmed');
                }}
                disabled={loading}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors disabled:opacity-50 grow"
              >
                {currentLanguage === 'ru' ? 'Подтвердить' : 'Tassykla'}
              </button>
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                onStatusChange(order.id, 'cancelled');
              }}
              disabled={loading}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors disabled:opacity-50 grow"
            >
              {currentLanguage === 'ru' ? 'Отменить' : 'Ýatyr'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;