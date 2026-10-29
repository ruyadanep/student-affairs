"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (<main style={{ maxWidth: "36rem" }}><h1>Something went wrong</h1><p>We couldn't load this page. Try again, and if it keeps happening, <a href="/contact">tell the office</a>.</p><button className="btn" onClick={reset}>Try again</button></main>);
}
