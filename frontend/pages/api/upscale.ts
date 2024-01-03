// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export const maxDuration = 300;
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // Set desired value here
    },
  },
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
  var base64String = dataUrl;
  if (!dataUrl.includes("data:image")) {
    base64String = `data:image/png;base64,${dataUrl}`;
  }

  // Generate a unique filename
  const filename = `${user_id}/${uuidv4()}.${getFileExtension(base64String)}`;
  const bucket_name = process.env.SUPABASE_REQUEST_IMAGES_BUCKET as string;

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

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    const { body } = req;
    const payload = body;
    const { user_id, image_url } = payload;

    if (!user_id) {
      res.status(400).send("Missing user_id");
      return;
    }

    const supabaseResponse = await supabase
      .from(process.env.NEXT_PUBLIC_IMAGE_TABLE as string)
      .select("*")
      .eq("modified_image_url", image_url)
      .eq("user_id", user_id);

    // Get the prompt, caption, project_id, image_url
    const {
      prompt,
      caption,
      project_id,
      image_url: original_image_url,
    } = supabaseResponse.data[0];

    // Convert the image_url to base64 URL
    const image_response = await fetch(image_url);
    const image_data = await image_response.blob();
    const image_arrayBuffer = await image_data.arrayBuffer();
    const image_buffer = Buffer.from(image_arrayBuffer);
    const image_base64Url = `data:image/png;base64,${image_buffer.toString(
      "base64"
    )}`;

    const upscale_response = await fetch(
      process.env.UPSCALE_ENDPOINT as string,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          img: image_base64Url,
        }),
      }
    );

    const upscale_data = await upscale_response.json();
    const outputBase64Url = upscale_data["image"];

    // Upload image
    const { url: imageUrl } = await uploadImage(
      outputBase64Url,
      user_id,
      false
    );

    await supabase.from(process.env.NEXT_PUBLIC_IMAGE_TABLE as string).insert([
      {
        user_id,
        image_url: original_image_url,
        modified_image_url: imageUrl,
        project_id: project_id || null,
        type: "image",
        prompt,
        caption,
      },
    ]);

    res.status(200).send(
      JSON.stringify({
        image_url: imageUrl,
      })
    );
    return;
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error upscaling image");
    return;
  }
}
