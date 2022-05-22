
import { supabaseClient, hasAuthSession } from "~/utils/db.server";
import {
  redirect,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

export const action = async ({ request }) => {


  let uploadHandler = async (props) => {
    const {
      name,
      data,
      filename,
      contentType,
    } = props;


    if (name !== 'my-file') {
      data.resume();
      return;
    } else {
      console.log(name, filename);
    }

    // Get the file as a buffer
    const chunks = [];
    for await (const chunk of data) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);


    const { data:uploadData, error } = await supabaseClient.storage
      .from("images")
      .upload(filename, buffer,  { contentType});
    if (error) {
      throw error;
    }
    console.log('returning',  uploadData?.Key);
    return  uploadData?.Key;
  };

  // get file info back after image upload
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  //convert it to an object to padd back as actionData
  const fileInfo =  form.get('my-file') ;

  // this is response from upload handler
  console.log('the form', fileInfo);

  return fileInfo || null;
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
      <div>{actionData ? `File Uploaded: ${actionData}` : null}</div>
      </div>
    </div>
  );
}
