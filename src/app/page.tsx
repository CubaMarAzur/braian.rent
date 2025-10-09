import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getPropertiesByOwner } from '@/lib/data/properties';
import DashboardClient from '@/components/views/DashboardClient';

/**
 * Dashboard Page - Server Component
 *
 * Fetches data on the server and passes it to client components.
 * This improves performance (faster LCP) and SEO.
 */
export default async function DashboardPage() {
  // Server-side authentication check
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  // Fetch properties on the server (RSC)
  const properties = await getPropertiesByOwner(session.user.id);

  // Pass data as props to client component
  return (
    <DashboardClient
      properties={properties}
      user={{
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
      }}
    />
  );
}
