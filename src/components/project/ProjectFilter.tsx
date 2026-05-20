import { FilterPills } from "@/components/common/FilterPills";

type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type ProjectFilterProps<TValue extends string> = {
  options: readonly FilterOption<TValue>[];
  selectedValue: TValue;
  onChange: (value: TValue) => void;
  ariaLabel: string;
};

export function ProjectFilter<TValue extends string>({
  options,
  selectedValue,
  onChange,
  ariaLabel,
}: ProjectFilterProps<TValue>) {
  return (
    <FilterPills
      options={options}
      selectedValue={selectedValue}
      onChange={onChange}
      ariaLabel={ariaLabel}
    />
  );
}
