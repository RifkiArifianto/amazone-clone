export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Amazone Clone";

export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || "Belanja banyak, hati senang.";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Belajar NextJS dengan menggunakan React, TypeScript, TailwindCSS, NextAuth, Prisma, Vercel, and more.";

export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © 2025 ${APP_NAME}. All rights reserved.`;

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9);

export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
);
