// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
export const maxDuration = 300;
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb", // Set desired value here
    },
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (req.method === "GET") {
      // Get the user_id from the query parameters
      const user_id = req?.query?.user_id || null;
      const project_id_arg = req?.query?.project_id || null;

      if (!user_id) {
        res.status(400).send("Missing user_id");
        return;
      }

      const response = project_id_arg
        ? await supabase
            .from(process.env.PROJECTS_TABLE as string)
            .select("project_id,title,previewImage")
            .eq("user_id", user_id)
            .eq("project_id", project_id_arg)
            .order("created_at", { ascending: false })
        : await supabase
            .from(process.env.PROJECTS_TABLE as string)
            .select("project_id,title,previewImage")
            .eq("user_id", user_id)
            .order("created_at", { ascending: false });

      // Return the projects
      res.status(200).json(response.data);
      return;
    } else if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }
    // Get the request parameters
    const should_delete = req?.query?.should_delete || false;

    const { body } = req;
    const payload = body;
    const { project_id, title, previewImage, canvasHistory, recently } =
      payload;

    if (should_delete) {
      const { data, error } = await supabase
        .from(process.env.PROJECTS_TABLE as string)
        .delete()
        .match({ project_id: project_id });

      if (error) {
        console.log(error.message);
        res.status(500).send("Error in Deleting Project");
        return;
      }

      res.status(200).send({ success: true, message: "Project deleted" });
      return;
    } else if (!project_id) {
      const user_id = req?.query?.user_id || null;

      // Create a new project
      const response = await supabase
        .from(process.env.PROJECTS_TABLE as string)
        .insert([{ title: "Untitled", user_id: user_id }])
        .select();

      // Return the project_id

      const data = response.data;
      const project_id = data[0].project_id;

      res.status(200).send({ success: true, project_id: project_id });
    } else {
      let bodyObject = {};

      if (title !== null) {
        bodyObject["title"] = title;
      }

      if (previewImage !== null) {
        bodyObject["previewImage"] = previewImage;
      }

      if (canvasHistory !== null) {
        bodyObject["canvasHistory"] = canvasHistory;
      }

      if (recently !== null) {
        bodyObject["recently"] = recently;
      }
     

      const { data, error } = await supabase
        .from(process.env.PROJECTS_TABLE as string)
        .update(bodyObject)
        .match({ project_id: project_id });

      if (error) {
        console.log(error.message);
        res.status(500).send("Error in Updating Project");
        return;
      }

      // Send success response
      res.status(200).send({ success: true, project_id: project_id });
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in Creating/Updating Project");
    return;
  }
}
