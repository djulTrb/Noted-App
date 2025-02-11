import React from "react";
import { useSelector } from "react-redux";

import { PiWarningBold } from "react-icons/pi";

const SignupWarning = () => {
  const { token } = useSelector((state) => state.auth);
  return (
    !token && (
      <div className="w-full py-1.5 px-3 flex justify-center border-b border-stone-500 dark:border-stone-600 bg-stone-50 dark:bg-stone-700">
        <p className="flex gap-1.5 xxxs:max-md:gap-3 items-center text-stone-500 dark:text-stone-300 text-sm">
          <PiWarningBold
            className="text-red-600 sm:text-lg xs:text-2xl xxxs:text-4xl"
            aria-hidden="true"
          />
          Please note that any actions or data entered into our system will not
          be saved unless you are signed up
        </p>
      </div>
    )
  );
};

export default SignupWarning;
