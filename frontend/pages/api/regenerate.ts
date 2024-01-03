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
    const { user_id, image_url } = body;


    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" });
    }

    if (!image_url) {
      return NextResponse.json({ error: "Missing image_url" });
    }

    const response = await fetch(process.env.CELERY_WORKER_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.KEY,
        image_url: image_url,
        user_id: user_id,
        is_regenerate: true,
      }),
    });

    const json = await response.json();

    const job_id = json?.id || null;
    if (!job_id) {
      throw new Error("Sorry server is busy, please try again later");
    }

    return NextResponse.json({ message: "Job started", ok: true, job_id });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error Generating Image" });
  }
};
