module.exports{
  resolve:{
    fallback:{
      { "path": require.resolve("path-browserify") },
      { "url": require.resolve("url/") },
      { "assert": require.resolve("assert/") },
      { "stream": require.resolve("stream-browserify") },
      { "http": require.resolve("stream-http") },
      { "zlib": require.resolve("browserify-zlib") },
      { "os": require.resolve("os-browserify/browser") },
      { "constants": require.resolve("constants-browserify") },
      { "https": require.resolve("https-browserify") },
      { "process": require.resolve("process/browser") }
    }
  }
}
