import React, { useRef, useEffect, useState, useCallback } from "react";
import classNames from "classnames";

import Toolbar from "../components/Toolbar";
import TextInput from "../components/TextInput";
import TitleInput from "../components/TitleInput";
import InsertURLModal from "../components/InsertURLModal";

import { useEditor } from "@tiptap/react";
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

import "../Styles/styles.scss";
import TagsAdd from "../components/TagsAdd";

import { useSelector } from "react-redux";

import TableMenu from "../components/TableMenu";
import { motion } from "motion/react";
import { FaCircleInfo } from "react-icons/fa6";

const NewNoteScreen = ({ updateContent }) => {
  const { themeColor } = useSelector((state) => state.parameters);
  const refTitle = useRef(null);
  const [ImageOpen, setImageOpen] = useState(false);
  const [type, setType] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorNew, setErrorNew] = useState(false);

  const [markerOpen, setMarkerOpen] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const [Tags, setTags] = useState(updateContent?.tags || []);
  const [title, setTitle] = useState(updateContent?.title || "");

  const [content, setContent] = useState("");

  useEffect(() => {
    refTitle.current.focus();
  }, []);

  useEffect(() => {
    if (ImageOpen) {
      document.querySelector("#root section").scrollTo(0, 0);
    }
  }, [ImageOpen]);

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

    content: updateContent?.text_value || "",
    onUpdate: useCallback(({ editor }) => {
      setContent(editor.getHTML());
    }, []),
    parseOptions: {
      preserveWhitespace: true,
    },
  });

  if (!editor) {
    return null;
  }

  const handleCloseModal = () => {
    setImageOpen(false);
  };
  const handleOpenModal = () => {
    setImageOpen(true);
  };
  const handleMarkerOpen = () => {
    setMarkerOpen(!markerOpen);
  };

  const handleToggleTableMenu = () => {
    setTableMenuOpen(!tableMenuOpen);
  };

  const handleAddingNewTags = (new_tag) => {
    setTags([...Tags, new_tag]);
  };

  const cln = classNames({
    "bg-orange-300 text-orange-700 ": themeColor === "orange",
    "bg-violet-300 text-violet-700 ": themeColor === "violet",
    "bg-lime-300 text-lime-700 ": themeColor === "lime",
    "bg-sky-300 text-sky-700 ": themeColor === "sky",
    "bg-rose-300 text-rose-700 ": themeColor === "rose",
  });

  return (
    <section className="bg-stone-300 relative h-screen w-screen overflow-y-auto sect">
      <TagsAdd
        handleAddingNewTags={handleAddingNewTags}
        Tags={Tags}
        content={content}
        title={title}
        setError={setErrorTitle}
        setNewError={setErrorNew}
        ImageOpen={ImageOpen}
        update={updateContent}
      />
      <div className="h-full w-full relative flex">
        <Toolbar
          editor={editor}
          openModal={handleOpenModal}
          setType={setType}
          openMarker={handleMarkerOpen}
          isMarkerOpen={markerOpen}
          toggleTableMenu={handleToggleTableMenu}
        />
        <div className="flex flex-col w-full h-fit min-h-full border-l border-stone-400 bg-stone-100 relative">
          <label
            htmlFor="title"
            className={`${cln} cursor-pointer absolute md:top-5 sm:max-md:top-[1.3rem] xxxs:top-4 xxs:top-[1.15rem] md:left-3 xxxs:left-2 rounded-full text-xs font-sourceSans_bl opacity-80  tracking-normal  px-2.5 py-0.5`}
          >
            Title
          </label>
          <TitleInput refTitle={refTitle} setTitle={setTitle} title={title} />

          <TextInput editor={editor} Tags={Tags} setTags={setTags} />
        </div>
        {ImageOpen && (
          <InsertURLModal
            handleCloseModal={handleCloseModal}
            modalType={type || "image"}
            editor={editor}
          />
        )}
      </div>
      <div className="flex gap-2.5 text-[0.7rem] text-stone-500 font-monofont fixed bottom-5 right-8 uppercase">
        <span>{editor.storage.characterCount.characters()} characters</span>
        <span>{editor.storage.characterCount.words()} words</span>
      </div>
      {tableMenuOpen && <TableMenu editor={editor} />}
      {errorTitle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          exit={{ opacity: 0 }}
          className="bg-stone-300 dark:bg-stone-800 rounded-lg w-fit absolute top-12 z-[1000] backdrop-blur -translate-x-1/2 left-1/2 flex items-center gap-2 px-3 py-[0.8rem] border capitalize border-stone-400 border-opacity-40"
        >
          <FaCircleInfo className="text-red-600" />
          <p className="text-sm dark:text-stone-200 text-stone-700 font-sourceSans_bold w-max">
            title is not set
          </p>
        </motion.div>
      )}
      {errorNew && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          exit={{ opacity: 0 }}
          className="bg-stone-300 dark:bg-stone-800 rounded-lg w-fit absolute top-12 z-[1000] backdrop-blur -translate-x-1/2 left-1/2 flex items-center gap-2 px-3 py-[0.8rem] border capitalize border-stone-400 border-opacity-40"
        >
          <FaCircleInfo className="text-red-600" />
          <p className="text-sm dark:text-stone-200 text-stone-700 font-sourceSans_bold w-max">
            error while adding Note, Please retry
          </p>
        </motion.div>
      )}
    </section>
  );
};

export default NewNoteScreen;
