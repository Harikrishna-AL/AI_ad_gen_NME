
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
    const {
      image_url,
      prompt,
      user_id,
      num_images,
      lora_type,
      category,
      caption,
    } = body;

    if (!image_url) {
      return NextResponse.json({ error: "Missing image_url" });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" });
    }

    console.log("Prompt was " + prompt);

    const response = await fetch(process.env.CELERY_WORKER_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.KEY,
        image_url,
        prompt: prompt,
        user_id: user_id,
        num_images: num_images,
        lora_type: lora_type,
        category: category,
        is_dev_site: true,
        caption: caption,
        is_bg_removed: false,
      }),
    });

    const json = await response.json();
    console.log(json);

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
