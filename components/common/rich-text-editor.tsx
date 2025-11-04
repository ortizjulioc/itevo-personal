"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// ✅ Carga dinámica del Editor (evita SSR y errores de window)
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod: any) => mod.Editor),
  { ssr: false }
) as any;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = 400,
  placeholder = "Escribe aquí...",
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Editor
      licenseKey="gpl"
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: true,
        skin: false,
        content_css: false,
        branding: false,
        promotion: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic underline forecolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | image media table link | removeformat | help",
        placeholder,
        automatic_uploads: true,
        file_picker_types: "image",

        // ✅ Tipado correcto de los parámetros
        file_picker_callback: (
          cb: (url: string, meta?: Record<string, any>) => void,
          _value: string,
          meta: { filetype: string }
        ) => {
          if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";

            input.onchange = function () {
              const file = (this as HTMLInputElement).files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = function () {
                const id = "blobid" + new Date().getTime();
                const blobCache =
                  (window as any).tinymce.activeEditor.editorUpload.blobCache;
                const base64 = (reader.result as string).split(",")[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };

            input.click();
          }
        },

        content_style: `
          body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
          h1,h2,h3 { font-weight:bold; }
          img { max-width:100%; height:auto; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; }
        `,
      }}
    />
  );
};

export default RichTextEditor;
