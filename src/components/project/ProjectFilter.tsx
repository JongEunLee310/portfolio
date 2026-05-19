type FilterOption = {
  label: string;
  value: string;
};

type ProjectFilterProps = {
  options: readonly FilterOption[];
};

export function ProjectFilter({ options }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <span
          key={option.value}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        >
          {option.label}
        </span>
      ))}
    </div>
  );
}
