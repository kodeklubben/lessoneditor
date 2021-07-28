export function fileExists(file_url: string) {
  const http = new XMLHttpRequest();

  http.open("HEAD", file_url, false);
  http.send();

  return http.status !== 404;
}
