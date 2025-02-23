import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { renderToReadableStream } from "react-dom/server";
import { createElement } from "react";
import { ReactApp } from "./react/ReactApp";

// bundle client side react-code each time the server starts
await Bun.build({
  entrypoints: ["./src/react/index.tsx"],
  outdir: "./public",
  minify: true,
  target: "browser",
  sourcemap: "external",
});

const APP_PORT = process.env.PORT || 3005;

const getHTML = async ({ title }: { title: string }) => {
  // create our react App component
  let serverData = {
    title: title,
  };

  // render the app component to a readable stream
  const stream = await renderToReadableStream(
    //
    createElement(ReactApp, {
      serverData: serverData,
    }),
    {
      bootstrapScriptContent: `
        import('/public/index.js').then(({ hydrateReactSite }) => {
          hydrateReactSite({ serverData: ${JSON.stringify(serverData)} });
        })
      `,
    }
  );

  // output the stream as the response
  return new Response(stream, {
    headers: { "Content-Type": "text/html" },
  });
};
const app = new Elysia({
  websocket: {
    perMessageDeflate: true,
  },
})
  //
  .use(staticPlugin())
  .get("/", async () => {
    return getHTML({ title: "welcome!" });
  })
  .get("/:slug", async ({ params: { slug } }) => {
    return getHTML({ title: slug });
  })

  // .get("/id/:id", ({ params: { id } }) => id)
  // .post("/mirror", ({ body }) => body, {
  //   body: t.Object({
  //     id: t.Number(),
  //     name: t.String(),
  //   }),
  // })

  // .ws("/chat", {
  //   body: t.String(),
  //   response: t.String(),
  //   message(ws, message) {
  //     ws.send(message);
  //   },
  // })

  .ws("/chat", {
    // validate incoming message
    body: t.Object({
      message: t.String(),
    }),
    query: t.Object({
      id: t.String(),
    }),
    message(ws, { message }) {
      // Get schema from `ws.data`
      const { id } = ws.data.query;
      ws.send({
        id,
        message: message + "__" + Math.random(),
        time: Date.now(),
      });
    },
  })
  .listen(APP_PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
