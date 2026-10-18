"use client";

import { useState } from "react";
import { demoMenu, formatPrice, type MenuItem } from "@/lib/menu";
import { getSupabaseClient } from "@/lib/supabase";

export function Menu() {
  const [items, setItems] = useState<MenuItem[]>(demoMenu);
  const [status, setStatus] = useState("Demo menu · prices in USD");
  const [loading, setLoading] = useState(false);

  async function loadMenu() {
    setLoading(true);
    try {
      const { data, error } = await getSupabaseClient().from("menu_items")
        .select("id,name,description,price_cents").eq("available", true).order("name");
      if (error) throw error;
      setItems(data ?? []);
      setStatus(data?.length ? "Live menu · prices in USD" : "No drinks available right now.");
    } catch {
      setStatus("Live menu unavailable. Showing the demo menu.");
      setItems(demoMenu);
    } finally { setLoading(false); }
  }

  return <section aria-labelledby="menu-title" className="mt-16">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 id="menu-title" className="text-3xl font-bold">The coffee menu</h2>
      <button onClick={loadMenu} disabled={loading} className="rounded-full border border-stone-400 px-5 py-3 text-sm font-semibold disabled:opacity-50">
        {loading ? "Loading…" : "Load live menu"}
      </button>
    </div>
    <p role="status" className="mt-3 text-sm text-stone-600">{status}</p>
    <ul className="mt-6 grid gap-5 sm:grid-cols-3">
      {items.map(item => <li key={item.id} className="rounded-2xl border border-stone-200 bg-white p-7">
        <h3 className="text-xl font-bold">{item.name}</h3>
        <p className="mt-3 text-sm leading-6 text-stone-600">{item.description}</p>
        <p className="mt-6 font-semibold">{formatPrice(item.price_cents)}</p>
      </li>)}
    </ul>
  </section>;
}
