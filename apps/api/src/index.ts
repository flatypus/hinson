Bun.serve({
  port: 4000,
  hostname: "localhost",
  fetch(req) {
    return new Response("Hello world");
  },
});
