
'use client';
import { useLanguage } from '@/hooks/useLanguage';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ui/ImageUpload';
import SmartImage from '@/components/ui/SmartImage';
import { motion } from 'framer-motion';
import CategoryFormModal from './CategoryFormModal';
import type { Category } from '@/types/common';

interface CategoryFormData {
  name: string;
  nameTk: string;
  image: string;
  dishPageImage: string;
  gradient: string;
  description: string;
  descriptionTk: string;
  sortOrder: number;
  isActive: boolean;
}

export default function CategoryManager() {
  const { currentLanguage } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    nameTk: '',
    image: '',
    dishPageImage: '',
    gradient: 'from-blue-600 to-purple-600',
    description: '',
    descriptionTk: '',
    sortOrder: 1,
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Focus trap + Esc handling when modal is open
  useEffect(() => {
    if (!isFormOpen) return;

    const node = modalRef.current;
    const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = node ? Array.from(node.querySelectorAll<HTMLElement>(focusableSelector)) : [];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resetForm();
        return;
      }
      if (e.key === 'Tab') {
        if (!first || !last) return;
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    // focus first input
    setTimeout(() => first?.focus(), 0);
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/category');
      if (response.ok) {
        const data = await response.json();
        // Преобразуем данные из формата БД в формат, используемый компонентом
        const mappedCategories: Category[] = data.map((item: any) => ({
          id: item.id,
          name: item.nameRu,
          nameTk: item.nameTk,
          image: item.imageCard,
          dishPageImage: item.imageBackground,
          gradient: 'from-blue-600 to-purple-600', // Дефолтный градиент
          description: item.descriptionRu,
          descriptionTk: item.descriptionTk,
          sortOrder: item.order,
          isActive: item.status
        }));
        setCategories(mappedCategories);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка загрузки категорий');
      }
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      toast.error('Ошибка загрузки категорий!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const categoryData = {
        nameRu: formData.name,
        nameTk: formData.nameTk,
        descriptionRu: formData.description,
        descriptionTk: formData.descriptionTk,
        imageCard: formData.image,
        imageBackground: formData.dishPageImage,
        order: formData.sortOrder,
        status: formData.isActive,
        restaurantId: 1,
      };

      console.log('Submitting category data:', categoryData); // Log the category data being submitted

      let response;
      if (editingId) {
        // Редактирование существующей категории
        response = await fetch(`/api/category/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      } else {
        // Создание новой категории
        response = await fetch('/api/category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      }

      console.log('Server response:', response);
      if (!response.ok) {
        let errorMessage = 'Произошла ошибка при сохранении';
        try {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            console.error('Error details (json):', errorJson);
            errorMessage = errorJson.error || errorMessage;
          } catch {
            console.error('Error details (text):', errorText);
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          console.error('Не удалось прочитать тело ответа об ошибке', e);
        }
        throw new Error(errorMessage);
      }

      await loadCategories();
      resetForm();
      toast.success(
        editingId ? 'Категория успешно обновлена!' : 'Категория успешно создана!', 
        { icon: '✅', duration: 3000 }
      );
    } catch (error) {
      console.error('Ошибка при сохранении категории:', error);
      toast.error(
        error instanceof Error ? error.message : 'Ошибка сохранения категории!', 
        { duration: 4000 }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      nameTk: category.nameTk,
      image: category.image,
      dishPageImage: category.dishPageImage || '',
      gradient: category.gradient,
      description: category.description || '',
      descriptionTk: category.descriptionTk || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        const response = await fetch(`/api/category/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка удаления категории');
        }
        
        await loadCategories();
        toast.success('Категория успешно удалена!', { 
          duration: 3000, 
          position: 'top-right',
          icon: '🗑️' 
        });
      } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        toast.error(
          error instanceof Error ? error.message : 'Ошибка удаления категории!', 
          { duration: 4000, position: 'top-right' }
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameTk: '',
      image: '',
      dishPageImage: '',
      gradient: 'from-blue-600 to-purple-600',
      description: '',
      descriptionTk: '',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управление категориями
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Добавляйте, редактируйте и удаляйте категории меню
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          {currentLanguage === 'tk' ? 'Kategoriýa goşmak' : 'Добавить категорию'}
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`relative bg-white rounded-xl shadow-lg overflow-hidden border transition-all duration-200 ${
              category.isActive ? 'border-gray-200' : 'border-red-300'
            } hover:shadow-xl hover:-translate-y-1`}
          >
            {/* Category Image */}
            <div className="h-32 bg-gray-100 relative">
              {category.image ? (
                <SmartImage
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-2xl font-bold">
                  {category.name.charAt(0)}
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full font-semibold shadow ${
                  category.isActive 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {currentLanguage === 'tk'
                    ? (category.isActive ? 'Işjeň' : 'Işjeň däl')
                    : (category.isActive ? 'Активна' : 'Неактивна')}
                </span>
              </div>
            </div>

            {/* Category Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {currentLanguage === 'tk' ? category.nameTk : category.name}
                </h3>
                <span className="text-sm text-gray-400">
                  #{category.sortOrder}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {currentLanguage === 'tk' ? category.descriptionTk : category.description}
              </p>
              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  {currentLanguage === 'tk' ? 'Üýtget' : 'Изменить'}
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-colors gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  {currentLanguage === 'tk' ? 'Poz' : 'Удалить'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isSaving={isSaving}
        editingId={editingId}
      />
    </div>
  );
}