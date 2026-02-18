import { useState, useRef, useEffect } from "react";
import { taskNamesApi } from "../../services/taskNamesApi.js";
import type { TaskName } from "../../types/index.js";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AutocompleteInput = ({ value, onChange }: AutocompleteInputProps) => {
  const [suggestions, setSuggestions] = useState<TaskName[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<number>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (newValue.trim()) {
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await taskNamesApi.search(newValue.trim());
          setSuggestions(results);
          setIsOpen(true);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      }, 200);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (taskName: string) => {
    onChange(taskName);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-full bg-elevated border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-amber/50"
        placeholder="Введіть назву завдання..."
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className="bg-elevated rounded-lg shadow-xl border border-white/[0.06] absolute z-50 top-full left-0 right-0 mt-1 w-full max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSelect(suggestion.name)}
              onMouseDown={(e) => e.preventDefault()}
              className="flex items-center gap-2 px-3 py-2 hover:bg-card cursor-pointer text-sm text-secondary"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-dim"></div>
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
