import { Form, Link, redirect, useActionData } from "remix";
import { supabaseClient, hasAuthSession } from "~/utils/db.server";
import { getSession } from "~/utils/session.server";

export const loader = async ({ request }) => {
  try {
    await hasAuthSession(request);
    return true;
  } catch (e) {
    return redirect("/login", {});
  }
};

/**
 * called to add the new record and return the results
 *
 * @param {*} param0
 * @returns
 */
export const action = async ({ request }) => {
  // get data from form
  let form = await request.formData();
  let name = form.get("name");
  let description = form.get("description");
  let state = form.get("state");

  // use form information to write to supabase
  const { data, error } = await supabaseClient
    .from("chargers")
    .insert([{ name, description, state }]);

  // if no error, back to home page... index.jsx
  if (!error) {
    return redirect("/", {});
  }

  // else stay on page and return error information
  return { data, error };
};

export default function NewRecord() {
  const actionData = useActionData();

  return (
    <div className="remix__page">
      <main>
        <h2 className="font-bold text-2xl">Remix Supabase - New Record</h2>
        <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
          <div className="p-8">
            <Link to={"/"} style={{ textDecoration: "none" }}>
              <button className="bg-slate-700 rounded-sm w-fit px-8 mr-4 text-white">
                CANCEL
              </button>
            </Link>
          </div>
        </div>
        <Form method="post">
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="form_item">
              <label htmlFor="name">Name:</label>
              <input id="name" name="name" type="text" />
            </div>
            <div className="form_item">
              <label htmlFor="description">Description:</label>
              <input id="description" name="description" type="text" />
            </div>
            <div className="form_item">
              <label htmlFor="state">State:</label>
              <input id="state" name="state" type="text" />
            </div>
            <div className="form_item">
              <button
                className="bg-slate-500 rounded-sm w-fit px-8 mr-4 text-white"
                type="submit"
              >
                SAVE NEW RECORD
              </button>
            </div>
          </div>
        </Form>
        <div>{actionData?.error ? actionData?.error?.message : null}</div>

      </main>
    </div>
  );
}
