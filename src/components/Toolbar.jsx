import React from "react";
import classNames from "classnames";

import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaCode,
  FaLink,
  FaTasks,
} from "react-icons/fa";
import { RiImageCircleFill } from "react-icons/ri";
import { FaQuoteRight, FaTableList } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import { PiHighlighterCircleBold } from "react-icons/pi";
import { MdHorizontalRule } from "react-icons/md";

import { useSelector } from "react-redux";

const Toolbar = ({
  editor,
  openModal,
  setType,
  openMarker,
  isMarkerOpen,
  toggleTableMenu,
}) => {
  const { themeColor } = useSelector((state) => state.parameters);

  const clnText = classNames({
    "text-orange-700 ": themeColor === "orange",
    "text-violet-700": themeColor === "violet",
    "text-lime-700": themeColor === "lime",
    "text-sky-700": themeColor === "sky",
    "text-rose-700": themeColor === "rose",
  });

  const clnBorder = classNames({
    "border-orange-700 ": themeColor === "orange",
    "border-violet-700": themeColor === "violet",
    "border-lime-700": themeColor === "lime",
    "border-sky-700": themeColor === "sky",
    "border-rose-700": themeColor === "rose",
  });

  return (
    <ul className="p-2 pb-16 flex-col gap-1.5 w-24 min-w-24 scroll_none overflow-y-auto min-h-full hidden xs:flex sticky top-0 bg-stone-200 bg-opacity-40">
      <li className="w-full ">
        <button
          aria-label="insert bold text"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full `
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded "
          }
        >
          <FaBold aria-hidden="true" />
        </button>
      </li>
      <li className="w-full ">
        <button
          aria-label="insert italic text"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full`
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FaItalic aria-hidden="true" />
        </button>
      </li>
      <li className="w-full ">
        <button
          aria-label="insert strikethrough text"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full`
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FaStrikethrough aria-hidden="true" />
        </button>
      </li>
      <li className="w-full ">
        <button
          aria-label="toggle code block"
          onClick={() => editor.chain().focus().setCodeBlock().run()}
          disabled={editor.isActive("codeBlock")}
          className="flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
        >
          <FaCode aria-hidden="true" />
        </button>
      </li>
      <li className="w-full ">
        {" "}
        <button
          aria-label="toggle bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full`
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FaListUl aria-hidden="true" />
        </button>
      </li>
      <li className="w-full ">
        <button
          aria-label="toggle ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full`
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FaListOl aria-hidden="true" />
        </button>
      </li>

      <li className="w-full ">
        <button
          aria-label="toggle task list"
          onClick={() => {
            editor.chain().focus().toggleTaskList().run();
          }}
          className={
            editor.isActive("taskList")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full`
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FaTasks aria-hidden="true" />
        </button>
      </li>

      <li className="w-full ">
        <button
          aria-label="insert horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
        >
          <MdHorizontalRule aria-hidden="true" />
        </button>
      </li>
      <li className="w-full ">
        <button
          aria-label="insert quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full`
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FaQuoteRight aria-hidden="true" />
        </button>
      </li>

      <li className="w-full ">
        <button
          aria-label="insert image"
          onClick={() => {
            setType("image");
            openModal();
          }}
          className={
            "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <RiImageCircleFill aria-hidden="true" />
        </button>
      </li>

      <li className="w-full ">
        <button
          aria-label="insert youtube video"
          onClick={() => {
            setType("video");
            openModal();
          }}
          className={
            "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FiYoutube aria-hidden="true" />
        </button>
      </li>
      <li className="w-full ">
        <button
          aria-label="toggle highlighter"
          onClick={() => {
            openMarker();
            if (isMarkerOpen) {
              editor.commands.unsetHighlight();
            } else {
              editor.chain().focus().toggleHighlight();
            }
          }}
          className={
            editor.isActive("highlight")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full`
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <PiHighlighterCircleBold aria-hidden="true" />
        </button>

        {isMarkerOpen && (
          <ul
            className={`flex items-center flex-col w-full transition-all duration-200`}
          >
            <li>
              <button
                aria-label="toggle yellow highlighter"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#ffc078" })
                    .run()
                }
              >
                <div className="h-2 w-16 rounded-md outline-dashed outline-[#ffc07898] outline- bg-[#ffc078]"></div>
              </button>
            </li>
            <li>
              <button
                aria-label="toggle green highlighter"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#8ce99a" })
                    .run()
                }
              >
                <div className="h-2 w-16 rounded-md outline-dashed outline-[#8ce99a98] outline- bg-[#8ce99a]"></div>
              </button>
            </li>
            <li>
              <button
                aria-label="toggle blue highlighter"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#74c0fc" })
                    .run()
                }
              >
                <div className="h-2 w-16 rounded-md outline-dashed outline-[#74c0fc98] outline- bg-[#74c0fc]"></div>
              </button>
            </li>
            <li>
              <button
                aria-label="toggle purple highlighter"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#b197fc" })
                    .run()
                }
              >
                <div className="h-2 w-16 rounded-md outline-dashed outline-[#b197fc98] outline- bg-[#b197fc]"></div>
              </button>
            </li>
            <li>
              <button
                aria-label="toggle red highlighter"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#ef4444" })
                    .run()
                }
              >
                <div className="h-2 w-16 rounded-md outline-dashed outline-red-400 bg-red-500"></div>
              </button>
            </li>
          </ul>
        )}
      </li>
      <li className="w-full ">
        <button
          aria-label="insert table"
          onClick={() => {
            toggleTableMenu();
          }}
          className={
            "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FaTableList aria-hidden="true" />
        </button>
      </li>
      <li className="w-full ">
        <button
          aria-label="insert link"
          onClick={() => {
            setType("link");
            openModal();
          }}
          className={
            editor.isActive("link")
              ? `flex items-center justify-center py-3 ${clnText} bg-stone-100 rounded text-lg border ${clnBorder} tracking-tighter w-full`
              : "flex items-center justify-center py-3 bg-stone-200 text-stone-800 border border-stone-400 shadow text-lg tracking-tighter w-full rounded"
          }
        >
          <FaLink aria-hidden="true" />
        </button>
      </li>
    </ul>
  );
};

export default Toolbar;
