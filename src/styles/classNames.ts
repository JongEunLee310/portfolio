export const layout = {
  container: "mx-auto w-full max-w-7xl px-6 lg:px-8",
  section: "py-16 lg:py-20",
};

export const surface = {
  light: "bg-slate-50 text-slate-900",
  dark: "bg-brand-dark text-white",
  card: "rounded-2xl border border-slate-200 bg-white shadow-card",
  darkCard: "rounded-2xl border border-white/10 bg-white/[0.04] shadow-glow",
};

export const text = {
  heroTitle: "text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl",
  sectionTitle: "text-3xl font-bold tracking-tight text-slate-900",
  body: "text-sm leading-7 text-slate-600",
  darkBody: "text-sm leading-7 text-slate-300",
};

export const button = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-blue-soft transition hover:bg-blue-500",
  outline:
    "inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-500 hover:text-blue-600",
  darkOutline:
    "inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10",
};
