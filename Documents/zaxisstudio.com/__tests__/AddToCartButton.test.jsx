import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

vi.mock('../lib/cart', () => ({
  addToCart: vi.fn()
}));

import AddToCartButton from '../components/AddToCartButton';
import { addToCart } from '../lib/cart';

describe('AddToCartButton', () => {
  const product = { id: 123, title: 'Test Product', price: 999 };

  it('renders with accessible label and default text', () => {
    const { container } = render(<AddToCartButton product={product} />);
    const btn = within(container).getByRole('button', { name: /add to cart/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('btn', 'add-to-cart');
    expect(btn).toHaveAttribute('aria-disabled', 'false');
  });

  it('calls addToCart and shows feedback state', () => {
    const { container } = render(<AddToCartButton product={product} />);
    const btn = within(container).getByRole('button', { name: /add to cart/i });
    fireEvent.click(btn);
    expect(addToCart).toHaveBeenCalledWith(product);
    // After click, label changes to Added!
    expect(within(container).getByRole('button', { name: /added to cart/i })).toBeInTheDocument();
    expect(within(container).getByText(/added!/i)).toBeInTheDocument();
    expect(within(container).getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
});
