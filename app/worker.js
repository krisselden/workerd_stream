export default {
  /** @param {Request} req */
  async fetch(req) {
    const { method } = req;
    const url = new URL(req.url);
    console.log(req.method, url.pathname);
    if (url.pathname === "/") {
      /** @type {ReadableStream<Uint8Array> | null} */
      let body = null;
      switch (req.method) {
        case "GET":
          body = intoStream(async () => {
            const { default: render } = await import("./index.js");
            return render();
          }).pipeThrough(new TextEncoderStream());
          break;
        case "HEAD":
          break;
        default:
          return new Response(null, { status: 405 });
      }
      return new Response(body, {
        status: 200,
        headers: { "Transfer-Encoding": "chunked" },
      });
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
