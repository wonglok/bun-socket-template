/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { App } from '../index'
// src/react/App.tsx
import { treaty } from "@elysiajs/eden";
import React, { useEffect, useState } from "react";

export function ReactApp({ serverData = {} }: { serverData: any }) {
  return <html>
    <head>
      <meta charSet="utf-8" />
      <title>{serverData.title}</title>
      <meta name="description" content="Bun, Elysia & React" />
      <meta name="author" content={serverData.author}></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <Counter endpoint={serverData.endpoint} title={serverData.title}></Counter>
    </body>
  </html>
}

function Counter ({ endpoint  = '', title = '' }) {
  const [count, setCount] = useState(title);

  useEffect(() => {
    //

    const api = treaty<App>(endpoint);

    const chat = api.chat.subscribe();

    chat.subscribe(({data: message}) => {
      console.log("got", message);
    });

    chat.on("open", () => {
      chat.send({
        auth: "hello from client 123"
      });
    });

    //
  }, [])
  return  <div>
    <h1>Counter {count}</h1>
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </div>
}