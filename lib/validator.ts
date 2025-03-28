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

// USER
const UserName = z
  .string()
  .min(2, { message: "Username harus minimal 2 karakter" })
  .max(50, { message: "Username maksimal 50 karakter" });
const Email = z.string().min(1, "Email harus diisi").email("Email harus valid");
const Password = z.string().min(3, "Password harus minimal 3 karakter");
const UserRole = z.string().min(1, "Role harus diisi");

export const UserInputSchema = z.object({
  name: UserName,
  email: Email,
  image: z.string().optional(),
  emailVerified: z.boolean(),
  role: UserRole,
  password: Password,
  paymentMethod: z.string().min(1, "Payment method harus diisi"),
  address: z.object({
    fullName: z.string().min(1, "Full name harus diisi"),
    street: z.string().min(1, "Street harus diisi"),
    city: z.string().min(1, "City harus diisi"),
    province: z.string().min(1, "Province harus diisi"),
    postalCode: z.string().min(1, "Postal code harus diisi"),
    country: z.string().min(1, "Country harus diisi"),
    phone: z.string().min(1, "Phone harus diisi"),
  }),
});

export const UserSignInSchema = z.object({
  email: Email,
  password: Password,
});
