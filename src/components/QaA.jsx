import React from "react";

const QaA = ({ question, answer }) => {
  return (
    <li>
      <h3 className="font-sourceSans_bl text-xl dark:text-stone-200 text-stone-700">
        {question}
      </h3>
      <p className="font-sourceSans_reg pl-2 pt-1 dark:text-stone-400 text-stone-700 text-[.9rem] leading-[1.35rem]">
        {answer}
      </p>
    </li>
  );
};

export default QaA;
