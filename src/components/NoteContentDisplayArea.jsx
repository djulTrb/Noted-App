import React from "react";
import "../Styles/styles.scss";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Placeholder from "@tiptap/extension-placeholder";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import { all, createLowlight } from "lowlight";

import Highlight from "@tiptap/extension-highlight";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";

import { useEditor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

const NoteContentDisplayArea = ({ content }) => {
  const lowlight = createLowlight(all);

  lowlight.register("html", html);
  lowlight.register("css", css);
  lowlight.register("js", js);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount.configure({
        limit: null,
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Highlight.configure({ multicolor: true }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
      }),
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
    ],
    content: content,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      className="tiptap h-fit p-0 pb-10 cursor-default"
    />
  );
};

export default NoteContentDisplayArea;
