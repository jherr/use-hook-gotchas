"use client";

import { ClientOnly } from "@lazarv/react-server/client";
import { useState, Suspense, use } from "react";

const asyncValue = Promise.resolve("Async value");

function SuspendedOptionalValueDisplay() {
  const [enabled, setEnabled] = useState(() => {
    console.log(`useState: ${Math.random()}`);
    return false;
  });

  let suspendedValue = "Default value";
  if (enabled) {
    suspendedValue = use(asyncValue);
  }

  return (
    <>
      <button onClick={() => setEnabled(!enabled)}>Toggle</button>
      <div>Value: {suspendedValue}</div>
    </>
  );
}

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <SuspendedOptionalValueDisplay />
    </Suspense>
  );
}

export default () => (
  <ClientOnly>
    <App />
  </ClientOnly>
);
