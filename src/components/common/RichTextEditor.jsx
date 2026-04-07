import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  FiBold, 
  FiItalic, 
  FiUnderline,
  FiList,
  FiLink2,
  FiMinus,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
} from "react-icons/fi";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["paragraph"],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange({ target: { value: editor.getHTML() } });
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({ icon: Icon, onClick, active, title, size = 18 }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors duration-150 flex items-center justify-center
        ${
          active
            ? "text-blue-600 bg-blue-50"
            : "text-slate-500 hover:text-slate-700"
        }`}
    >
      <Icon size={size} strokeWidth={1.5} />
    </button>
  );

  const toggleLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const charCount = editor?.getText()?.length || 0;

  return (
    <div className="flex flex-col gap-0 w-full overflow-y-scroll">
      {/* Toolbar */}
      <div className="flex items-center gap-0 p-[12px] bg-white border border-b-0 border-slate-200 rounded-t-[10px] overflow-y-scroll">
        <ToolbarButton
          icon={FiBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        />
        <ToolbarButton
          icon={FiItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        />
        <ToolbarButton
          icon={FiUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        />

        <div className="w-px h-6 bg-slate-200 mx-2" />

        <ToolbarButton
          icon={FiAlignLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        />
        <ToolbarButton
          icon={FiAlignCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        />
        <ToolbarButton
          icon={FiAlignRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        />

        <div className="w-px h-6 bg-slate-200 mx-2" />

        <ToolbarButton
          icon={FiList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        />

        <div className="w-px h-6 bg-slate-200 mx-2" />

        <ToolbarButton
          icon={FiLink2}
          onClick={toggleLink}
          active={editor.isActive("link")}
          title="Add Link"
        />
        <ToolbarButton
          icon={FiMinus}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Add Divider"
        />
      </div>

      {/* Editor Container */}
      <div
        className="w-full border-2 border-slate-200 rounded-b-[10px] transition-all duration-150 focus-within:border-blue-500 focus-within:shadow-sm
          bg-white overflow-hidden relative"
      >
        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none outline-none
            px-[16px] py-[14px] min-h-[240px] text-[14px] leading-[1.6] text-slate-900
            [&_p]:m-0 [&_p]:mb-[0.25em]
            [&_p:last-child]:mb-0
            [&_ul]:my-[0.5em] [&_ul]:ml-[1.5em] [&_ul]:list-disc
            [&_ol]:my-[0.5em] [&_ol]:ml-[1.5em] [&_ol]:list-decimal
            [&_li]:my-[0.1em]
            [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer hover:[&_a]:text-blue-700
            [&_hr]:border-slate-200 [&_hr]:my-[1em]
            [&_strong]:font-semibold
            [&_em]:italic
            [&_u]:underline
          "
        />

        {/* Empty State Placeholder */}
        {(!value || value === "<p></p>") && (
          <div className="absolute top-[14px] left-[16px] text-slate-400 text-[14px] pointer-events-none">
            Write your email here…
          </div>
        )}
      </div>

      {/* Character Count */}
      <div className="text-right text-[12px] text-slate-400 mt-[8px] px-[4px]">
        {charCount > 0 ? `${charCount} characters` : ""}
      </div>
    </div>
  );
};

export default RichTextEditor;