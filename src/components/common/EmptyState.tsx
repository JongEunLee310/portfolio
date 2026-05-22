type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-card">
      <h2 className="text-xl font-bold text-[var(--color-page-text)]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted-text)]">{description}</p>
    </div>
  );
}
