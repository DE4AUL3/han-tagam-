const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export function getImageUrl(imagePath?: string | null): string {
  if (!imagePath) {
    return '/images/placeholder.svg';
  }

  // Если путь уже является полным URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Очищаем путь от лишних слэшей
  let cleanPath = imagePath.replace(/^\/+/, '').replace(/\/+/g, '/');

  // Убираем префикс 'images/' если он есть
  if (cleanPath.startsWith('images/')) {
    cleanPath = cleanPath.substring(7); // Убираем 'images/'
  }

  // Если путь начинается с 'static/', используем прямой доступ
  if (cleanPath.startsWith('static/')) {
    return `/${cleanPath}`;
  }

  // Используем API route для раздачи изображений (без timestamp для SSR совместимости)
  return `/api/static-images/${cleanPath}`;
}
