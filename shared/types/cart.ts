import { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string | null;
  sessionId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface AddToCartRequest {
  sessionId: string;
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
