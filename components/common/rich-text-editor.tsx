"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";



// 🔹 TinyMCE local (sin CDN)
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin.min.css";

// 🔹 Plugins
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";

// 🧩 Tipado de props
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
  return (
    <Editor
      licenseKey="gpl"
    //   value={value}
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
        // 🖼️ Cargar imágenes locales en base64
        file_picker_callback: (
            cb: (url: string, meta?: Record<string, any>) => void,
            _value: string,
            meta: Record<string, any>
        ) => {
          if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
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
