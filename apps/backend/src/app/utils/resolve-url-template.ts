const resolveUrlTemplate = (path, params) => {
    const prefixedParams = {};
    for (let key in params) {
        prefixedParams[":" + key] = params[key];
    }
    const re = new RegExp(Object.keys(prefixedParams).join("|"), "gi");
    return path.replace(re, function (matched) {
        return prefixedParams[matched];
    });
}

export default resolveUrlTemplate
