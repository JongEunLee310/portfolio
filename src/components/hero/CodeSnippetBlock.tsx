import { surface } from "@/styles/classNames";

type CodeSnippetBlockProps = {
  filename: string;
  lines: string[];
};

function getLineClassName(line: string) {
  if (line.startsWith("#")) {
    return "text-slate-500";
  }

  if (line.startsWith("@")) {
    return "text-blue-400";
  }

  return "text-slate-300";
}

export function CodeSnippetBlock({ filename, lines }: CodeSnippetBlockProps) {
  return (
    <div className={`${surface.darkCard} hidden overflow-hidden lg:block`}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <p className="text-xs font-medium text-slate-500">{filename}</p>
      </div>
      <pre className="overflow-x-auto px-6 py-5 font-mono text-sm leading-7 text-slate-300">
        {lines.map((line, index) => (
          <code
            key={`${filename}-${index}`}
            className={`block ${getLineClassName(line)}`}
          >
            {line}
          </code>
        ))}
      </pre>
    </div>
  );
}
