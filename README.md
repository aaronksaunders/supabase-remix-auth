# Welcome to Remix Supabase Authentication Flow Tutorial


there is a seperate branch that coincides with each of the videos with the newest branch also on the head / main

## Videos
Part 1 Is Here: https://www.youtube.com/watch?v=-KiH8feOHSc
- Simple application showing authentication flow and session management using react remix and supabase

Part 2 Is Here: https://youtu.be/ySQcGc9NICo
- How To Upload to Storage Buckets and Write Data with Remix and Supabase

## Documentation
- [Remix Docs](https://remix.run/docs)
= [Supabase Docs](https://supabase.com/docs/)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
