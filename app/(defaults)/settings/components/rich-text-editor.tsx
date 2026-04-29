'use client';

import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Link } from '@tiptap/extension-link';

import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table as TableIcon, Trash, Plus, Minus
} from 'lucide-react';

interface RichTextEditorProps {
  value: JSONContent | null;
  onChange: (value: JSONContent) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const btnClass = (active: boolean) => 
    `p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${active ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-700 dark:text-gray-300'}`;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
        title="Negrita"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
        title="Cursiva"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive('underline'))}
        title="Subrayado"
      >
        <UnderlineIcon size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive('heading', { level: 1 }))}
        title="Título 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
        title="Título 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
        title="Título 3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
        title="Lista de viñetas"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
        title="Lista numerada"
      >
        <ListOrdered size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={btnClass(editor.isActive({ textAlign: 'left' }))}
        title="Alinear a la izquierda"
      >
        <AlignLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={btnClass(editor.isActive({ textAlign: 'center' }))}
        title="Centrar"
      >
        <AlignCenter size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={btnClass(editor.isActive({ textAlign: 'right' }))}
        title="Alinear a la derecha"
      >
        <AlignRight size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={btnClass(editor.isActive({ textAlign: 'justify' }))}
        title="Justificar"
      >
        <AlignJustify size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className={btnClass(false)}
        title="Insertar tabla"
      >
        <TableIcon size={18} />
      </button>
      
      {editor.isActive('table') && (
        <>
          <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className={btnClass(false)} title="Insertar columna antes"><Plus size={14} className="inline"/> Col</button>
          <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className={btnClass(false)} title="Insertar columna después"><Plus size={14} className="inline"/> Col</button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className={btnClass(false)} title="Eliminar columna"><Minus size={14} className="inline"/> Col</button>
          <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className={btnClass(false)} title="Insertar fila antes"><Plus size={14} className="inline"/> Fila</button>
          <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className={btnClass(false)} title="Insertar fila después"><Plus size={14} className="inline"/> Fila</button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className={btnClass(false)} title="Eliminar fila"><Minus size={14} className="inline"/> Fila</button>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className={btnClass(false)} title="Eliminar tabla"><Trash size={14} className="inline text-red-500"/></button>
        </>
      )}

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1"></div>
      
      <div className="flex items-center gap-1">
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
          title="Color de texto"
        />
      </div>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        className: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 overflow-hidden">
      <MenuBar editor={editor} />
      <div className="max-h-[500px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      
      {/* Tiptap Table Styles */}
      <style jsx global>{`
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #e5e7eb;
          padding: 6px 8px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: #f9fafb;
        }
        .dark .ProseMirror table td,
        .dark .ProseMirror table th {
          border-color: #374151;
        }
        .dark .ProseMirror table th {
          background-color: #1f2937;
        }
        .ProseMirror p {
            margin: 0.5em 0;
        }
        .ProseMirror ul {
            list-style-type: disc;
            padding-left: 1.5em;
        }
        .ProseMirror ol {
            list-style-type: decimal;
            padding-left: 1.5em;
        }
      `}</style>
    </div>
  );
}
