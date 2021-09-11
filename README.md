# til.webdonalds.org

> Today I Learned

Visit [homepage](https://til.webdonalds.org).

## Development

```shell
yarn
yarn start
```

## Deployment

[![Netlify Status](https://api.netlify.com/api/v1/badges/97f61d46-dba2-402a-927a-60a76b685798/deploy-status)](https://app.netlify.com/sites/eloquent-bartik-e289ea/deploys)

We use [Netlify](https://netlify.com) to deployment pages. Push the `main` branch to make a deployment.

```shell
yarn
yarn build

yarn global add serve
serve -s build
```
