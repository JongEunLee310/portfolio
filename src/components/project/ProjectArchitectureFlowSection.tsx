import { Fragment } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
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

const COLS = 3;

function hasText(value?: string) {
  return Boolean(value?.trim());
}

function getToneClasses(tone: ProjectArchitectureConnectionTone) {
  const classes: Record<ProjectArchitectureConnectionTone, string> = {
    sync: "border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]",
    async: "border-indigo-400/40 bg-indigo-500/10 text-indigo-500",
    data: "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-text)]",
  };
  return classes[tone];
}

function getLineClasses(tone: ProjectArchitectureConnectionTone) {
  const classes: Record<ProjectArchitectureConnectionTone, string> = {
    sync: "bg-[var(--color-accent)]",
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

  // 그룹을 COLS 단위로 행 분할 (짧은 행은 null로 패딩)
  const rows: (VisibleGroup | null)[][] = [];
  for (let i = 0; i < visibleGroups.length; i += COLS) {
    const row: (VisibleGroup | null)[] = visibleGroups.slice(i, i + COLS);
    while (row.length < COLS) row.push(null);
    rows.push(row);
  }

  return (
    <section>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.architecture.eyebrow}
        title={title}
        description={description}
      />
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-card lg:p-5">
        <div className="space-y-4 lg:space-y-0">
          {rows.map((slots, rowIndex) => {
            const nextRowSlots = rowIndex < rows.length - 1 ? rows[rowIndex + 1] : null;

            const currentRowGroupIds = new Set(
              slots
                .filter((g): g is VisibleGroup => g !== null)
                .map((g) => g.id),
            );
            const nextRowGroupIds = nextRowSlots
              ? new Set(
                  nextRowSlots
                    .filter((g): g is VisibleGroup => g !== null)
                    .map((g) => g.id),
                )
              : new Set<string>();

            const crossRowConns = nextRowSlots
              ? connections.filter(
                  (c) =>
                    currentRowGroupIds.has(nodeGroupIds.get(c.from) ?? "") &&
                    nextRowGroupIds.has(nodeGroupIds.get(c.to) ?? ""),
                )
              : [];
            const crossLabel = crossRowConns[0]?.label;

            return (
              <Fragment key={rowIndex}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-0">
                  {slots.map((group, slotIndex) => {
                const globalIndex = rowIndex * COLS + slotIndex;
                const prevGroup = slotIndex > 0 ? slots[slotIndex - 1] : null;

                const bridgeConns =
                  prevGroup && group
                    ? connections.filter(
                        (c) =>
                          nodeGroupIds.get(c.from) === prevGroup.id &&
                          nodeGroupIds.get(c.to) === group.id,
                      )
                    : [];

                const internalConns = group
                  ? connections.filter(
                      (c) =>
                        nodeGroupIds.get(c.from) === group.id &&
                        nodeGroupIds.get(c.to) === group.id,
                    )
                  : [];

                return (
                  <Fragment key={group?.id ?? `empty-${globalIndex}`}>
                    {/* 브리지: lg 이상에서만 표시 */}
                    {slotIndex > 0 && (
                      <div className="hidden lg:flex lg:w-12 lg:shrink-0 lg:flex-col lg:items-center lg:justify-center lg:px-1">
                        {prevGroup && group ? (
                          <>
                            <div
                              className="flex w-full items-center"
                              aria-hidden="true"
                            >
                              <span className="h-px flex-1 bg-[var(--color-accent-border)]" />
                              <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                            </div>
                            {bridgeConns.slice(0, 1).map((conn) => (
                              <span
                                key={`${conn.from}-${conn.to}`}
                                className={[
                                  "mt-1.5 w-full rounded-full border px-1 py-0.5 text-center text-[9px] font-semibold leading-3",
                                  getToneClasses(conn.tone),
                                ].join(" ")}
                              >
                                {conn.label ?? "→"}
                              </span>
                            ))}
                          </>
                        ) : null}
                      </div>
                    )}

                    {/* 카드 또는 빈 자리 */}
                    <div className="min-w-0 flex-1">
                      {group ? (
                        <ArchitectureGroupCard
                          group={group}
                          internalConnections={internalConns}
                          nodeLabels={nodeLabels}
                        />
                      ) : null}
                    </div>
                  </Fragment>
                );
                  })}
                </div>

                {/* 행간 wrap 커넥터: 오른쪽 끝 → 아래 → 왼쪽으로 돌아 다음 행 시작 */}
                {nextRowSlots && (
                  <div className="relative hidden h-10 lg:block" aria-hidden="true">
                    <div className="absolute bottom-6 right-0 top-0 w-px bg-[var(--color-accent-border)]" />
                    <div className="absolute bottom-6 left-5 right-0 h-px bg-[var(--color-accent-border)]" />
                    {crossLabel && (
                      <div className="absolute bottom-6 left-0 right-0 flex -translate-y-1/2 justify-center">
                        <span className="rounded-full border border-[var(--color-accent-border)] bg-[var(--color-surface)] px-1.5 py-px text-[9px] font-semibold leading-4 text-[var(--color-accent)]">
                          {crossLabel}
                        </span>
                      </div>
                    )}
                    <ArrowDown className="absolute bottom-1 left-0 h-4 w-4 text-[var(--color-accent)]" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {architectureFlow?.legends?.length ? (
          <div className="mt-5 flex flex-wrap justify-center gap-5 border-t border-[var(--color-border)] pt-4 text-xs font-semibold text-[var(--color-muted-text)]">
            {architectureFlow.legends.map((legend) => (
              <span key={legend.label} className="inline-flex items-center gap-2">
                <span
                  className={[
                    "h-px w-8",
                    legend.tone === "solid" ? "bg-[var(--color-accent)]" : "",
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

type ArchitectureGroupCardProps = {
  group: VisibleGroup;
  internalConnections: ProjectArchitectureConnection[];
  nodeLabels: Map<string, string>;
};

function ArchitectureGroupCard({
  group,
  internalConnections,
  nodeLabels,
}: ArchitectureGroupCardProps) {
  return (
    <div className="h-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
      <p className="text-center text-xs font-bold text-[var(--color-accent)]">{group.title}</p>
      <div
        className={[
          "mt-3 grid gap-2",
          group.nodes.length >= 2 ? "grid-cols-2" : "",
        ].join(" ")}
      >
        {group.nodes.map((node) => (
          <ArchitectureFlowNode key={node.id} node={node} />
        ))}
      </div>
      {internalConnections.length ? (
        <div className="mt-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
          <p className="text-[11px] font-bold text-[var(--color-muted-text)]">내부 흐름</p>
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
  );
}

function ArchitectureFlowNode({ node }: { node: ArchitectureNode & { id: string } }) {
  return (
    <article className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-center shadow-sm">
      <span className="mx-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
        <ProjectDetailIcon icon={node.icon} className="h-3.5 w-3.5" />
      </span>
      <h3 className="mt-1.5 text-xs font-bold text-[var(--color-page-text)]">{node.title}</h3>
      <ul className="mt-1 space-y-0.5 text-[11px] leading-4 text-[var(--color-muted-text)]">
        {node.items.slice(0, 3).map((item) => (
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
