# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

You will be running two processes during development:

- The Miniflare server (miniflare is a local environment for Cloudflare Workers)
- The Remix development server

```sh
# in one tab, start the remix dev server
$ yarn dev

# in another, start the miniflare server
$ yarn start
```

Open up [http://127.0.0.1:8787](http://127.0.0.1:8787) and you should be ready to go!

If you'd rather run everything in a single tab, you can look at [concurrently](https://npm.im/concurrently) or similar tools to run both processes in one tab.

## Deployment

Use [wrangler](https://developers.cloudflare.com/workers/cli-wrangler) to build and deploy your application to Cloudflare Workers. If you don't have it yet, follow [the installation guide](https://developers.cloudflare.com/workers/cli-wrangler/install-update) to get it setup. Be sure to [authenticate the CLI](https://developers.cloudflare.com/workers/cli-wrangler/authentication) as well.

Once that's done, you should be able to deploy your app:

```sh
npm run deploy
```
