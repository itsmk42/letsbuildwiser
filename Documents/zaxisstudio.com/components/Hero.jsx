import Image from 'next/image';

export default function Hero({ product }) {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-card" role="region" aria-label={`Featured: ${product?.title || 'Featured Product'}`}>
          {product ? (
            <>
              <div className="hero-media">
                {(() => {
                  const isStock = !product.image_url || /picsum\.photos/i.test(product.image_url);
                  const src = isStock ? '/placeholder.svg' : product.image_url;
                  const alt = isStock ? `Image Coming Soon — ${product.title}` : product.title;
                  return <Image src={src} alt={alt} width={820} height={540} />;
                })()}
              </div>
              <div className="hero-info">
                <h2 className="hero-title">{product.title}</h2>
                <p className="price">₹{product.price}</p>
                <div className="actions">
                  <a className="btn" href={`/product/${product.id}`} aria-label={`View ${product.title}`}>View</a>
                  <a className="btn buy-now" href={`/checkout?buy=${product.id}`} aria-label={`Buy ${product.title} now`}>Buy Now</a>
                </div>
              </div>
            </>
          ) : (
            <div className="hero-placeholder" />
          )}
        </div>
      </div>
    </section>
  );
}
