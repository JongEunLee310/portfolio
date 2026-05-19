type CodeBlockProps = {
  code: string;
  language: string;
  filename?: string;
};

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-card">
      {filename ? (
        <figcaption className="border-b border-slate-800 px-5 py-3 font-mono text-xs text-slate-400">
          {filename}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-100">
        <code data-language={language}>{code}</code>
      </pre>
    </figure>
  );
}
