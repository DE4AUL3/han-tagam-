import { redirect } from 'next/navigation';

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  
  // Перенаправляем на страницу меню
  redirect(`/menu`);
}