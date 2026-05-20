import { aboutArchDiagram } from "@/constants/about";
import { surface } from "@/styles/classNames";

function NodeBox({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-center font-mono text-xs text-blue-300">
      {children}
    </span>
  );
}

function ServiceGroup({
  title,
  type,
  resources,
}: {
  title: string;
  type: string;
  resources: readonly string[];
}) {
  return (
    <article className="rounded-lg border border-blue-300/30 p-3">
      <p className="font-mono text-xs font-semibold text-blue-300">
        {title} <span className="text-blue-400/70">({type})</span>
      </p>
      <ul className="mt-3 space-y-1.5">
        {resources.map((resource) => (
          <li key={`${title}-${resource}`} className="font-mono text-xs text-slate-400">
            - {resource}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function AboutArchDiagram() {
  const [client, cloudFront, apiGateway] = aboutArchDiagram.entryFlow;

  return (
    <div className={`hidden p-6 lg:block ${surface.darkCard}`}>
      <div className="mx-auto grid w-fit grid-cols-[auto_auto_auto_auto_auto] items-center gap-2">
        <NodeBox>{client}</NodeBox>
        <span className="font-mono text-xs text-slate-500">
          {aboutArchDiagram.arrows.right}
        </span>
        <NodeBox>{cloudFront}</NodeBox>
        <span className="font-mono text-xs text-slate-500">
          {aboutArchDiagram.arrows.right}
        </span>
        <NodeBox>{apiGateway}</NodeBox>

        <span className="col-start-5 justify-self-center pt-4 font-mono text-xs text-slate-500">
          {aboutArchDiagram.arrows.down}
        </span>
        <div className="col-start-5 h-4 w-px justify-self-center bg-blue-400/30" />
      </div>

      <div className="mx-auto mt-1 h-px w-2/3 bg-blue-400/30" />

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {aboutArchDiagram.services.map((service) => (
          <div key={service.title} className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-slate-500">
              {aboutArchDiagram.arrows.down}
            </span>
            <ServiceGroup {...service} />
          </div>
        ))}
      </div>
    </div>
  );
}
