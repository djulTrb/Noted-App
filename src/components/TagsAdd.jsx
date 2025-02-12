import React, { useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { FaHashtag } from "react-icons/fa";

import { IoIosAdd } from "react-icons/io";
import { IoMdSave } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { supabase } from "../services/supabaseClient";
import useSupabaseSession from "../hooks/useSupabaseSession";

import { v4 as uuidv4 } from "uuid";

import { setNewNote } from "../services/store/note";

import CryptoJS from "crypto-js";

import { updateNote } from "../services/store/note";

import { incrementNotesNumber, addNewDate } from "../services/store/stats";

const TagsAdd = ({
  handleAddingNewTags,
  Tags,
  content,
  title,
  setError,
  setNewError,
  ImageOpen,
  update,
}) => {
  const { themeColor } = useSelector((state) => state.parameters);
  const { nbrNotes, datesTable } = useSelector((state) => state.stats);
  const { token } = useSelector((state) => state.auth);

  const [ValueInput, setValueInput] = useState({ val: "", id: "" });
  const { data } = useSupabaseSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const cln = classNames({
    "bg-orange-200 text-orange-600": themeColor === "orange",
    "bg-violet-200 text-violet-600": themeColor === "violet",
    "bg-lime-200 text-lime-600": themeColor === "lime",
    "bg-sky-200 text-sky-600": themeColor === "sky",
    "bg-rose-200 text-rose-600": themeColor === "rose",
  });

  const cln_save = classNames({
    "text-orange-600": themeColor === "orange",
    "text-violet-600": themeColor === "violet",
    "text-lime-600": themeColor === "lime",
    "text-sky-600": themeColor === "sky",
    "text-rose-600": themeColor === "rose",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const convertToTimezone = (given_time = new Date()) => {
    const dateObj = new Date(given_time);

    let year = dateObj.getFullYear();
    let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    let day = ("0" + dateObj.getDate()).slice(-2);
    let hours = ("0" + dateObj.getHours()).slice(-2);
    let minutes = ("0" + dateObj.getMinutes()).slice(-2);
    let seconds = ("0" + dateObj.getSeconds()).slice(-2);

    const time = `${hours}:${minutes}:${seconds}`;
    const date = `${year}-${month}-${day}`;
    return { time: time, date: date };
  };

  const handleUpdateNote = async () => {
    const date = new Date();
    const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;

    if (isProcessing) return;
    const date_local = convertToTimezone(date).date;
    const time_local = convertToTimezone(date).time;

    setIsProcessing(true);
    if (title) {
      const { data, error: updateError } = await supabase
        .from("notes")
        .update([
          {
            updated_last_on: `${date_local} ${time_local}`,
            title: CryptoJS.AES.encrypt(title, secretKey).toString() || "",
            tags:
              Tags.length > 0 ? Tags.map((tag) => JSON.stringify(tag)) : Tags,
            text_value:
              CryptoJS.AES.encrypt(content, secretKey).toString() || "",
          },
        ])
        .eq("id_note", update.id)
        .select();

      const { data: userData, error: userError } =
        await supabase.auth.getSession();

      if (userError) {
        return;
      }

      const { error: statsError } = await supabase
        .from("statistics related")
        .update({
          activity_dates: [...datesTable, date_local],
        })
        .eq("id_user", userData?.session?.user?.id);

      if (!updateError && !statsError) {
        dispatch(
          updateNote({
            id: update.id,
            updated_last_on: {
              date: date_local,
              time: time_local,
            },
            title: title,
            tags: Tags,
            text_value: content,
          })
        );

        dispatch(addNewDate(date_local));

        if (!token) {
          navigate("/notes");
        } else {
          navigate("/");
        }
      } else {
        setTimeout(() => {
          setNewError(false);
        }, 3000);
        setNewError(true);
      }
    } else {
      setTimeout(() => {
        setError(false);
      }, 3000);
      setError(true);
    }
    setIsProcessing(false);
  };

  const handleSaveNote = async () => {
    const token = data?.access_token;
    const ID = uuidv4();
    const date = new Date();
    const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;
    const rand = Math.floor(Math.random() * 11) + 1;

    if (isProcessing) return;
    const date_local = convertToTimezone(date).date;
    const time_local = convertToTimezone(date).time;

    setIsProcessing(true);
    if (token) {
      if (title) {
        const { error: insertError } = await supabase.from("notes").insert([
          {
            id_user: data?.user?.id,
            id_note: ID,
            gradient_id: rand,
            created_on: `${date_local} ${time_local}`,
            updated_last_on: null,
            title: CryptoJS.AES.encrypt(title, secretKey).toString() || "",
            tags:
              Tags.length > 0 ? Tags.map((tag) => JSON.stringify(tag)) : Tags,
            text_value:
              CryptoJS.AES.encrypt(content, secretKey).toString() || "",
          },
        ]);

        const { error: statsError } = await supabase
          .from("statistics related")
          .update({
            activity_dates: [...datesTable, date_local],
            nbr_notes: nbrNotes + 1,
          })
          .eq("id_user", data?.user?.id);

        if (!insertError && !statsError) {
          dispatch(
            setNewNote({
              gradient_id: rand,
              id: ID,
              created_on: {
                date: date_local || "",
                time: time_local || "",
              },
              title: title,
              tags: Tags,
              text_value: content,
            })
          );

          dispatch(addNewDate(date_local));
          dispatch(incrementNotesNumber());

          if (!token) {
            navigate("/notes");
          } else {
            navigate("/");
          }
        } else {
          setTimeout(() => {
            setNewError(false);
          }, 3000);
          setNewError(true);
        }
      } else {
        setTimeout(() => {
          setError(false);
        }, 3000);
        setError(true);
      }
    } else {
      if (title) {
        dispatch(
          setNewNote({
            id: ID,
            gradient_id: rand,
            created_on: {
              date: date_local || "",
              time: time_local || "",
            },
            title: title,
            tags: Tags,
            text_value: content,
          })
        );
        if (!token) {
          navigate("/notes");
        } else {
          navigate("/");
        }
      } else {
        setTimeout(() => {
          setError(false);
        }, 3000);
        setError(true);
      }
    }
    setIsProcessing(false);
  };

  return (
    <header
      className={`h-14 w-full bg-stone-200  items-center justify-between gap-2 xs:px-6 px-2  border-b sticky top-0 z-50 border-stone-400 ${
        ImageOpen ? "hidden" : "flex"
      }`}
    >
      <div className="flex items-center border rounded-full  border-stone-400 bg-stone-100 relative">
        <div className={` ${cln} rounded-full py-1.5 px-3 opacity-80 m-1`}>
          <FaHashtag className={`text-lg`} />
        </div>
        <input
          type="text"
          className="w-full bg-inherit focus:outline-none pr-3 text-stone-800 font-sourceSans_reg"
          placeholder="eg. Work"
          id="tag"
          value={ValueInput.val}
          onChange={(e) => {
            setValueInput({
              val: e.target.value,
              id: Tags.length === 0 ? 1 : Tags.length + 1,
            });
          }}
        />
        <button
          aria-label="add tag"
          className={` text-stone-500  pr-3 rounded-full `}
        >
          <IoIosAdd
            className={`text-2xl`}
            onClick={() => {
              if (ValueInput.val !== "") {
                handleAddingNewTags(ValueInput);
                setValueInput({ val: "", id: 0 });
              }
            }}
          />
        </button>
      </div>
      <div className="flex items-center xs:gap-4 xxs:gap-2 xxxs:gap-1  xs:bg-stone-400 xs:bg-opacity-20 xs:border border-stone-400 border-opacity-30 xs:px-4 xxs:px-2 xxxs:px-1 xs:rounded-full xs:py-2">
        <button
          aria-label="cancel note add"
          onClick={() => {
            if (!token) {
              navigate("/notes");
            } else {
              navigate("/");
            }
          }}
        >
          <MdDeleteOutline className="text-[1.4rem] text-stone-600" />
        </button>
        <button
          aria-label="save note"
          disabled={isProcessing}
          onClick={() => {
            if (update) {
              handleUpdateNote();
            } else {
              handleSaveNote();
            }
          }}
        >
          <IoMdSave className={`text-2xl ${cln_save}`} />
        </button>
      </div>
    </header>
  );
};

export default TagsAdd;
