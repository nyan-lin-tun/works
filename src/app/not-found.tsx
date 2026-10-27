import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-96 pt-16">
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-4 text-3xl">A loose end.</h1>
      <p className="mt-5 text-muted">This page couldn’t be found.</p>
      <Link href="/" className="mt-8 inline-block text-accent underline underline-offset-4">
        Back to works
      </Link>
    </section>
  );
}
