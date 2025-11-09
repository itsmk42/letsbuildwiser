import Image from 'next/image';
import { getProductById } from '../../../lib/products';
import AddToCartButton from '../../../components/AddToCartButton';

export const revalidate = 60;

export default async function ProductDetail({ params }) {
  const product = await getProductById(params.id);
  if (!product) {
    return <div>Product not found.</div>;
  }
  const isStock = !product.image_url || /picsum\.photos/i.test(product.image_url);
  const src = isStock ? '/placeholder.svg' : product.image_url;
  const alt = isStock ? `Image Coming Soon — ${product.title}` : product.title;
  return (
    <section className="product-detail">
      <div className="product-media">
        <Image src={src} alt={alt} width={640} height={480} className="product-image" />
      </div>
      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="price">₹{product.price}</p>
        <div className="actions">
          <AddToCartButton product={product} />
          <a className="btn buy-now" href={`/checkout?buy=${product.id}`} aria-label={`Buy ${product.title} now`}>Buy Now</a>
        </div>
      </div>
    </section>
  );
}
