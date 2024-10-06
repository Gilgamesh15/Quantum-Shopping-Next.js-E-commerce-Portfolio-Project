import { create } from "zustand";
import { CartItem, Properties } from "../types";
import { findVariant } from "../utils";

interface CartState {
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
  incrementItemQuantity: (cartItemId: string) => void;
  decrementItemQuantity: (cartItemId: string) => void;
  getTotalInCents: () => number;
  setItemVariant: (
    cartItemId: string,
    newVaId: string,
    newVoId: string
  ) => void;
  syncCart: () => Promise<void>;
  startPeriodicSync: () => void;
  stopPeriodicSync: () => void;
}

const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  setCartItems: (cartItems) => {
    set((state) => ({ ...state, cartItems }));
  },
  incrementItemQuantity: (cartItemId) => {
    set((state) => {
      const cartItem = state.cartItems.find(({ id }) => cartItemId === id);
      if (!cartItem) {
        throw new Error("Cart item not found");
      }
      cartItem.quantity += 1;
      return { ...state };
    });
  },
  decrementItemQuantity: (cartItemId) => {
    set((state) => {
      const cartItem = state.cartItems.find(({ id }) => cartItemId === id);
      if (!cartItem) {
        throw new Error("Cart item not found");
      }
      cartItem.quantity -= 1;
      return { ...state };
    });
  },
  getTotalInCents: () => {
    return get().cartItems.reduce(
      (acc, { quantity, selectedVariant }) =>
        (acc += selectedVariant ? selectedVariant.priceInCents * quantity : 0),
      0
    );
  },
  setItemVariant: (cartItemId, newVaId, newVoId) => {
    set((state) => {
      //find the cartItem
      const cartItem = state.cartItems.find(({ id }) => cartItemId === id);
      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      const selectedProperties: Properties[] = [
        { attrId: newVaId, optId: newVoId },
      ];
      cartItem.product.attributes.forEach((va) => {
        //find the selected option
        const selOpt = va.options.find(({ isSelected }) => isSelected);
        if (!selOpt) {
          throw new Error("Selected option not found");
        }

        if (va.id === newVaId) {
          //change it if it's corresponding to newVaId
          selOpt.isSelected = false;

          //find the new option
          const newOpt = va.options.find(({ id }) => id === newVoId);
          if (!newOpt) {
            throw new Error("New option not found");
          }

          //set it to true
          newOpt.isSelected = true;
        } else {
          //fill the selectedProperties with already chosen vas and vos
          selectedProperties.push({
            attrId: va.id,
            optId: selOpt.id,
          });
        }
      });

      //for all posssible attribute and option combinations
      cartItem.product.attributes.forEach((va) => {
        const propertiesWithout = selectedProperties.filter(
          (selProp) => selProp.attrId !== va.id
        );

        va.options.forEach((vo) => {
          const propertiesToCheck: Properties[] = [
            ...propertiesWithout,
            { attrId: va.id, optId: vo.id },
          ];
          //see if their corresponding variant exists
          const variant = findVariant(
            cartItem.product.variants,
            propertiesToCheck
          );

          //check isDisabled accordingly
          if (variant) {
            vo.isDisabled = false;
          } else {
            vo.isDisabled = true;
          }
        });
      });

      //update the selected variant to undefined or the corresponding variant

      const selectedVariant = findVariant(
        cartItem.product.variants,
        selectedProperties
      );
      cartItem.selectedVariant = selectedVariant;
      cartItem.quantity = selectedVariant
        ? Math.min(cartItem.quantity, selectedVariant.stockCnt)
        : cartItem.quantity;

      return { ...state };
    });
  },
  syncCart: () => new Promise<void>((resolve) => resolve()),
  startPeriodicSync: () => {},
  stopPeriodicSync: () => {},
}));

export default useCartStore;
