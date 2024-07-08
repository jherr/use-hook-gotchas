"use client";

import { ClientOnly } from "@lazarv/react-server/client";
import { useState, use, Suspense } from "react";

function NameDisplay() {
  const [namePromise] = useState(() => {
    console.log(`NameDisplay 1: ${Math.random()}`);

    return fetch(`/name.json?${Math.random()}`)
      .then((res) => res.json())
      .then((data) => data.name);
  });

  const name = use(namePromise);
  useState(() => {
    console.log(`NameDisplay 2: ${Math.random()}`);
  });
  use(namePromise);
  useState(() => {
    console.log(`NameDisplay 3: ${Math.random()}`);
  });

  return <h1>{name}</h1>;
}

function App() {
  return (
    <Suspense fallback="Loading...">
      <NameDisplay />
    </Suspense>
  );
}

export default () => (
  <ClientOnly>
    <App />
  </ClientOnly>
);
