import { JSONContent } from "@tiptap/react";
import RichTextEditor from "./rich-text-editor";

interface RulesEditorProps {
  value: JSONContent | null;
  onChange: (rules: JSONContent) => void;
}

export default function RulesEditor({ value, onChange }: RulesEditorProps) {
  return (
    <div className="space-y-3">
      <RichTextEditor value={value} onChange={onChange} />
    </div>
  );
}
