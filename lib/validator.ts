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
