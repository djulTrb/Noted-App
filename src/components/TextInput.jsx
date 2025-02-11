import React from "react";
import { EditorContent, BubbleMenu } from "@tiptap/react";
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaHashtag,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import classNames from "classnames";

const TextInput = ({ editor, Tags, setTags }) => {
  const { themeColor } = useSelector((state) => state.parameters);

  const clnText = classNames({
    "text-orange-700 ": themeColor === "orange",
    "text-violet-700": themeColor === "violet",
    "text-lime-700": themeColor === "lime",
    "text-sky-700": themeColor === "sky",
    "text-rose-700": themeColor === "rose",
  });

  const clnTag = classNames({
    "text-orange-600 bg-stone-100 bg-opacity-50  ": themeColor === "orange",
    "text-violet-600  bg-stone-100 bg-opacity-50  ": themeColor === "violet",
    "text-lime-600  bg-stone-100 bg-opacity-50  ": themeColor === "lime",
    "text-sky-600  bg-stone-100 bg-opacity-50  ": themeColor === "sky",
    "text-rose-600  bg-stone-100 bg-opacity-50  ": themeColor === "rose",
  });

  const handleRemoveATag = (id) => {
    setTags(Tags.filter((tag) => tag.id !== id));
  };

  return (
    <>
      <div className="w-full bg-stone-200 bg-opacity-80 border-t border-stone-700 ">
        {!Tags.length ? (
          <p className="text-xs font-sourceSans_bold text-stone-400 opacity-55 p-3 px-[1.3rem] capitalize">
            No tags Added...
          </p>
        ) : (
          <ul className="relative overflow-x-scroll scroll_none flex items-center gap-2 px-5 pt-4 pb-3 xs:w-[calc(100vw-7rem)] xxxs:max-sx:w-[100vw]">
            {Tags &&
              Tags.map((tag, key) => {
                return (
                  <li
                    className={`${clnTag} py-1 px-2.5 cursor-pointer rounded-full capitalize text-nowrap font-lora_bold text-xs flex items-center border border-stone-400 border-opacity-50`}
                    key={key}
                    onClick={() => {
                      handleRemoveATag(tag.id);
                    }}
                  >
                    <FaHashtag className="text-xs" /> {tag.val}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center gap-4 bg-stone-200 border border-stone-500 rounded p-2.5 ">
            <button
              aria-label="bold text"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={
                editor.isActive("bold") ? `${clnText}` : "text-stone-700"
              }
            >
              <FaBold />
            </button>
            <button
              aria-label="italic text"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={
                editor.isActive("italic") ? `${clnText}` : "text-stone-700"
              }
            >
              <FaItalic />
            </button>
            <button
              aria-label="strikethrough text"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={
                editor.isActive("strike") ? `${clnText}` : "text-stone-700"
              }
            >
              <FaStrikethrough />
            </button>

            <button
              aria-label="align text left"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" })
                  ? `${clnText}`
                  : "text-stone-700"
              }
            >
              <FaAlignLeft />
            </button>
            <button
              aria-label="align text center"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" })
                  ? `${clnText}`
                  : "text-stone-700"
              }
            >
              <FaAlignCenter />
            </button>
            <button
              aria-label="align text right"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" })
                  ? `${clnText}`
                  : "text-stone-700"
              }
            >
              <FaAlignRight />
            </button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        spellCheck={false}
        className="tiptap  min-h-[75vh] h-fit pb-10 bg-stone-100"
      />
    </>
  );
};

export default TextInput;
