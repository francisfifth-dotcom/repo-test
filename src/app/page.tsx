import { Menu } from "@/components/menu";

export default function Home() {
  return <main className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
    <header className="border-b border-stone-300 pb-6 text-sm font-bold uppercase tracking-widest">Daily Grind / Coffee & Company</header>
    <div className="pt-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-800">Your daily pause</p>
      <h1 className="mt-5 max-w-2xl text-5xl font-bold leading-tight sm:text-7xl">Good days start with good coffee.</h1>
      <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">A simple beginning for your neighborhood coffee shop. Explore the menu, one cup at a time.</p>
    </div>
    <Menu />
    <footer className="mt-16 border-t border-stone-300 pt-6 text-sm text-stone-600">Coffee shop starter · Ordering and payments are not enabled.</footer>
  </main>;
}
