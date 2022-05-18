/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "./app",
  cacheDirectory: "./node_modules/.cahce/remix",
  ignoredRouteFiles: ["./*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
};
