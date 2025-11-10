'use client';

import { useEffect, useReducer, useMemo } from 'react';
import OrderCard from '../OrderCard';
import OrderModal from '../OrderModal';
import { Search } from 'lucide-react';
import { TrendingUp, History, BarChart } from 'lucide-react';
// Кнопка вкладки с иконкой и стилями
interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105
        ${active
          ? 'bg-white text-blue-700 border-b-4 border-blue-500 shadow-md'
          : 'bg-white text-gray-800 hover:bg-gray-50 border-b-4 border-transparent shadow-md'}
      `}
      onClick={onClick}
    >
      <span className={active ? 'text-blue-500' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
import toast from 'react-hot-toast';
import { useLanguage } from '@/hooks/useLanguage';
import type { Order } from '@/types/common';

// ─────────────────────────────────────────────
// 🔹 Хук аналитики заказов
function useOrdersAnalytics(orders: Order[]) {
  return useMemo(() => {
    if (!orders.length) return { total: 0, count: 0, avg: 0, byStatus: {} };
    const total = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const count = orders.length;
    const avg = total / count;
    const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    return { total, count, avg, byStatus };
  }, [orders]);
}

// ─────────────────────────────────────────────
// 🔹 Типы и константы
interface OrdersModuleProps {
  className?: string;
  setOrdersCount?: (count: number) => void;
}

type Tab = 'active' | 'history' | 'analytics';
type SortBy = 'newest' | 'oldest' | 'amount';
type StatusFilter = string;

interface State {
  orders: Order[];
  loading: boolean;
  activeTab: Tab;
  searchQuery: string;
  statusFilter: StatusFilter;
  sortBy: SortBy;
  selectedOrder: Order | null;
  isDetailModalOpen: boolean;
}

type Action =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: Tab }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: StatusFilter }
  | { type: 'SET_SORT_BY'; payload: SortBy }
  | { type: 'SET_SELECTED_ORDER'; payload: Order | null }
  | { type: 'TOGGLE_DETAIL_MODAL'; payload: boolean };

const initialState: State = {
  orders: [],
  loading: false,
  activeTab: 'active',
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'newest',
  selectedOrder: null,
  isDetailModalOpen: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_SELECTED_ORDER':
      return { ...state, selectedOrder: action.payload };
    case 'TOGGLE_DETAIL_MODAL':
      return { ...state, isDetailModalOpen: action.payload };
    default:
      return state;
  }
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

// ─────────────────────────────────────────────
// 🔹 Основной компонент
export default function OrdersModule({
  className = '',
  setOrdersCount,
}: OrdersModuleProps) {
  const { currentLanguage: language } = useLanguage();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchOrders = async (signal?: AbortSignal) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetch('/api/orders', { signal });
      if (!res.ok) throw new Error('Ошибка загрузки заказов');
      const orders = await res.json();
      dispatch({ type: 'SET_ORDERS', payload: orders });
      // Считаем только активные заказы
      const activeCount = orders.filter((o: any) => ['new', 'pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)).length;
      console.log('orders:', orders);
      console.log('activeCount:', activeCount);
      setOrdersCount?.(activeCount);
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        toast.error(language === 'ru' ? 'Ошибка загрузки заказов' : 'Ýükleme ýalňyşlygy');
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal);
    // Автообновление каждые 10 секунд
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [language]);

  const analytics = useOrdersAnalytics(state.orders);

  const filteredOrders = useMemo(() => {
    return [...state.orders]
      .filter(o => {
        if (state.activeTab === 'active')
          return ['new', 'pending', 'preparing', 'ready', 'delivering'].includes(o.status);
        if (state.activeTab === 'history')
          return ['confirmed', 'cancelled'].includes(o.status);
        return true;
      })
      .filter(o => state.statusFilter === 'all' || o.status === state.statusFilter)
      .filter(o => {
        if (!state.searchQuery) return true;
        const q = state.searchQuery.toLowerCase();
        return (
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (state.sortBy === 'amount') return b.totalAmount - a.totalAmount;
        const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return state.sortBy === 'newest' ? -diff : diff;
      });
  }, [state]);

  const getStatusText = (status: string) => statusLabels[status]?.[language] || status;
  const formatCurrency = (amount: number) => `${amount.toFixed(2)} TMT`;

  const updateOrderStatus = async (orderId: string, status: string) => {
    dispatch({
      type: 'SET_ORDERS',
      payload: state.orders.map(o => (o.id === orderId ? { ...o, status: status as Order['status'] } : o)),
    });
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Ошибка обновления статуса');
  toast.success(language === 'ru' ? 'Статус обновлен' : 'Täzelendi');
  // Сразу обновляем список заказов и счетчик
  fetchOrders();
    } catch {
      toast.error(language === 'ru' ? 'Не удалось обновить' : 'Täzelenmedi');
      fetchOrders();
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'active', label: language === 'ru' ? 'Активные' : 'Aktiw', icon: <TrendingUp size={20} /> },
    { key: 'history', label: language === 'ru' ? 'История' : 'Taryh', icon: <History size={20} /> },
    { key: 'analytics', label: language === 'ru' ? 'Аналитика' : 'Analitika', icon: <BarChart size={20} /> },
  ];

  return (
    <div className={`orders-module ${className}`}>
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {tabs.map(tab => (
          <TabButton
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
            active={state.activeTab === tab.key}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.key })}
          />
        ))}
      </div>

      {/* Filters / Analytics */}
      {state.activeTab === 'analytics' ? (
        <div className="mb-6 p-6 rounded-xl bg-white shadow flex flex-col gap-4 max-w-xl mx-auto border border-gray-200">
          <div className="text-lg font-semibold mb-2 text-gray-800">
            {language === 'ru' ? 'Аналитика заказов' : 'Sargyt analitikasy'}
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-gray-500 text-sm">{language === 'ru' ? 'Всего заказов' : 'Jemi sargytlar'}</div>
              <div className="font-bold text-xl">{analytics.count}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">{language === 'ru' ? 'Сумма заказов' : 'Sargytlaryň jemi'}</div>
              <div className="font-bold text-xl">{formatCurrency(analytics.total)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">{language === 'ru' ? 'Средний чек' : 'Orta çek'}</div>
              <div className="font-bold text-xl">{formatCurrency(analytics.avg)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск...' : 'Gözleg...'}
              value={state.searchQuery}
              onChange={e => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none bg-white text-gray-800"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <select
            value={state.statusFilter}
            onChange={e => dispatch({ type: 'SET_STATUS_FILTER', payload: e.target.value })}
            className="w-48 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-blue-500"
          >
            <option value="all">{language === 'ru' ? 'Все статусы' : 'Ähli ýagdaýlar'}</option>
            {Object.keys(statusLabels).map(value => (
              <option key={value} value={value}>{getStatusText(value)}</option>
            ))}
          </select>

          <select
            value={state.sortBy}
            onChange={e => dispatch({ type: 'SET_SORT_BY', payload: e.target.value as SortBy })}
            className="w-48 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-blue-500"
          >
            <option value="newest">{language === 'ru' ? 'Сначала новые' : 'Täzeler öň'}</option>
            <option value="oldest">{language === 'ru' ? 'Сначала старые' : 'Köneler öň'}</option>
            <option value="amount">{language === 'ru' ? 'По сумме' : 'Jemi boýunça'}</option>
          </select>
        </div>
      )}

      {/* Order list */}
      {state.loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center py-10 text-gray-600">
          {language === 'ru' ? 'Заказы не найдены' : 'Sargyt tapylmady'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => {
                dispatch({ type: 'SET_SELECTED_ORDER', payload: order });
                dispatch({ type: 'TOGGLE_DETAIL_MODAL', payload: true });
              }}
              onStatusChange={updateOrderStatus}
              activeTab={state.activeTab}
              loading={state.loading}
            />
          ))}
        </div>
      )}

      {state.selectedOrder && state.isDetailModalOpen && (
        <OrderModal
          order={state.selectedOrder}
          language={language}
          activeTab={state.activeTab}
          onClose={() => dispatch({ type: 'TOGGLE_DETAIL_MODAL', payload: false })}
          onStatusChange={updateOrderStatus}
        />
      )}
    </div>
  );
}
