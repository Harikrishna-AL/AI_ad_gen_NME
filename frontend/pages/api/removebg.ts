// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
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

function isUrl(url: string) {
  return url.length < 3000;
}

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    const { body } = req;
    const payload = body;
    const { user_id, dataUrl, project_id, type, add_to_db } = payload;

    var shouldAddToDb = true;
    if (add_to_db !== undefined) {
      shouldAddToDb = add_to_db;
    }

    var fileExtension = "png";
    if (dataUrl.includes("jpeg") || dataUrl.includes("jpg")) {
      fileExtension = "jpeg";
    }
    if (dataUrl.includes("webp")) {
      fileExtension = "webp";
    }

    if (!user_id) {
      res.status(400).send("Missing user_id");
      return;
    }

    // If DataUrl is a website url, fetch the image and convert it to a base64Url
    // Check if dataUrl is a url
    const is_url = isUrl(dataUrl);

    var inputBase64Url = "";

    if (is_url) {
      const response = await axios.get(dataUrl, {
        responseType: "arraybuffer",
      });

      const base64Url = `data:image/png;base64,${response.data.toString(
        "base64"
      )}`;
      inputBase64Url = base64Url;
    } else {
      inputBase64Url = dataUrl;
    }

    var outputBase64Url = "";
    var caption = "";

    const image_bg_response = await fetch(
      process.env.REMOVE_BG_ENDPOINT as string,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          img: inputBase64Url,
        }),
      }
    );

    const caption_bg_data = await image_bg_response.json();
    outputBase64Url = caption_bg_data["image"];

    // Upload image
    const {
      url: imageUrl,
    } = await uploadImage(outputBase64Url, user_id);

    if (shouldAddToDb === false) {
      res.status(200).send(
        JSON.stringify({
          data: { data: [outputBase64Url] },
          imageUrl,
        })
      );
      return;
    }

    // Add the image to the database
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.NEXT_PUBLIC_BACKGROUND_REMOVED_IMAGES_TABLE}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY as string,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          user_id,
          image_url: imageUrl,
          project_id: project_id || null,
          type: type === null ? "image" : type,
        }),
      }
    );

    res.status(200).send(
      JSON.stringify({
        data: { data: [outputBase64Url] },
        caption,
        imageUrl,
      })
    );
    return;
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error removing background");
    return;
  }
}
