export const layout = {
  container: "mx-auto w-full max-w-7xl px-6 lg:px-8",
  section: "py-16 lg:py-20",
};

export const surface = {
  light: "bg-slate-50 text-slate-900",
  dark: "bg-[var(--color-page-bg)] text-[var(--color-page-text)]",
  card: "rounded-2xl border border-slate-200 bg-white shadow-card",
  darkCard:
    "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card",
};

export const themeSurface = {
  page: "bg-[var(--color-page-bg)] text-[var(--color-page-text)] transition-colors duration-300",
  lightBand: "bg-[var(--color-page-bg)] text-[var(--color-page-text)] transition-colors duration-300",
  surfaceBand: "bg-[var(--color-surface)] text-[var(--color-page-text)] transition-colors duration-300",
  mutedBand: "bg-[var(--color-surface-muted)] text-[var(--color-page-text)] transition-colors duration-300",
  card: "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card transition-colors duration-300",
};

export const text = {
  heroTitle: "text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl",
  sectionTitle: "text-3xl font-bold tracking-tight text-slate-900",
  body: "text-sm leading-7 text-slate-600",
  darkBody: "text-sm leading-7 text-slate-300",
};

export const button = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-[var(--color-accent-hover)]",
  outline:
    "inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
  darkOutline:
    "inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10",
};
