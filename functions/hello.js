export function onRequest() {
  return new Response("Pages Functions работают", {
    headers: { "Content-Type": "text/plain" }
  });
}
