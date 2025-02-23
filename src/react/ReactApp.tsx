/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// src/react/App.tsx
import React, { useState } from "react";

export function ReactApp({ seoData = {} }: {seoData: any}) {
  return <html>
    <head>
      <meta charSet="utf-8" />
      <title>{seoData.title}</title>
      <meta name="description" content="Bun, Elysia & React" />
      <meta name="author" content={seoData.author}></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <Counter></Counter>
    </body>
  </html>
}

export function Page ({ title = '', author = 'loklok'}) {
    
}
function Counter ({}) {
  const [count, setCount] = useState('123');
  return  <div>
    <h1>Counter {count}</h1>
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </div>
}