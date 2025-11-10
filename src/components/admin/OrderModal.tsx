import React from 'react';
import type { Order } from '@/types/common';
import type { Language } from '@/hooks/useLanguage';

interface OrderModalProps {
  order: Order;
  language: Language;
  activeTab: 'active' | 'history' | 'analytics';
  onClose: () => void;
  onStatusChange: (orderId: string, status: string) => void;
}

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

function getStatusText(status: string, language: Language) {
  return statusLabels[status]?.[language] || status;
}

function formatCurrency(amount: number) {
  return `${amount.toFixed(2)} ТМ`;
}

const OrderModal: React.FC<OrderModalProps> = ({ order, language, activeTab, onClose, onStatusChange }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
  <div className="relative bg-linear-to-br from-white via-gray-50 to-emerald-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-modal-pop" style={{background: 'whitesmoke'}}>
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-emerald-600 text-2xl font-bold rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 z-10 bg-transparent shadow-md backdrop-blur"
        aria-label="Закрыть"
        onClick={onClose}
      >
        ×
      </button>
  <div className="px-8 pt-8 pb-4 border-b border-gray-100 flex flex-col items-center gap-2 bg-transparent">
  <span className="inline-block text-3xl font-extrabold text-emerald-600 tracking-widest drop-shadow">#{order.id.slice(-6)}</span>
  <h2 className="text-lg font-semibold text-gray-900">{language === 'ru' ? 'Детали заказа' : 'Sargyt jikme-jiklikleri'}</h2>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-2">
          <div className="flex-1">
            <div className="mb-2 text-sm text-gray-500">{language === 'ru' ? 'Телефон' : 'Telefon'}</div>
            <div className="font-bold text-gray-900 text-lg">{order.customerPhone}</div>
          </div>
          <div className="flex-1">
            <div className="mb-2 text-sm text-gray-500">{language === 'ru' ? 'Статус' : 'Ýagdaý'}</div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm border border-emerald-200">{getStatusText(order.status, language)}</div>
          </div>
          <div className="flex-1">
            <div className="mb-2 text-sm text-gray-500">{language === 'ru' ? 'Итого' : 'Jemi'}</div>
            <div className="font-extrabold text-emerald-700 text-xl">{formatCurrency(order.totalAmount)}</div>
          </div>
        </div>
        
        {(order.notes || order.address) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            {order.address && (
              <div className="mb-3">
                <div className="mb-1 text-sm font-semibold text-blue-700">{language === 'ru' ? 'Адрес доставки' : 'Eltip berme salgysy'}:</div>
                <div className="text-blue-800">{order.address}</div>
              </div>
            )}
            {order.notes && (
              <div>
                <div className="mb-1 text-sm font-semibold text-blue-700">{language === 'ru' ? 'Комментарий' : 'Teswirnama'}:</div>
                <div className="text-blue-800">{order.notes}</div>
              </div>
            )}
          </div>
        )}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase text-gray-500 tracking-wider">{language === 'ru' ? 'Состав заказа' : 'Sargyt düzümi'}</div>
          <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 text-sm">
                <span className="font-medium text-gray-800">{item.quantity}× {language === 'ru' ? item.dishName : item.dishNameTk}</span>
                <span className="text-gray-700">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-4 justify-end">
          {activeTab === 'active' && [
            ['new', 'pending', 'confirmed', 'preparing', 'ready'].includes(order.status) && (
              <button
                key="confirm"
                onClick={() => onStatusChange(order.id, 'confirmed')}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {language === 'ru' ? 'Подтвердить' : 'Tassykla'}
              </button>
            ),
            <button
              key="cancel"
              onClick={() => onStatusChange(order.id, 'cancelled')}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              {language === 'ru' ? 'Отменить заказ' : 'Sargydy ýatyrmak'}
            </button>
          ]}
        </div>
      </div>
    </div>
  </div>
);

export default OrderModal;
