import { LocalizedLink } from "@/i18n/config";

type Props = {
  id: number;
  title: string;
  price: number;
  image?: string;
};

export default function ProductCard({ id, title, price, image }: Props) {
  const productUrl = `/products/${id}`;

  return (
    <article className="bg-white shadow rounded p-4">
      <LocalizedLink href={productUrl}>
        <img src={image} alt={title} className="h-48 w-full object-contain mb-4" />
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-2 font-semibold">${price}</p>
      </LocalizedLink>
    </article>
  );
}
