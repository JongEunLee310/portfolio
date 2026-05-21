import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type {
  ArchitectureNode,
  ProjectArchitectureConnection,
  ProjectArchitectureConnectionTone,
  ProjectArchitectureGroup,
  ProjectDetail,
} from "@/types/project";
import { ProjectDetailIcon } from "./ProjectDetailIcon";

type ProjectArchitectureFlowSectionProps = {
  architecture: ProjectDetail["architecture"];
  architectureFlow?: ProjectDetail["architectureFlow"];
};

type VisibleGroup = Omit<ProjectArchitectureGroup, "id" | "nodes"> & {
  id: string;
  nodes: (ArchitectureNode & { id: string })[];
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

function getToneClasses(tone: ProjectArchitectureConnectionTone) {
  const classes: Record<ProjectArchitectureConnectionTone, string> = {
    sync: "border-blue-400 bg-blue-50 text-blue-700",
    async: "border-indigo-300 bg-indigo-50 text-indigo-700",
    data: "border-slate-300 bg-slate-50 text-slate-600",
  };

  return classes[tone];
}

function getLineClasses(tone: ProjectArchitectureConnectionTone) {
  const classes: Record<ProjectArchitectureConnectionTone, string> = {
    sync: "bg-blue-500",
    async: "border-t border-dashed border-indigo-500",
    data: "bg-slate-300",
  };

  return classes[tone];
}

export function ProjectArchitectureFlowSection({
  architecture,
  architectureFlow,
}: ProjectArchitectureFlowSectionProps) {
  const sourceGroups = architectureFlow?.groups ?? [
    {
      id: "architecture",
      title: architecture.title,
      nodes: architecture.nodes,
    },
  ];
  const visibleGroups: VisibleGroup[] = sourceGroups
    .map((group, groupIndex) => ({
      ...group,
      id: group.id ?? `group-${groupIndex}`,
      nodes: group.nodes
        .map((node, nodeIndex) => ({
          ...node,
          id: node.id ?? `${group.id ?? group.title}-${nodeIndex}`,
        }))
        .filter((node) => hasText(node.title) && node.items.length),
    }))
    .filter((group) => group.nodes.length > 0);
  const title = architectureFlow?.title ?? architecture.title;
  const description = architectureFlow?.description ?? architecture.description;
  const nodeLabels = new Map(
    visibleGroups.flatMap((group) =>
      group.nodes.map((node) => [node.id, node.title] as const),
    ),
  );
  const nodeGroupIds = new Map(
    visibleGroups.flatMap((group) =>
      group.nodes.map((node) => [node.id, group.id] as const),
    ),
  );
  const connections = architectureFlow?.connections ?? [];

  if (!hasText(title) || visibleGroups.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.architecture.eyebrow}
        title={title}
        description={description}
      />
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-card lg:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_72px_minmax(0,0.8fr)_72px_minmax(0,1.45fr)_72px_minmax(0,1.2fr)_72px_minmax(0,1fr)]">
          {visibleGroups.map((group, index) => {
            const nextGroup = visibleGroups[index + 1];
            const bridgeConnections = nextGroup
              ? connections.filter(
                  (connection) =>
                    nodeGroupIds.get(connection.from) === group.id &&
                    nodeGroupIds.get(connection.to) === nextGroup.id,
                )
              : [];
            const internalConnections = connections.filter(
              (connection) =>
                nodeGroupIds.get(connection.from) === group.id &&
                nodeGroupIds.get(connection.to) === group.id,
            );

            return (
              <ArchitectureFlowFragment
                key={group.id}
                group={group}
                bridgeConnections={bridgeConnections}
                internalConnections={internalConnections}
                nodeLabels={nodeLabels}
                showBridge={Boolean(nextGroup)}
              />
            );
          })}
        </div>

        {architectureFlow?.legends?.length ? (
          <div className="mt-5 flex flex-wrap justify-center gap-5 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500">
            {architectureFlow.legends.map((legend) => (
              <span key={legend.label} className="inline-flex items-center gap-2">
                <span
                  className={[
                    "h-px w-8",
                    legend.tone === "solid" ? "bg-blue-500" : "",
                    legend.tone === "dashed"
                      ? "border-t border-dashed border-indigo-500"
                      : "",
                    legend.tone === "muted" ? "bg-slate-300" : "",
                  ].join(" ")}
                  aria-hidden="true"
                />
                {legend.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

type ArchitectureFlowFragmentProps = {
  group: VisibleGroup;
  bridgeConnections: ProjectArchitectureConnection[];
  internalConnections: ProjectArchitectureConnection[];
  nodeLabels: Map<string, string>;
  showBridge: boolean;
};

function ArchitectureFlowFragment({
  group,
  bridgeConnections,
  internalConnections,
  nodeLabels,
  showBridge,
}: ArchitectureFlowFragmentProps) {
  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
        <p className="text-center text-xs font-bold text-blue-600">{group.title}</p>
        <div
          className={[
            "mt-3 grid gap-2",
            group.nodes.length > 3 ? "sm:grid-cols-2 lg:grid-cols-2" : "",
          ].join(" ")}
        >
          {group.nodes.map((node) => (
            <ArchitectureFlowNode key={node.id} node={node} />
          ))}
        </div>
        {internalConnections.length ? (
          <div className="mt-3 rounded-md border border-slate-200 bg-white/80 p-2">
            <p className="text-[11px] font-bold text-slate-500">내부 흐름</p>
            <div className="mt-2 space-y-1.5">
              {internalConnections.map((connection) => (
                <ConnectionLabel
                  key={`${connection.from}-${connection.to}-${connection.label}`}
                  connection={connection}
                  nodeLabels={nodeLabels}
                  compact
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {showBridge ? (
        <div className="flex items-center justify-center py-2 lg:py-0">
          <div className="hidden w-full lg:block">
            <div className="flex items-center" aria-hidden="true">
              <span className="h-px flex-1 bg-blue-300" />
              <ArrowRight className="h-4 w-4 text-blue-500" />
            </div>
            {bridgeConnections.length ? (
              <div className="mt-2 space-y-1.5">
                {bridgeConnections.slice(0, 3).map((connection) => (
                  <ConnectionLabel
                    key={`${connection.from}-${connection.to}-${connection.label}`}
                    connection={connection}
                    nodeLabels={nodeLabels}
                    compact
                  />
                ))}
              </div>
            ) : null}
          </div>
          <ArrowRight
            className="h-5 w-5 rotate-90 text-blue-500 lg:hidden"
            aria-hidden="true"
          />
        </div>
      ) : null}
    </>
  );
}

function ArchitectureFlowNode({ node }: { node: ArchitectureNode & { id: string } }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-2.5 text-center shadow-sm">
      <span className="mx-auto inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
        <ProjectDetailIcon icon={node.icon} className="h-3.5 w-3.5" />
      </span>
      <h3 className="mt-1.5 text-xs font-bold text-slate-900">{node.title}</h3>
      <ul className="mt-1 space-y-0.5 text-[11px] leading-4 text-slate-600">
        {node.items.slice(0, 2).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

type ConnectionLabelProps = {
  connection: ProjectArchitectureConnection;
  nodeLabels: Map<string, string>;
  compact?: boolean;
};

function ConnectionLabel({
  connection,
  nodeLabels,
  compact = false,
}: ConnectionLabelProps) {
  const from = nodeLabels.get(connection.from) ?? connection.from;
  const to = nodeLabels.get(connection.to) ?? connection.to;

  return (
    <div
      className={[
        "rounded-full border px-2 py-1 font-semibold",
        compact ? "text-[10px] leading-4" : "text-xs",
        getToneClasses(connection.tone),
      ].join(" ")}
    >
      <span className="sr-only">
        {from}에서 {to}로 연결
      </span>
      <span aria-hidden="true" className="block truncate">
        {connection.label ?? `${from} -> ${to}`}
      </span>
      <span
        className={["mt-1 block h-px", getLineClasses(connection.tone)].join(" ")}
        aria-hidden="true"
      />
    </div>
  );
}
