import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: "https://xflowteller.com/success?checkout_id={CHECKOUT_ID}",
  server: "production",
});
