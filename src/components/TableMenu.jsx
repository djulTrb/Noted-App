import React from "react";
import {
  TbColumnInsertLeft,
  TbColumnInsertRight,
  TbColumnRemove,
  TbTableMinus,
  TbTablePlus,
  TbRowRemove,
  TbRowInsertBottom,
  TbRowInsertTop,
} from "react-icons/tb";
import { PiStopDuotone } from "react-icons/pi";
import { CgMergeVertical } from "react-icons/cg";

import { motion } from "motion/react";

const TableMenu = ({ editor }) => {
  return (
    <motion.ul
      initial={{ opacity: 0, scale: 0.9, y: 0 }}
      animate={{ opacity: 0.6, scale: 0.9, y: 0 }}
      whileHover={{ opacity: 1, scale: 0.95, y: -20 }}
      transition={{ type: "spring", duration: 0.6 }}
      className={`p-4 overflow-y-auto rounded-xl z-50 flex flex-col gap-6 w-fit scroll_none fixed right-10 top-10 -translate-y-1/2 bg-stone-300 border border-stone-400 shadow-inner`}
    >
      <li className="w-full relative flex items-center justify-center">
        <button
          aria-label="add table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <TbTablePlus className="text-2xl" aria-hidden="true" />
        </button>
      </li>

      <li className="w-full relative flex items-center justify-center">
        <button
          aria-label="delete table"
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          <TbTableMinus className="text-2xl" aria-hidden="true" />
        </button>
      </li>

      <li className="w-full relative flex items-center justify-center">
        <button
          aria-label="insert row up"
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          <TbRowInsertTop className="text-2xl" aria-hidden="true" />
        </button>
      </li>
      <li className="w-full relative flex items-center justify-center">
        <button
          aria-label="insert row bottom"
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <TbRowInsertBottom className="text-2xl" aria-hidden="true" />
        </button>
      </li>

      <li>
        <button
          aria-label="delete row"
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          <TbRowRemove className="text-2xl" aria-hidden="true" />
        </button>
      </li>
      <li>
        <button
          aria-label="insert column right"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <TbColumnInsertRight className="text-2xl" aria-hidden="true" />
        </button>
      </li>
      <li>
        <button
          aria-label="insert column left"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        >
          <TbColumnInsertLeft className="text-2xl" aria-hidden="true" />
        </button>
      </li>

      <li className="w-full relative flex items-center justify-center">
        <button
          aria-label="delete column"
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          <TbColumnRemove className="text-2xl" aria-hidden="true" />
        </button>
      </li>

      <li className="w-full relative flex items-center justify-center">
        <button
          aria-label="merge cells"
          onClick={() => editor.chain().focus().mergeOrSplit().run()}
        >
          <CgMergeVertical className="text-2xl" aria-hidden="true" />
        </button>
      </li>

      <li className="w-full relative flex items-center justify-center">
        <button
          aria-label="toggle header cell"
          onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        >
          <PiStopDuotone className="text-2xl" aria-hidden="true" />
        </button>
      </li>
    </motion.ul>
  );
};

export default TableMenu;
