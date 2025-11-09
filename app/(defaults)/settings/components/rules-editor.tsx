import OptionalInfo from "@/components/common/optional-info";
import { IconX } from "@/components/icon";
import { Button, Input } from "@/components/ui";
import Tooltip from "@/components/ui/tooltip";
import { useState } from "react";

interface RulesEditorProps {
  value: string[];
  onChange: (rules: string[]) => void;
}

export default function RulesEditor({ value, onChange }: RulesEditorProps) {
  const [input, setInput] = useState("");

  const onNewRuleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRule();
    }
  };

  const addRule = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setInput("");
  };

  const removeRule = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onNewRuleInputKeyPress}
          placeholder="Escribe una nueva regla..."
        //   className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={addRule}
          color="secondary"
        >
           Agregar
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="pt-4 text-center">
        <OptionalInfo message="No hay reglas agregadas aún." />
        </div>
      ) : (
        <ul className="space-y-2">
          {value.map((rule, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm"
            >
              <span className="">{rule}</span>
              {/* <Button
                onClick={() => removeRule(index)}
                color="danger"
                variant="outline"
                size="sm"
                icon={<IconX className="size-4"/>}
              /> */}
              <Tooltip title="Eliminar regla">
                <div className="cursor-pointer" onClick={() => removeRule(index)} >
                    <IconX className="text-red-500 size-5 min-w-max"/>
                </div>
              </Tooltip>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
