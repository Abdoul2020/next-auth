// cart/src/components/Cart.client.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import type { JSX } from "react";

type Item = {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  qty: number;
};

export default function CartClient(): JSX.Element {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  // Utility: read cart from localStorage in a safe way
  const readCartFromLocalStorage = (): Item[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("microcart");
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Item[];
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.error("Failed to parse microcart from localStorage:", err);
      return [];
    }
  };

  // Save to localStorage + broadcast safely
  const saveCart = (next: Item[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("microcart", JSON.stringify(next));
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("microcart");
        bc.postMessage({ type: "cart-updated", cart: next });
        bc.close();
      } else {
        // fallback: trigger storage event by setting same key (works across tabs)
        // (note: storage events are not fired in same tab)
        localStorage.setItem("microcart-sync", Date.now().toString());
      }
    } catch (err) {
      console.error("Failed to save microcart:", err);
    }
  };

  // Load initially and subscribe to updates
  useEffect(() => {
    mountedRef.current = true;

    // initial load (browser-only)
    if (typeof window !== "undefined") {
      const initial = readCartFromLocalStorage();
      if (mountedRef.current) {
        setCartItems(initial);
        setIsLoading(false);
      }
    }

    // BroadcastChannel listener (if available)
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel("microcart");
      bc.onmessage = (ev) => {
        try {
          if (ev.data?.type === "cart-updated" && Array.isArray(ev.data.cart)) {
            setCartItems(ev.data.cart);
          }
        } catch (err) {
          console.error("BroadcastChannel message error:", err);
        }
      };
    }

    // storage event (cross-tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "microcart") {
        const next = readCartFromLocalStorage();
        setCartItems(next);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mountedRef.current = false;
      if (bc) bc.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Remove item
  const onRemove = (id: string | number) => {
    const next = cartItems.filter((c) => String(c.id) !== String(id));
    setCartItems(next);
    saveCart(next);
  };

  // Change qty
  const onQtyChange = (id: string | number, qty: number) => {
    const safeQty = Math.max(1, Math.floor(qty) || 1);
    const next = cartItems.map((c) =>
      String(c.id) === String(id) ? { ...c, qty: safeQty } : c
    );
    setCartItems(next);
    saveCart(next);
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Add some items from the products page to see them here.
          </p>
          <a
            href="/en/products"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg transition-colors duration-200 font-medium text-lg shadow-md hover:shadow-lg"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  // Main render
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
                <p className="text-blue-100 mt-2">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                  in your cart
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${totalPrice.toFixed(2)}
                </div>
                <div className="text-blue-100">Total</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={String(item.id)}
                  className="flex items-center justify-between bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-blue-600 font-bold text-xl">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-xl mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-lg">
                        ${item.price.toFixed(2)} each
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        Item total: ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onQtyChange(item.id, item.qty - 1)}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg transition-colors duration-200 shadow-sm"
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) =>
                          onQtyChange(item.id, Number(e.target.value))
                        }
                        className="w-20 text-center border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                      />
                      <button
                        onClick={() => onQtyChange(item.id, item.qty + 1)}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg transition-colors duration-200 shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-800">
                    Total Items:
                  </span>
                  <span className="text-xl font-bold text-gray-800">
                    {totalQty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    Total Price:
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Proceed to Checkout
                </button>
                <a
                  href="/en/products"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-lg font-bold text-lg text-center transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
