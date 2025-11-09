"use client";
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product }) {
  const isStock = !product.image_url || /picsum\.photos/i.test(product.image_url);
  const src = isStock ? '/placeholder.svg' : product.image_url;
  const alt = isStock ? `Image Coming Soon — ${product.title}` : product.title;
  return (
    <div className="card">
      <a href={`/product/${product.id}`} className="card-media">
        <Image src={src} alt={alt} width={400} height={300} />
      </a>
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="price">₹{product.price}</p>
        <div className="card-actions">
          <AddToCartButton product={product} />
          <a
            className="btn buy-now"
            href={`/checkout?buy=${product.id}`}
            aria-label={`Buy ${product.title} now`}
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}
