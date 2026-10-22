import Container from "@/components/layout/containers";

export default function Home() {
  return (
    <Container>
      <h1 className="pt-24 font-heading text-6xl font-bold max-md:text-4xl">LooP</h1>
      <p className="mt-4 text-loop-muted">Build. Share. Repeat.</p>
      <span className="mt-6 inline-block rounded-xl bg-loop-accent px-8 py-4 font-mono text-xs uppercase">
        Token test
      </span>
    </Container>
  );
}