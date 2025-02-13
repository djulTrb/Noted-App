import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import NewNoteScreen from "../pages/NewNoteScreen";
import { supabase } from "../services/supabaseClient";

import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";

const NoteUpdate = () => {
  const { idNote } = useParams();
  const [noteData, setNoteData] = useState({});
  const { token } = useSelector((state) => state.auth);
  const notes = useSelector((state) => state.note);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("notes")
        .select()
        .eq("id_note", idNote);

      if (token) {
        if (!error) {
          const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;
          setNoteData({
            id: data[0]?.id_note,
            title: CryptoJS.AES.decrypt(
              data?.[0]?.title || "title",
              secretKey
            ).toString(CryptoJS.enc.Utf8),
            tags:
              data?.[0]?.tags !== null && data?.[0]?.tags
                ? data?.[0]?.tags.map((tag) => JSON.parse(tag))
                : [],
            text_value: CryptoJS.AES.decrypt(
              data?.[0]?.text_value || "content",
              secretKey
            ).toString(CryptoJS.enc.Utf8),
          });
        }
      } else {
        const selectedNote = notes.filter((el) => el.id === idNote)[0];
        setNoteData({
          id: selectedNote.id,
          title: selectedNote.title,
          tags: selectedNote.tags,
          text_value: selectedNote.text_value,
        });
      }
    })();
  }, []);

  return Object.keys(noteData).length > 0 ? (
    <NewNoteScreen updateContent={noteData} />
  ) : (
    <div className="h-screen dark:bg-stone-700 bg-stone-300 w-screen flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
};

export default NoteUpdate;
