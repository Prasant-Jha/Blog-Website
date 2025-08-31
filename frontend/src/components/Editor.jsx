import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";

// FontSize Extension
const FontSize = Extension.create({
    name: "fontSize",
    addOptions() {
        return { types: ["textStyle"] };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize?.replace("px", ""),
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) return {};
                            return { style: `font-size: ${attributes.fontSize}px` };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize:
                (fontSize) =>
                ({ chain }) =>
                    chain().setMark("textStyle", { fontSize }).run(),
        };
    },
});

const TiptapEditor = ({ content, onChange }) => {
    const [currentFontSize, setCurrentFontSize] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Highlight,
            FontSize,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            CharacterCount.configure({ limit: 5000 }),
            Link.configure({
                openOnClick: true,
                autolink: true,
                linkOnPaste: true,
                protocols: ["http", "https", "mailto"],
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: "min-h-[300px] border border-gray-300 rounded-b p-4 prose focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
            const attributes = editor.getAttributes("textStyle");
            setCurrentFontSize(attributes?.fontSize || "");
        },
    });

    useEffect(() => {
        return () => {
            if (editor) editor.destroy();
        };
    }, [editor]);

    if (!editor) return null;

    const isActive = (format, options = undefined) =>
        editor.isActive(format, options)
            ? "bg-blue-200 text-blue-800 border-blue-400"
            : "bg-white text-gray-800";

    const toolbarBtnClass = "px-2 py-1 border rounded text-sm font-medium";

    // Insert image from local device
    const insertImage = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:4000/api/uploads/upload-inline-image", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    // Show backend error message clearly
                    alert(data.message || "Image upload failed");
                    return;
                }

                if (data.url) {
                    editor.chain().focus().setImage({ src: data.url }).run();
                }
            } catch (err) {
                console.error("Image upload failed", err);
                alert("Image upload failed. Please try again.");
            }
        };

        input.click();
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 border rounded-t">
                {/* Font size dropdown */}
                <select
                    className="border px-2 py-1 rounded text-sm"
                    onChange={(e) =>
                        editor.chain().focus().setFontSize(e.target.value).run()
                    }
                    value={currentFontSize}
                >
                    <option value="">Font Size</option>
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="24">24px</option>
                    <option value="32">32px</option>
                </select>

                {/* Bold, Italic, Underline, Highlight */}
                <div className="flex gap-1 border-l pl-2">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`${toolbarBtnClass} ${isActive("bold")}`}
                    >
                        B
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`${toolbarBtnClass} italic ${isActive("italic")}`}
                    >
                        I
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleUnderline?.().run()
                        }
                        className={`${toolbarBtnClass} underline ${isActive("underline")}`}
                    >
                        U
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={`${toolbarBtnClass} ${isActive("highlight")}`}
                    >
                        Highlight
                    </button>
                </div>

                {/* Text Alignment */}
                <div className="flex gap-1 border-l pl-2">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        className={`${toolbarBtnClass} ${isActive({ textAlign: "left" })}`}
                    >
                        ⬅
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().setTextAlign("center").run()
                        }
                        className={`${toolbarBtnClass} ${isActive({ textAlign: "center" })}`}
                    >
                        ⬍
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        className={`${toolbarBtnClass} ${isActive({ textAlign: "right" })}`}
                    >
                        ➡
                    </button>
                </div>

                {/* Text Color */}
                <div className="flex items-center gap-2 border-l pl-2">
                    <label className="text-sm text-gray-600">Color</label>
                    <input
                        type="color"
                        onChange={(e) =>
                            editor.chain().focus().setColor(e.target.value).run()
                        }
                        className="w-8 h-6 border rounded"
                    />
                </div>

                {/* Image Button */}
                <div className="flex gap-1 border-l pl-2">
                    <button
                        type="button"
                        onClick={insertImage}
                        className={toolbarBtnClass}
                    >
                        🖼️ Image
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Character Count */}
            <div className="text-sm text-right text-gray-500 mt-1">
                {editor.storage.characterCount.characters()}/1000 characters
            </div>
        </div>
    );
};

export default TiptapEditor;
