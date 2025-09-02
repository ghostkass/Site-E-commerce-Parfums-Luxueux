import { useState } from 'react';

export type Page = 'home' | 'shop' | 'product' | 'about' | 'blog' | 'contact' | 'cart' | 'checkout';

interface RouterProps {
  children: (currentPage: Page, setCurrentPage: (page: Page) => void) => React.ReactNode;
}

export function Router({ children }: RouterProps) {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return <>{children(currentPage, setCurrentPage)}</>;
}