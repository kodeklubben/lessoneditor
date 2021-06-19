const isAppEngine = () => Boolean(process.env.GOOGLE_CLOUD_PROJECT);

export default isAppEngine;
