export function PythonSnippet({ code }: { code: string }) {
  return (
    <div
      className="overflow-x-auto rounded-lg px-5 py-4"
      style={{ background: "var(--color-calc-bg)" }}
    >
      <pre className="m-0 font-mono text-[13px] leading-relaxed text-indigo-100">
        {code}
      </pre>
    </div>
  );
}
