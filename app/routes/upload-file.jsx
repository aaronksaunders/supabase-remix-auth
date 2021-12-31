import {
  Form,
  redirect,
  unstable_parseMultipartFormData,
  useActionData,
} from "remix";
import { supabaseClient, hasAuthSession } from "~/utils/db.server";

/**
 *
 * @param {*} param0
 * @returns
 */
export const action = async ({ request }) => {
  try {
    /**
     *
     * @param {*} param0
     * @returns
     */
    let uploadHandler = async ({ name, stream, filename }) => {
      console.log("in uploadHandler");

      if (name !== "my-file") {
        stream.resume();
        return;
      } else {
        console.log(name, filename);
      }

      // Get the file as a buffer
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      const { data, error } = await supabaseClient.storage
        .from("images")
        .upload(filename, buffer);
      if (error) {
        throw error;
      }

      return JSON.stringify({ data });
    };

    // get file info back after image upload
    const form = await unstable_parseMultipartFormData(request, uploadHandler);

    //convert it to an object to padd back as actionData
    const fileInfo = JSON.parse(form.get("my-file"));

    // this is response from upload handler
    console.log("the form", form.get("my-file"));

    return fileInfo;
  } catch (e) {
    console.log("action error", e);
    return { error: e };
  }
};

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: "Remix Supabase Starter",
    description: "Welcome to remix! Login Page",
  };
};

export const loader = async ({ request }) => {
  try {
    await hasAuthSession(request);
    return true;
  } catch (e) {
    return redirect("/login", {});
  }
};

// https://remix.run/guides/routing#index-routes
export default function UploadPage() {
  const actionData = useActionData();

  return (
    <div className="remix__page">
      <main>
        <h2 className="font-bold text-2xl">
          Welcome to Supabase Remix - File Upload
        </h2>
        <Form method="post" encType="multipart/form-data">
          <input type="file" id="my-file" name="my-file" />
          <button type="submit">UPLOAD</button>
        </Form>
      </main>
      <div>{actionData?.error ? actionData?.error?.message : null}</div>
      <div>
        {actionData?.data ? `File Uploaded: ${actionData?.data?.Key}` : null}
      </div>
    </div>
  );
}
