/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { App } from '../index'
// src/react/App.tsx
import { treaty } from "@elysiajs/eden";
import React, { useEffect, useState } from "react";
import {v4} from 'uuid'

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
      <Counter title={serverData.title}></Counter>
    </body>
  </html>
}

function Counter ({  title = '' }) {
  const [count, setCount] = useState(title);
  const [chat, setChat]= useState<any>(false)
  useEffect(() => {
    //
    const api = treaty<App>(location.host);

    const chat = api.chat.subscribe({
      query: {
        id: `${v4()}`
      }
    });

    chat.subscribe(({data: message}) => {
      console.log("got", message);
      setCount(JSON.stringify(message))
    });

    chat.on("open", () => {
      chat.send({
        message: "hello from client 123"
      });
    });

    setChat(chat)

    //
  }, [])
  return  <div>
    <h1>Counter {count}</h1>
    <button onClick={() => {
      chat.send({
        message: "hello from client 123"
      });
    }}>Increment</button>
  </div>
}