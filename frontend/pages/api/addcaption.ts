// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
export const maxDuration = 300;

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    const { body } = req;
    const payload = body;
    const { image_url, caption } = payload;

    if (!image_url) {
      res.status(400).send("Missing image_url");
      return;
    }

    if (!caption) {
      res.status(400).send("Missing caption");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.NEXT_PUBLIC_BACKGROUND_REMOVED_IMAGES_TABLE}?image_url=eq.${image_url}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY as string,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        method: "PATCH",
        body: JSON.stringify({
          caption: caption,
        }),
      }
    );

    // Send success response
    res.status(200).send({ success: true, message: "Caption added" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding caption");
    return;
  }
}
