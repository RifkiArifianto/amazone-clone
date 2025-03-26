import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const Price = (field: string) =>
  z.coerce
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      `${field} harus berupa angka dengan 2 digit desimal.`
    );

export const ProductInputSchema = z.object({
  name: z.string().min(3, "Nama harus minimal 3 karakter."),
  slug: z.string().min(3, "Slug harus minimal 3 karakter."),
  category: z.string().min(1, "Kategori harus ada."),
  images: z.array(z.string()).min(1, "Gambar harus ada."),
  brand: z.string().min(1, "Merek harus ada."),
  description: z.string().min(1, "Deskripsi harus ada."),
  isPublished: z.boolean(),
  price: Price("Harga"),
  listPrice: Price("List Harga"),
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative("Stok harus berupa angka positif."),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  avgRating: z.coerce
    .number()
    .min(0, "Rating harus minimal 0.")
    .max(5, "Rating harus maksimal 5."),
  numReviews: z.coerce
    .number()
    .int()
    .nonnegative("Review harus berupa angka positif."),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5),
  reviews: z.array(z.string()).default([]),
  numSales: z.coerce
    .number()
    .int()
    .nonnegative("Nomer sales harus berupa angka positif."),
});

// Order Item
export const OrderItemSchema = z.object({
  clientId: z.string().min(1, "ClientId harus diisi"),
  product: z.string().min(1, "Product harus diisi"),
  name: z.string().min(1, "Name harus diisi"),
  slug: z.string().min(1, "Slug harus diisi"),
  category: z.string().min(1, "Category harus diisi"),
  quantity: z.number().int().nonnegative("Quantity harus positif"),
  countInStock: z.number().int().nonnegative("CountInStock harus positif"),
  image: z.string().min(1, "Image harus diisi"),
  price: Price("Harga"),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const CartSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "Order harus diisi minimal 1 item"),
  itemsPrice: z.number(),
  taxPrice: z.optional(z.number()),
  shippingPrice: z.optional(z.number()),
  totalPrice: z.number(),
  paymentMethod: z.optional(z.string()),
  deliveryDateIndex: z.optional(z.number()),
  expectedDeliveryDate: z.optional(z.date()),
});
