import { calcDeliveryDateAndPrice } from "@/lib/actions/order.action";
import { Cart, OrderItem } from "@/types";
import { persist } from "zustand/middleware";
import { create } from "zustand";

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryDateIndex: undefined,
};

interface CartState {
  cart: Cart;
  addItem: (item: OrderItem, quantity: number) => Promise<string>;

  updateItem: (item: OrderItem, quantity: number) => Promise<void>;
  removeItem: (item: OrderItem) => void;
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      addItem: async (item: OrderItem, quantity: number) => {
        const { items, deliveryDateIndex } = get().cart;
        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error("Not enough item in stock");
          }
        } else {
          if (item.countInStock < item.quantity) {
            throw new Error("Not enough item in stock");
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }];

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              deliveryDateIndex: deliveryDateIndex ?? 0, // Pastikan selalu ada nilai
              items: updatedCartItems,
            })),
          },
        });

        const foundItem = updatedCartItems.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        if (!foundItem) {
          throw new Error("Item not found in cart");
        }

        return foundItem.clientId;
      },

      updateItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart;
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );
        if (!exist) return;
        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity: quantity }
            : x
        );
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              deliveryDateIndex: get().cart.deliveryDateIndex ?? 0,
              items: updatedCartItems,
            })),
          },
        });
      },

      removeItem: async (item: OrderItem) => {
        const { items } = get().cart;
        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.color !== item.color ||
            x.size !== item.size
        );
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              deliveryDateIndex: get().cart.deliveryDateIndex ?? 0,
              items: updatedCartItems,
            })),
          },
        });
      },

      init: () => set({ cart: initialState }),
    }),
    {
      name: "cart-store",
    }
  )
);

export default useCartStore;
