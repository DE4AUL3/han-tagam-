'use client';


import React, { useState, useEffect } from 'react';
import { Upload, ImageIcon, Tag, Filter, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { imageService } from '@/lib/imageServiceDb';
import type { ImageInfo } from '@/lib/imageServiceDb';
import { getAppThemeClasses } from '@/styles/appTheme';

type ImageCategory = 'all' | 'logos' | 'categories' | 'products' | 'other';

export default function ImageManager() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [activeCategory, setActiveCategory] = useState<ImageCategory>('all');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const allImages = await imageService.getAllImages();
      setImages(allImages);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      toast.error('Не удалось загрузить изображения');
    }
  };

  const handleFileUpload = async (files: FileList, category: 'logos' | 'categories' | 'products' | 'other' = 'other') => {
    setIsUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await imageService.uploadImage(file, category);
        if (result.success) {
          console.log('✅ Изображение загружено:', file.name);
        } else {
          toast.error(`Ошибка загрузки ${file.name}: ${result.error}`, {
            duration: 4000,
            position: 'top-right',
          });
        }
      } catch {
        toast.error(`Ошибка загрузки ${file.name}`, {
          duration: 4000,
          position: 'top-right',
        });
      }
    }

    setIsUploading(false);
    loadImages();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const category = activeCategory === 'all' ? 'other' : activeCategory as any;
      handleFileUpload(files, category);
    }
  };

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const theme = getAppThemeClasses('gold-elegance');

  // Функция для получения класса бейджа по категории
  function getCategoryBadgeClass(category: string) {
    switch (category) {
      case 'logos':
        return 'bg-[#ede7f6] text-[#6d28d9]'; // фиолетовый
      case 'categories':
        return 'bg-[#e3f2fd] text-[#1565c0]'; // синий
      case 'products':
        return 'bg-[#e8f5e9] text-[#2e7d32]'; // зелёный
      default:
        return 'bg-[#f5f5f5] text-[#616161]'; // серый
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>
          Управление изображениями
        </h2>
        <p className={`${theme.textSecondary}`}>
          Всего изображений: {images.length}
        </p>
      </div>

      {/* Зона загрузки */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${theme.border} ${theme.bgSecondary} ${isDragOver ? theme.hover : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
        onDrop={handleDrop}
      >
        <Upload className={`mx-auto w-12 h-12 ${theme.textMuted} mb-4`} />
        <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
          Загрузить изображения
        </h3>
        <p className={`${theme.textSecondary} mb-4`}>
          Перетащите файлы сюда или выберите
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files, activeCategory === 'all' ? 'other' : activeCategory as any)}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center gap-2 px-4 py-2 ${theme.accent} text-white rounded-lg transition-colors cursor-pointer`}
        >
          <Upload className="w-4 h-4" />
          Выбрать файлы
        </label>

        {isUploading && (
          <div className="mt-4">
            <p className={`text-sm ${theme.textSecondary}`}>Загрузка...</p>
          </div>
        )}
      </div>

      {/* Фильтры по категориям */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Все', icon: ImageIcon },
          { key: 'logos', label: 'Логотипы', icon: Tag },
          { key: 'categories', label: 'Категории', icon: Filter },
          { key: 'products', label: 'Товары', icon: ImageIcon },
          { key: 'other', label: 'Прочее', icon: Settings }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as ImageCategory)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeCategory === key
                ? `${theme.accent} text-white` 
                : `${theme.bgSecondary} ${theme.textSecondary} ${theme.hover}`
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded ${key !== 'all' ? getCategoryBadgeClass(key) : ''}`}>
              {key === 'all' ? images.length : images.filter(img => img.category === key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Список изображений */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className={`mx-auto w-16 h-16 ${theme.textMuted} mb-4`} />
          <h3 className={`text-lg font-semibold ${theme.textSecondary} mb-2`}>
            Нет изображений
          </h3>
          <p className={`${theme.textMuted}`}>
            Загрузите изображения через форму выше
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className={`${theme.cardBg} rounded-lg overflow-hidden shadow-md`}>
              <div className={`aspect-square ${theme.bgSecondary}`}>
                <img
                  src={image.url.startsWith("http") ? image.url : `/images/${image.url}`}
                  alt={image.alt || image.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.svg';
                  }}
                />
              </div>
              <div className="p-3">
                <h3 className={`text-sm font-medium ${theme.text} truncate mb-1`}>
                  {image.filename}
                </h3>
                <div className={`flex items-center justify-between text-xs ${theme.textSecondary}`}>
                  <span>{imageService.formatFileSize(image.size)}</span>
                  <span className={`px-1.5 py-0.5 rounded ${getCategoryBadgeClass(image.category)}`}>
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}