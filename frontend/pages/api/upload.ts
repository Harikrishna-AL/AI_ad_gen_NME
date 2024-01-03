// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 300;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // Set desired value here
    },
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

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
    var { user_id, dataUrl, project_id, type } = payload;

    if (!user_id) {
      res.status(400).send("Missing user_id");
      return;
    }

    var image_type = "image";

    if (type && type.length > 0) {
      image_type = type;
    }

    if (dataUrl.length < 3000) {
      const image_response = await fetch(dataUrl);
      const image_data = await image_response.blob();
      const image_arrayBuffer = await image_data.arrayBuffer();
      const image_buffer = Buffer.from(image_arrayBuffer);
      dataUrl = `data:image/png;base64,${image_buffer.toString("base64")}`;
    }

    // Upload image to ImageKit
    const { url: imageUrl } = await uploadImage(dataUrl, user_id, false);

    if (image_type == "image") {
      // Add the image to the database
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.NEXT_PUBLIC_BACKGROUND_REMOVED_IMAGES_TABLE}`,
        {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_KEY as string,
            Authorization:
              `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            user_id,
            image_url: imageUrl,
            project_id: project_id || null,
            type: image_type,
          }),
        }
      );
    } else {
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.BRAND_ASSETS_TABLE}`,
        {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_KEY as string,
            Authorization:
              `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            user_id,
            image_url: imageUrl,
          }),
        }
      );
    }

    res.status(200).send(
      JSON.stringify({
        data: { data: [dataUrl] },
        imageUrl,
      })
    );
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Error uploading image");
    return;
  }
}
