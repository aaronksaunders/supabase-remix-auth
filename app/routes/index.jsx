import { useLoaderData, redirect, Form, Link } from "remix";
import { supabaseClient } from "~/utils/db.server";
import { getSession, destroySession } from "~/utils/session.server";

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader = async ({ request }) => {
  const redirectTo = new URL(request.url).pathname;

  console.log(request.headers.get("Cookie"))

  let session = await getSession(request.headers.get("Cookie"));
  console.log(session.has('access_token'));

  // if there is no access token in the header then
  // the user is not authenticated, go to login
  if (!session.has("access_token")) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  } else {
    // otherwise execute the query for the page, but first get token
    const { user, error: sessionErr } = await supabaseClient.auth.api.getUser(
      session.get("access_token")
    );

    // if no error then get then set authenticated session
    // to match the user associated with the access_token
    if (!sessionErr) {
      // activate the session with the auth_token
      supabaseClient.auth.setAuth(session.get("access_token"));

      // now query the data you want from supabase
      const { data: chargers, error } = await supabaseClient
        .from("chargers")
        .select("*");

      // return data and any potential errors alont with user
      return { chargers, error, user };
    } else {
      return { error: sessionErr };
    }
  }
};

/**
 * this handles the form submit which destroys the user session
 * and by default logs the user out of application
 * @param {*} param0
 * @returns
 */
export const action = async ({ request }) => {
  // get session
  let session = await getSession(request.headers.get("Cookie"));

  // destroy session and redirect to login page
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: "Remix Supabase Starter",
    description: "Welcome to remix!",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const { chargers, error, user } = useLoaderData();

  return (
    <div className="remix__page">
      <main>
        <div className="flex flex-1 items-center flex-col my-4 ">
          <h2 className="font-bold text-2xl">Welcome to Remix Supabase App</h2>
          <h4> {user?.email}</h4>
        </div>
        <div className="flex flex-1 items-center flex-row my-4 ">
          <Link to={"/new-record"} style={{ textDecoration: "none" }}>
            <button className="bg-slate-500 rounded-sm w-fit px-8 mr-4 text-white">
              NEW RECORD
            </button>
          </Link>
          <Link to={"/upload-file"} style={{ textDecoration: "none" }}>
            <button className="bg-slate-500 rounded-sm w-fit px-8 mr-4 text-white">
              UPLOAD FILE
            </button>
          </Link>
          <Form method="post">
            <button className="bg-slate-700 rounded-sm w-fit px-8 mr-4 text-white">
              LOGOUT
            </button>
          </Form>
        </div>
        {/* <pre>{chargers ? JSON.stringify(chargers, null, 2) : null}</pre> */}
        {chargers?.map((c) => (
          <div className="border-b-2 m-4 pb-2 ">
            <div className="font-bold text-xl py-1">{c.name}</div>
            <div className="py-1">State: {c.state}</div>
            <div className="py-1">{c.description}</div>
            <div className="py-1">{new Date(c.updated_at).toDateString()}</div>
            <div className="flex flex-1 items-center flex-row my-4">
              <div className="px-2 py-1 m-1 border border-solid">
                {c.wifi ? "wifi" : "no wifi"}
              </div>
              <div className="px-2 py-1 m-1 border border-solid">
                {c.kw || 0}&nbsp;kW
              </div>
              <div className="px-2 py-1 m-1 border border-solid">
                {c.stalls || 0}&nbsp;Stalls
              </div>
            </div>
          </div>
        ))}

        {/* if there is an error, display it */}
        <div>{error ? error?.message : null}</div>
      </main>
    </div>
  );
}
