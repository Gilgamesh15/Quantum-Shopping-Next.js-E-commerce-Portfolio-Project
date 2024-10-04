import { create } from "zustand";
import { CartItem } from "../types";



interface CartState {
  cartItems: CartItem[];
  setCartItems: (cartItems: (<CartItem>)[]) => void;
  incrementCartItemQuantity: (cartItemId: string) => void;
  decrementCartItemQuantity: (cartItemId: string) => void;
  setItemVariant: (cartItemId: string, attrId: string, optId: string) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems:[],
  setCartItems:()=>()
}));
