'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ClearOrdersButtonProps {
  onClear?: () => void;
}

export default function ClearOrdersButton({ onClear }: ClearOrdersButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 5000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/orders/clear?status=completed', {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Удалено ${data.deleted} завершённых заказов`);
        if (onClear) onClear();
        setShowConfirm(false);
      } else {
        alert('❌ Ошибка при удалении');
      }
    } catch (error) {
      alert('❌ Ошибка подключения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleClear}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          showConfirm
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Trash2 className="w-4 h-4" />
        {loading ? 'Удаление...' : showConfirm ? 'Подтвердить очистку' : 'Очистить историю'}
      </button>
      {showConfirm && (
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Отмена
        </button>
      )}
    </div>
  );
}
