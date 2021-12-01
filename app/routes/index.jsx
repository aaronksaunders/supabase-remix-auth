import { useLoaderData, redirect, Form } from "remix";
import { supabaseClient } from "~/utils/db.server";
import { getSession, destroySession } from "~/utils/session.server";

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader = async ({ request }) => {
  const redirectTo = new URL(request.url).pathname;

  let session = await getSession(request.headers.get("Cookie"));

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
  const { chargers, error, userId } = useLoaderData();

  return (
    <div className="remix__page">
      <main>
        <h2>Welcome to Remix!: {userId}</h2>
        <Form method="post">
          <div style={{ width: 300 }}>
            <button>Logout</button>
          </div>
        </Form>
        <p>We're stoked that you're here. 🥳</p>
        <pre>{chargers ? JSON.stringify(chargers, null, 2) : null}</pre>
      </main>
    </div>
  );
}
