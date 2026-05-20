type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type FilterPillsProps<TValue extends string> = {
  options: readonly FilterOption<TValue>[];
  selectedValue: TValue;
  onChange: (value: TValue) => void;
  ariaLabel: string;
};

export function FilterPills<TValue extends string>({
  options,
  selectedValue,
  onChange,
  ariaLabel,
}: FilterPillsProps<TValue>) {
  return (
    <div className="flex flex-wrap gap-2" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === selectedValue}
          onClick={() => onChange(option.value)}
          className={[
            "rounded-full border px-4 py-2 text-sm font-semibold transition",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
            option.value === selectedValue
              ? "border-blue-600 bg-blue-600 text-white shadow-blue-soft"
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
