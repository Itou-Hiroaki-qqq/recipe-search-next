import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import LayoutClient from './layout.client';
import HomePageContent from './home-page-content';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <LayoutClient>
      <HomePageContent />
    </LayoutClient>
  );
}
