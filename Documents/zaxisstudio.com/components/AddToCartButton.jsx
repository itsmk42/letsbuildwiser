"use client";
import React, { useState } from 'react';
import { addToCart } from '../lib/cart';

export default function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);
  function onClick() {
    addToCart(product);
    setAdded(true);
    const t = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(t);
  }
  return (
    <button
      className="btn add-to-cart"
      onClick={onClick}
      aria-label={added ? 'Added to cart' : 'Add to cart'}
      aria-disabled={added ? 'true' : 'false'}
    >
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
