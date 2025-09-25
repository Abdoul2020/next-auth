import { Metadata } from "next";

type Params = { params: Promise<{ id: string }> };

async function getProduct(id: string) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Product fetch failed");
  return res.json();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const { id } = await params;
    const p = await getProduct(id);
    return {
      title: p.title,
      description: p.description?.slice(0, 160) ?? `Buy ${p.title} for $${p.price}`,
      openGraph: {
        title: p.title,
        description: p.description?.slice(0,160),
        images: [{ url: p.image }],
      },
    };
  } catch(e) {
    console.log("error", e);
    return { title: "Product not found" };
  }
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const p = await getProduct(id);
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex gap-6">
        <img src={p.image} alt={p.title} className="w-80 h-80 object-contain" />
        <div>
          <h1 className="text-2xl font-bold">{p.title}</h1>
          <p className="mt-4 text-xl font-semibold">${p.price}</p>
          <p className="mt-4">{p.description}</p>
        </div>
      </div>
    </main>
  );
}
