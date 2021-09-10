export const resolveUrlTemplate = (path: any, params: any) => {
  const prefixedParams = {};
  for (let key in params) {
    // @ts-ignore
    prefixedParams[":" + key] = params[key];
  }
  const re = new RegExp(Object.keys(prefixedParams).join("|"), "gi");
  return path.replace(re, function (matched: string) {
    // @ts-ignore
    return prefixedParams[matched];
  });
};
