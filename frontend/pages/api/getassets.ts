// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async (req: NextRequest) => {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" });
    }

    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" });
    }

    const getURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.BRAND_ASSETS_TABLE}?select=id,image_url&user_id=eq.${user_id}`;

    const response = await fetch(getURL, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY as string,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "GET",
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching images" });
  }
};
