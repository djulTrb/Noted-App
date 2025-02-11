import react, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import "./App.scss";

import { useDeepCompareEffect } from "use-deep-compare";

import { motion, AnimatePresence } from "motion/react";

import { useSelector, useDispatch } from "react-redux";

import useSupabaseSession from "./hooks/useSupabaseSession.js";

import { useNavigate } from "react-router";

import Header from "./components/Header";
import Aside from "./components/Aside";
import ModifyAccountInfoModal from "./components/ModifyAccountInfoModal";
import Drawer from "./components/Drawer";

import { supabase } from "./services/supabaseClient.js";
import { useQuery } from "@tanstack/react-query";
import { setCredentials, setImage } from "./services/store/Auth.js";
import { setNewNote } from "./services/store/note.js";
import { setTagsList } from "./services/store/NotesSectionActions.js";
import {
  setCreationDate,
  setNotesNumber,
  setDatesTable,
  setAreaChartData,
  setHeatChartData,
} from "./services/store/stats.js";

import ErrorToast from "./components/ErrorToast.jsx";

import CryptoJS from "crypto-js";
import NoteContent from "./components/NoteContent.jsx";

import { v4 as uuidv4 } from "uuid";

function App() {
  const [openModificationWindow, setOpenModificationWindow] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [RetError, setRetError] = useState(false);
  const [NoteModalIsOpen, setNoteModalIsOpen] = useState({});

  const { isDarkMode } = useSelector((state) => state.darkMode);
  const { themeColor } = useSelector((state) => state.parameters);
  const { token } = useSelector((state) => state.auth);
  const notes = useSelector((state) => state.note);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: sessionData,
    isLoading,
    error,
    isSuccess: successSession,
  } = useSupabaseSession();

  const fetchUserData = useQuery({
    queryKey: ["supabase-fetch-data"],
    queryFn: async () => {
      const ID = sessionData.user.id;
      const { data: refreshedSession, error: refreshError } =
        await supabase.auth.refreshSession();

      const { data: UserData, error } = await supabase
        .from("User Informations")
        .select("*")
        .eq("id", ID);

      const { data: UserNotes, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("id_user", ID);

      const { data: UserStats, error: statsError } = await supabase
        .from("statistics related")
        .select("*")
        .eq("id_user", ID)
        .single();

      if (error || refreshError || notesError || statsError) {
        setTimeout(() => {
          setRetError(false);
        }, 4000);
        setRetError(true);
      }
      return { UserNotes, UserData, UserStats };
    },
  });

  useEffect(() => {
    if (!token && successSession && fetchUserData.isSuccess) {
      const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;
      const day = String(new Date().getDate()).padStart(2, "0");
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      const year = new Date().getFullYear();

      dispatch(
        setCredentials({
          user: {
            email: sessionData?.user?.user_metadata?.email,
            username: fetchUserData?.data?.UserData?.[0]?.username,
          },
          token: sessionData?.access_token,
        })
      );

      dispatch(setImage(fetchUserData?.data?.UserData?.[0]?.image || null));

      dispatch(
        setCreationDate(
          fetchUserData?.data?.UserData?.[0]?.creation_date ||
            `${year}-${month}-${day}`
        )
      );

      dispatch(setDatesTable(fetchUserData?.data?.UserStats?.activity_dates));

      if (Object.keys(fetchUserData?.data?.UserStats || {}).length > 0) {
        if (fetchUserData?.data?.UserStats?.activity_dates.length > 0) {
          dispatch(
            setAreaChartData(
              fetchUserData?.data?.UserStats?.activity_dates || []
            )
          );
          dispatch(
            setHeatChartData(
              fetchUserData?.data?.UserStats?.activity_dates || []
            )
          );
        }

        dispatch(setNotesNumber(fetchUserData?.data?.UserStats?.nbr_notes));
      }

      if (fetchUserData?.data?.UserNotes[0]) {
        fetchUserData?.data?.UserNotes.forEach((note) => {
          dispatch(
            setNewNote({
              id: note?.id_note,
              gradient_id: note?.gradient_id,
              created_on: {
                date: note?.created_on.match(/^(\d{4}-\d{2}-\d{2})/)
                  ? note?.created_on.match(/^(\d{4}-\d{2}-\d{2})/)[1]
                  : "",
                time: note?.created_on.match(/T(\d{2}:\d{2}:\d{2})/)
                  ? note?.created_on.match(/T(\d{2}:\d{2}:\d{2})/)[1]
                  : "",
              },
              updated_last_on: note?.updated_last_on
                ? {
                    date: note?.updated_last_on.match(/^(\d{4}-\d{2}-\d{2})/)
                      ? note?.updated_last_on.match(/^(\d{4}-\d{2}-\d{2})/)[1]
                      : "",
                    time: note?.updated_last_on.match(/T(\d{2}:\d{2}:\d{2})/)
                      ? note?.updated_last_on.match(/T(\d{2}:\d{2}:\d{2})/)[1]
                      : "",
                  }
                : null,
              title: CryptoJS.AES.decrypt(note?.title, secretKey).toString(
                CryptoJS.enc.Utf8
              ),
              tags:
                note?.tags !== null && note?.tags
                  ? note?.tags.map((tag) => JSON.parse(tag))
                  : [],
              text_value: CryptoJS.AES.decrypt(
                note?.text_value,
                secretKey
              ).toString(CryptoJS.enc.Utf8),
            })
          );

          if (note?.tags.length > 0 && note?.tags !== null) {
            note?.tags
              .map((tag) => JSON.parse(tag))
              .forEach((tag) => {
                dispatch(setTagsList({ val: tag.val, id: uuidv4() }));
              });
          }
        });
      }
    }

    if (error) {
      navigate("error404");
    }
  }, [fetchUserData.isSuccess, successSession, notes]);

  useEffect(() => {
    if (localStorage.getItem("themeColor") === null) {
      localStorage.setItem("themeColor", themeColor);
    }
    setNoteModalIsOpen(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useDeepCompareEffect(() => {
    if (Object.keys(NoteModalIsOpen).length > 0) {
      document.body.classList.add("modal_isOpen");
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove("modal_isOpen");
    }
  }, [NoteModalIsOpen]);

  const handleToggleModifyAccountInfoModal = () => {
    setOpenModificationWindow(!openModificationWindow);
  };

  const handleCloseModifyModal = () => {
    setOpenModificationWindow(false);
  };

  useEffect(() => {
    if (openModificationWindow) {
      document.body.classList.add("modal_isOpen");
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove("modal_isOpen");
    }
  }, [openModificationWindow]);

  return fetchUserData.isLoading || isLoading ? (
    <div className="h-screen dark:bg-stone-700 bg-stone-300 w-screen flex items-center justify-center">
      <div className="loader"></div>
    </div>
  ) : (
    <motion.section
      initial={{ opacity: 0.7 }}
      transition={{ duration: 0.4 }}
      animate={{ opacity: 1 }}
      className="w-full h-screen grid md:grid-cols-[auto_1fr] xxxs:grid-cols-1 grid-rows-[auto_1fr] relative sect"
    >
      <Header setIsDrawerOpen={setIsDrawerOpen} isDrawerOpen={isDrawerOpen} />
      <AnimatePresence>
        {isDrawerOpen && <Drawer setIsDrawerOpen={setIsDrawerOpen} />}
      </AnimatePresence>
      <Aside />{" "}
      <main className="md:col-start-2 xxxs:col-start-1 xxxs:max-md:col-span-2 row-start-2 dark:bg-stone-800 bg-stone-200 relative">
        <Outlet
          context={{
            handleToggleModifyAccountInfoModal,
            handleCloseModifyModal,
            setNoteModalIsOpen,
          }}
        />
      </main>
      <ModifyAccountInfoModal
        openModificationWindow={openModificationWindow}
        handleToggleModifyAccountInfoModal={handleToggleModifyAccountInfoModal}
        handleCloseModifyModal={handleCloseModifyModal}
      />
      {RetError && (
        <ErrorToast
          errorText={
            "An Error Occured While Retrieving User's Data, Please Refresh The Page"
          }
        />
      )}
      {Object.keys(NoteModalIsOpen).length > 0 && (
        <NoteContent
          setNoteContentOff={setNoteModalIsOpen}
          Ncontent={NoteModalIsOpen}
        />
      )}
    </motion.section>
  );
}

export default App;
