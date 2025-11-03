'use client';

import { cacheInvalidation } from './cacheInvalidation';

export interface ImageUploadResponse {
  success: boolean;
  image?: {
    id: string;
    filename: string;
    url: string;
    size: number;
    category: string;
    alt: string;
    createdAt: Date;
  };
  error?: string;
}

export interface ImageData {
  id: string;
  filename: string;
  url: string;
  size: number;
  category: string;
  alt: string;
  createdAt: Date;
}

class ImageService {
  private baseURL = '/api/images';

  // Сжатие изображения перед загрузкой
  private async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Определяем размеры для сжатия
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Рисуем сжатое изображение
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Загрузка изображения на сервер
  async uploadImage(
    file: File,
    category: string = 'other',
    alt: string = ''
  ): Promise<ImageUploadResponse> {
    try {
      // Сжимаем изображение
      const compressedFile = await this.compressImage(file);
      
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('category', category);
      formData.append('alt', alt);

      const response = await fetch(this.baseURL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Сохраняем в localStorage как резервную копию
        this.saveToLocalStorage(result.image);
        
        // НЕ инвалидируем кэш здесь - это сделает Server-Sent Events
        console.log('✅ Изображение успешно загружено:', result.image.url);
        
        return result;
      } else {
        console.error('❌ Ошибка загрузки изображения:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке изображения:', error);
      return { 
        success: false, 
        error: 'Не удалось загрузить изображение' 
      };
    }
  }

  // Получение списка изображений
  async getImages(category?: string): Promise<ImageData[]> {
    try {
      const url = category 
        ? `${this.baseURL}?category=${encodeURIComponent(category)}`
        : this.baseURL;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.images) {
        // Сохраняем в localStorage
        result.images.forEach((img: ImageData) => {
          this.saveToLocalStorage(img);
        });
        
        return result.images;
      }

      return [];
    } catch (error) {
      console.error('❌ Ошибка при получении изображений:', error);
      
      // Возвращаем данные из localStorage в случае ошибки
      return this.getFromLocalStorage(category);
    }
  }

  // Получение конкретного изображения
  async getImage(id: string): Promise<ImageData | null> {
    try {
      const response = await fetch(`${this.baseURL}?id=${id}`);
      const result = await response.json();

      if (result.image) {
        this.saveToLocalStorage(result.image);
        return result.image;
      }

      return null;
    } catch (error) {
      console.error('❌ Ошибка при получении изображения:', error);
      return null;
    }
  }

  // Удаление изображения
  async deleteImage(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Удаляем из localStorage
        this.removeFromLocalStorage(id);
        
        // НЕ инвалидируем кэш здесь - это сделает Server-Sent Events
        console.log('✅ Изображение успешно удалено');
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Ошибка при удалении изображения:', error);
      return false;
    }
  }

  // Сохранение в localStorage
  private saveToLocalStorage(image: ImageData): void {
    try {
      const key = `image_${image.id}`;
      localStorage.setItem(key, JSON.stringify(image));
    } catch (error) {
      console.error('❌ Ошибка сохранения в localStorage:', error);
    }
  }

  // Получение из localStorage
  private getFromLocalStorage(category?: string): ImageData[] {
    try {
      const images: ImageData[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('image_')) {
          const imageData = localStorage.getItem(key);
          if (imageData) {
            const image = JSON.parse(imageData);
            if (!category || image.category === category) {
              images.push(image);
            }
          }
        }
      }
      
      return images.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('❌ Ошибка получения из localStorage:', error);
      return [];
    }
  }

  // Удаление из localStorage
  private removeFromLocalStorage(id: string): void {
    try {
      localStorage.removeItem(`image_${id}`);
    } catch (error) {
      console.error('❌ Ошибка удаления из localStorage:', error);
    }
  }

  // Очистка всех изображений из localStorage
  clearLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('image_')
      );
      
      keys.forEach(key => localStorage.removeItem(key));
      
      console.log('🧹 localStorage очищен от изображений');
    } catch (error) {
      console.error('❌ Ошибка очистки localStorage:', error);
    }
  }

  // Принудительное обновление изображений
  forceRefresh(): void {
    cacheInvalidation.forceRefresh();
  }
}

// Экспортируем глобальный экземпляр
export const imageService = new ImageService();
