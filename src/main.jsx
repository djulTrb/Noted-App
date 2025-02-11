import "../init.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.scss";

import SettingsScreen from "./pages/SettingsScreen.jsx";
import Statistics from "./pages/Statistics.jsx";
import Notes from "./pages/Notes.jsx";
import FAQ from "./pages/FAQ.jsx";
import ErrorScreen from "./pages/ErrorScreen.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import LogInScreen from "./pages/LogInScreen.jsx";
import SignUpScreen from "./pages/SignUpScreen.jsx";
import ChangePasswordModal from "./components/ChangePasswordModal.jsx";
import NewNoteScreen from "./pages/NewNoteScreen.jsx";
import NoteUpdate from "./components/NoteUpdate.jsx";

import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import darkMode from "./services/store/darkMode.js";
import parameters from "./services/store/parameters.js";
import authReducer from "./services/store/Auth.js";
import noteReducer from "./services/store/note.js";
import NotesReducer from "./services/store/NotesSectionActions.js";
import statsReducer from "./services/store/stats.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const store = configureStore({
  reducer: {
    darkMode: darkMode,
    parameters: parameters,
    auth: authReducer,
    note: noteReducer,
    notesSectionActions: NotesReducer,
    stats: statsReducer,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchInterval: null, refetchOnWindowFocus: false },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorScreen />,
    children: [
      { path: "", element: <HomeScreen /> },
      {
        path: "settings",
        element: <SettingsScreen />,
      },
      { path: "statistics", element: <Statistics /> },
      {
        path: "notes",
        element: <Notes />,
      },
      { path: "faq", element: <FAQ /> },
    ],
  },
  { path: "login", element: <LogInScreen /> },
  { path: "signup", element: <SignUpScreen /> },
  { path: "changePassword", element: <ChangePasswordModal /> },
  { path: "addNewNote", element: <NewNoteScreen /> },
  { path: "edit/:idNote", element: <NoteUpdate /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
