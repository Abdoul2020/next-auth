"use client";
import { useDispatch, useSelector } from "react-redux";
import { addItem, decrementQty, updateQty, setCart } from "@/store";
import type { RootState } from "@/store";
import { useEffect } from "react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  image?: string;
};

export default function ProductsList({ products }: { products: Product[] }) {
  const cart = useSelector((s: RootState) => s.cart);
  const dispatch = useDispatch();

  // Initialize cart from localStorage and set up BroadcastChannel
  useEffect(() => {
    try {
      const raw = localStorage.getItem("microcart");
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch(setCart(parsed));
      }
    } catch (e) {
      // ignore parse errors
    }

    const bc = new BroadcastChannel("microcart");
    bc.onmessage = (ev) => {
      if (ev.data?.type === "cart-updated" && Array.isArray(ev.data.cart)) {
        localStorage.setItem("microcart", JSON.stringify(ev.data.cart));
        dispatch(setCart(ev.data.cart));
      }
    };

    return () => bc.close();
  }, [dispatch]);

  // Helper to sync cart data
  const syncCart = (nextCart: any[]) => {
    try {
      localStorage.setItem("microcart", JSON.stringify(nextCart));
    } catch {}
    const bc = new BroadcastChannel("microcart");
    bc.postMessage({ type: "cart-updated", cart: nextCart });
    bc.close();
  };

  const getQty = (id: number) => cart.find((i) => i.id === id)?.qty ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <article key={p.id} className="bg-white shadow rounded p-4">
          <Link href={`/en/products/${p.id}`} className="block">
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="h-48 w-full object-contain mb-4 hover:opacity-90 transition-opacity"
              />
            )}
            <h3 className="text-lg font-medium hover:text-blue-600 transition-colors">{p.title}</h3>
            <p className="mt-2 font-semibold">${p.price}</p>
          </Link>

          <div className="mt-4 flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => {
                dispatch(decrementQty(p.id));
                const next = cart.map((c) => 
                  c.id === p.id && c.qty > 1 
                    ? { ...c, qty: c.qty - 1 } 
                    : c.id === p.id 
                    ? null 
                    : c
                ).filter(Boolean);
                syncCart(next);
              }}
            >
              -
            </button>
            <input
              type="number"
              min={0}
              className="w-16 border rounded px-2 py-1 text-center"
              value={getQty(p.id)}
              onChange={(e) => {
                const qty = Math.max(0, Number(e.target.value));
                dispatch(updateQty({ id: p.id, qty }));
                const next = cart.map((c) => 
                  c.id === p.id ? { ...c, qty } : c
                );
                syncCart(next);
              }}
            />
            <button
              className="px-3 py-1 border rounded"
              onClick={() => {
                dispatch(addItem({ id: p.id, title: p.title, price: p.price }));
                const existing = cart.find((c) => c.id === p.id);
                const next = existing 
                  ? cart.map((c) => c.id === p.id ? { ...c, qty: c.qty + 1 } : c)
                  : [...cart, { id: p.id, title: p.title, price: p.price, qty: 1 }];
                syncCart(next);
              }}
            >
              +
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}


