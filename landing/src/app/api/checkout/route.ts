import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("products");
  if (!productId) {
    return NextResponse.json({ error: "Missing products param" }, { status: 400 });
  }

  const res = await fetch("https://api.polar.sh/v1/checkouts/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products: [productId],
      success_url: "https://xflowteller.com/success",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Polar checkout error:", res.status, text);
    return NextResponse.json({ error: "Checkout failed" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.redirect(data.url, 303);
}
