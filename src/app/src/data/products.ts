export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

// Keep checkout disabled until the catalogue has authoritative product prices.
export const productsData: Product[] = [];
