import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";

interface TagSelectorProps {
  available: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
  placeholder?: string;
  allowAdd?: boolean;
  onAddNew?: (tag: string) => void;
  emptyHint?: string;
}

/**
 * Reusable clickable tag selector.
 * - multi=true: toggles tags in/out of selected array
 * - multi=false: single selection (selected has 0 or 1 item)
 */
export function TagSelector({
  available,
  selected,
  onChange,
  multi = true,
  placeholder = "Adicionar novo (ex: Atendimento)",
  allowAdd = true,
  onAddNew,
  emptyHint,
}: TagSelectorProps) {
  const [draft, setDraft] = useState("");

  const chips = useMemo(() => {
    const set = new Set<string>([...available, ...selected]);
    return Array.from(set);
  }, [available, selected]);

  function toggle(tag: string) {
    if (multi) {
      onChange(
        selected.includes(tag)
          ? selected.filter((t) => t !== tag)
          : [...selected, tag],
      );
    } else {
      onChange(selected[0] === tag ? [] : [tag]);
    }
  }

  function addNew() {
    const t = draft.trim();
    if (!t) return;
    if (!chips.includes(t)) onAddNew?.(t);
    if (multi) {
      if (!selected.includes(t)) onChange([...selected, t]);
    } else {
      onChange([t]);
    }
    setDraft("");
  }

  return (
    <div className="space-y-3">
      {chips.length === 0 && emptyHint && (
        <p className="text-xs text-muted-foreground">{emptyHint}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {chips.map((s) => {
          const active = selected.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/40"
              }`}
              aria-pressed={active}
            >
              {active ? "✓ " : <Tag className="inline h-3 w-3 mr-1" />}
              {s}
            </button>
          );
        })}
      </div>
      {allowAdd && (
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNew();
              }
            }}
            placeholder={placeholder}
            className="max-w-xs"
          />
          <Button type="button" variant="outline" onClick={addNew}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>
      )}
    </div>
  );
}
