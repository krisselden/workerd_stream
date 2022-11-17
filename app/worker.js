export default {
  /** @param {Request} req */
  async fetch(req) {
    const { method } = req;
    const url = new URL(req.url);
    console.log(req.method, url.pathname);
    if (url.pathname === "/") {
      switch (req.method) {
        case "GET":
          return new Response(
            intoStream(async () => {
              const { default: render } = await import("./index.js");
              return render();
            }).pipeThrough(new TextEncoderStream())
          );
        case "HEAD":
          return new Response(null, {
            status: 200,
            headers: { "Transfer-Encoding": "chunked" },
          });
        default:
          return new Response(null, { status: 405 });
      }
    }
    return new Response(null, { status: 404 });
  },
};

/**
 * @template T
 * @param {() => PromiseLike<AsyncGenerator<T, void, void>>} start
 * @returns {ReadableStream<T>}
 */
function intoStream(start) {
  /** @type {AsyncGenerator<T, void, void> | undefined} */
  let generator;
  return new ReadableStream({
    async pull(controller) {
      if (!generator) {
        generator = await start();
      }
      const result = await generator.next();
      if (result.done) {
        controller.close();
      } else {
        controller.enqueue(result.value);
      }
    },
    async cancel() {
      if (generator) {
        await generator.return();
        generator = undefined;
      }
    },
  });
}
