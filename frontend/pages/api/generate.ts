// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export const config = {
  runtime: "edge",
};

const getFileExtension = (dataUrl: string) => {
  if (dataUrl.includes("png")) {
    return "png";
  } else if (dataUrl.includes("jpg") || dataUrl.includes("jpeg")) {
    return "jpg";
  } else if (dataUrl.includes("webp")) {
    return "webp";
  } else {
    // Default extension or handle other cases as needed
    return "png";
  }
};

const uploadImage = async (dataUrl: string, user_id?: string) => {
  let base64String = dataUrl;
  if (!dataUrl.includes("data:image")) {
    base64String = `data:image/png;base64,${dataUrl}`;
  }

  // Generate a unique filename
  const filename = `${user_id}/${uuidv4()}.${getFileExtension(base64String)}`;
  const bucket_name = process.env.SUPABASE_REQUEST_IMAGES_BUCKET as string

  const byteCharacters = atob(base64String.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });

  // Upload image to supabase storage bucket
  const { error } = await supabase.storage
    .from(bucket_name)
    .upload(`${filename}`, blob, {
      cacheControl: "public, max-age=31536000, immutable",
      upsert: false,
    });

  if (error) {
    console.log(error.message);
    throw error;
  }

  return {
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket_name}/${filename}`,
    name: filename,
  };
};

export default async (req: NextRequest) => {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" });
    }

    const body = await req.json();
    const {
      dataUrl,
      prompt,
      maskDataUrl,
      user_id,
      num_images,
      lora_type,
      category,
      caption,
      is_3d,
      is_quick_generation,
      project_id,
    } = body;

    if (!dataUrl) {
      return NextResponse.json({ error: "Missing dataUrl" });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" });
    }

    const { url: imageUrl } = await uploadImage(dataUrl, user_id);

    // if (height > 768 || width > 768 || height < 256 || width < 256) {
    //   return NextResponse.json({
    //     error: "Image must be between 256px and 768px",
    //   });
    // }

    const response = await fetch(process.env.CELERY_WORKER_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.KEY,
        image_url: imageUrl,
        prompt: prompt,
        mask_image: maskDataUrl,
        user_id: user_id,
        num_images: num_images,
        lora_type: lora_type,
        category: category,
        is_dev_site: true,
        caption: caption,
        is_3d: is_3d,
        is_quick_generation: is_quick_generation,
        project_id: project_id,
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
