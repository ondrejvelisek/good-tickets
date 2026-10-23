export function LabelChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-px text-xs text-slate-600">
      {label}
    </span>
  )
}
