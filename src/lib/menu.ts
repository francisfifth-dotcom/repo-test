export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
};

// Demo menu only. Production menu data belongs in Supabase.
export const demoMenu: MenuItem[] = [
  { id: "espresso", name: "Espresso", description: "Rich, bold, and freshly pulled.", price_cents: 300 },
  { id: "latte", name: "Latte", description: "Espresso with silky steamed milk.", price_cents: 450 },
  { id: "cold-brew", name: "Cold Brew", description: "Slow steeped for a smooth finish.", price_cents: 500 },
];

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
