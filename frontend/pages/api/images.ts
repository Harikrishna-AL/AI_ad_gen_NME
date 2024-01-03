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
    const { user_id, project_id, is_bg_removed } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" });
    }

    if (is_bg_removed) {
      // Return Background Removed Images
      const requestURL =
        project_id != null
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.NEXT_PUBLIC_BACKGROUND_REMOVED_IMAGES_TABLE}?select=caption,image_url,project_id&user_id=eq.${user_id}&project_id=eq.${project_id}&order=created_at.desc`
          : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.NEXT_PUBLIC_BACKGROUND_REMOVED_IMAGES_TABLE}?select=caption,image_url,project_id&user_id=eq.${user_id}&order=created_at.desc`;

      const response = await fetch(requestURL, {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY as string,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "GET",
      });

      const data = await response.json();
      const revesData = data.reverse()
      return NextResponse.json({ data:revesData  });
    } else {
      // Return all the images for the user
      const requestURL =
        project_id != null
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.NEXT_PUBLIC_IMAGE_TABLE}?select=modified_image_url&user_id=eq.${user_id}&project_id=eq.${project_id}&order=created_at.desc`
          : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.NEXT_PUBLIC_IMAGE_TABLE}?select=modified_image_url&user_id=eq.${user_id}&order=created_at.desc`;

      const response = await fetch(requestURL, {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY as string,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "GET",
      });

      const data = await response.json();
      return NextResponse.json({ data });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching images" });
  }
};
