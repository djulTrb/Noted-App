import React from "react";

import { PiWarningBold } from "react-icons/pi";

const NotLoggedInStats = () => {
  return (
    <div className="flex items-center justify-center w-full h-[50vh]">
      <div className="flex flex-col gap-1 items-center w-fit cursor-default">
        <div className="flex items-center gap-1.5 pb-2 ">
          <PiWarningBold className="text-red-600 " aria-hidden="true" />
          <h2 className="text-2xl font-sourceSans_bl text-stone-600 dark:text-stone-200 text-center">
            You're Not Logged In Yet ?
          </h2>
        </div>
        <p className="text-center font-sourceSans_reg leading-5 text-stone-500 dark:text-stone-400 pl-3 md_to_lg:w-2/3 w-11/12">
          Whoops! It appears that you haven't logged in yet. To enjoy the full
          range of features that our app offers, please make sure to log in
          first. Logging in will allow you to access your personalized content,
          save your progress, and ensure a seamless experience.
        </p>
      </div>
    </div>
  );
};

export default NotLoggedInStats;
