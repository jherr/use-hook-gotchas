"use client";

import { ClientOnly } from "@lazarv/react-server/client";
import { useState, use, Suspense } from "react";

function timedPromise(seconds) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(`Done in ${seconds} seconds`), seconds * 1000)
  );
}

const staticFakePromise = Promise.resolve(true);
let sequentialRenderStart = null;
function SequentialPromises() {
  if (!sequentialRenderStart) sequentialRenderStart = performance.now();

  use(staticFakePromise);

  const [shortPromise] = useState(() => timedPromise(1));
  const shortText = use(shortPromise);
  const [mediumPromise] = useState(() => timedPromise(2));
  const mediumText = use(mediumPromise);
  const [longPromise] = useState(() => timedPromise(3));
  const longText = use(longPromise);

  console.log(
    `Sequential time ${
      (performance.now() - sequentialRenderStart) / 1000
    } seconds`
  );

  return (
    <>
      <h1>Sequential</h1>
      <p>{shortText}</p>
      <p>{mediumText}</p>
      <p>{longText}</p>
    </>
  );
}

let parallelLocalRenderStart = null;
function ParallelLocalPromises() {
  if (!parallelLocalRenderStart) parallelLocalRenderStart = performance.now();

  use(staticFakePromise);

  const [shortPromise] = useState(() => timedPromise(1));
  const [mediumPromise] = useState(() => timedPromise(2));
  const [longPromise] = useState(() => timedPromise(3));
  const shortText = use(shortPromise);
  const mediumText = use(mediumPromise);
  const longText = use(longPromise);

  console.log(
    `Parallel local time ${
      (performance.now() - parallelLocalRenderStart) / 1000
    } seconds`
  );

  return (
    <>
      <h1>Parallel Local</h1>
      <p>{shortText}</p>
      <p>{mediumText}</p>
      <p>{longText}</p>
    </>
  );
}

let sequentialHoistedRenderStart = null;
function SequentialHoistedPromises({
  shortPromise,
  mediumPromise,
  longPromise,
}) {
  if (!sequentialHoistedRenderStart)
    sequentialHoistedRenderStart = performance.now();

  const longText = use(longPromise);
  const mediumText = use(mediumPromise);
  const shortText = use(shortPromise);

  console.log(
    `Parallel hoisted time ${
      (performance.now() - sequentialHoistedRenderStart) / 1000
    } seconds`
  );

  return (
    <>
      <h1>Sequential (Really Parallel) Hoisted</h1>
      <p>{shortText}</p>
      <p>{mediumText}</p>
      <p>{longText}</p>
    </>
  );
}

let promiseAllHoistedRenderStart = null;
function PromiseAllHoisted({ shortPromise, mediumPromise, longPromise }) {
  if (!promiseAllHoistedRenderStart)
    promiseAllHoistedRenderStart = performance.now();

  const [promiseGroup] = useState(() =>
    Promise.all([shortPromise, mediumPromise, longPromise])
  );
  const [shortText, mediumText, longText] = use(promiseGroup);

  console.log(
    `Parallel promise.all time ${
      (performance.now() - promiseAllHoistedRenderStart) / 1000
    } seconds`
  );

  return (
    <>
      <h1>Promise.all Hoisted</h1>
      <p>{shortText}</p>
      <p>{mediumText}</p>
      <p>{longText}</p>
    </>
  );
}

function App() {
  const [shortPromise] = useState(() => timedPromise(1));
  const [mediumPromise] = useState(() => timedPromise(2));
  const [longPromise] = useState(() => timedPromise(3));

  return (
    <>
      {/* <Suspense fallback={<p>Loading...</p>}>
        <SequentialPromises />
      </Suspense> */}
      {/* <Suspense fallback={<p>Loading...</p>}>
        <ParallelLocalPromises />
      </Suspense> */}
      {/* <Suspense fallback={<p>Loading...</p>}>
        <SequentialHoistedPromises
          shortPromise={shortPromise}
          mediumPromise={mediumPromise}
          longPromise={longPromise}
        />
      </Suspense> */}
      <Suspense fallback={<p>Loading...</p>}>
        <PromiseAllHoisted
          shortPromise={shortPromise}
          mediumPromise={mediumPromise}
          longPromise={longPromise}
        />
      </Suspense>
    </>
  );
}

export default () => (
  <ClientOnly>
    <App />
  </ClientOnly>
);
