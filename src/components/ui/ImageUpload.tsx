'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { imageService, ImageUploadResult } from '@/lib/imageServiceDb';
import SmartImage from './SmartImage';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  className?: string;
  placeholder?: string;
}

export default function ImageUpload({ 
  currentImage, 
  onImageChange, 
  className = "",
  placeholder = "Добавить изображение"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Получаем URL для предварительного просмотра
  const getDisplayUrl = useCallback(() => {
    if (previewUrl) return previewUrl;
    if (currentImage) return currentImage.startsWith("http") ? currentImage : `/images/${currentImage}`;
    return null;
  }, [currentImage, previewUrl]);

  // Обработка выбора файла
  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    // Создаем временный URL для предварительного просмотра
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);

    try {
      const result: ImageUploadResult = await imageService.uploadImage(file);
      
      if (result.success && result.url) {
        onImageChange(result.url);
        setPreviewUrl(null);
        URL.revokeObjectURL(tempUrl);
      } else {
        setUploadError(result.error || 'Ошибка загрузки изображения');
        setPreviewUrl(null);
        URL.revokeObjectURL(tempUrl);
      }
    } catch (error) {
      setUploadError('Произошла ошибка при загрузке');
      setPreviewUrl(null);
      URL.revokeObjectURL(tempUrl);
    } finally {
      setIsUploading(false);
    }
  };

  // Обработка изменения input файла
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Обработка drag & drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      setUploadError('Пожалуйста, выберите файл изображения');
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  // Удаление изображения
  const handleRemoveImage = async () => {
    if (currentImage && currentImage.startsWith('/')) {
      try {
        const id = currentImage.split('/').pop()?.split('.')[0];
        if (id) {
          // При необходимости можно вызвать API для удаления файла с сервера
          // await fetch(`/api/images?id=${id}`, { method: 'DELETE' });
        }
      } catch (error) {
        console.error('Ошибка при удалении изображения:', error);
      }
    }
    onImageChange(null);
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Клик по области загрузки
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const displayUrl = getDisplayUrl();

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        {displayUrl ? (
          // Показываем загруженное изображение
          <div className="relative group">
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
              <SmartImage
                src={displayUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay с кнопками при наведении */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                <button
                  onClick={handleUploadClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                  title="Заменить изображение"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  title="Удалить изображение"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Индикатор загрузки */}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-sm">Загрузка...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Показываем область загрузки
          <div
            onClick={handleUploadClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
              ${isUploading ? 'pointer-events-none' : ''}
            `}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="text-sm">Загрузка изображения...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8" />
                  <div className="text-center">
                    <p className="text-sm font-medium">{placeholder}</p>
                    <p className="text-xs mt-1">
                      Перетащите изображение сюда или нажмите для выбора
                    </p>
                    <p className="text-xs mt-1 text-gray-400">
                      JPG, PNG, WEBP до 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Скрытый input для выбора файлов */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Сообщения об ошибках */}
      {uploadError && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Успешная загрузка */}
      {currentImage && !isUploading && !uploadError && (
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Изображение успешно загружено</span>
        </div>
      )}

      {/* Информация о поддерживаемых форматах */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>• Поддерживаемые форматы: JPG, PNG, WEBP</p>
        <p>• Максимальный размер: 5MB</p>
        <p>• Рекомендуемое разрешение: 800×600px</p>
      </div>
    </div>
  );
}