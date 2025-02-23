import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { renderToReadableStream } from "react-dom/server";
import { createElement } from "react";
import { ReactApp } from "./react/ReactApp";

import { config } from "dotenv";

config();

// console.log(process.env.MONGODB_URI);

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
    return await getHTML({ title: "welcome!" });
  })
  .post("/bucket", async () => {
    return "bucket";
  })
  .get("/:slug", async ({ params: { slug } }) => {
    return await getHTML({ title: slug });
  })
  // .put("/aa", async (ctx) => {
  //   ctx.body;
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
