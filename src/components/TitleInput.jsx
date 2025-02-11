import React from "react";

const TitleInput = ({ refTitle, setTitle, title }) => {
  return (
    <input
      aria-label="Title"
      type="text"
      id="title"
      value={title}
      ref={refTitle}
      placeholder="Today's Thoughts"
      className="bg-inherit sm:text-4xl xxs:text-3xl xxxs:text-2xl bg-stone-200 bg-opacity-35 text-stone-800 placeholder:text-stone-800 placeholder:opacity-35 font-sourceSans_bold p-2.5 pr-4 md:pl-[4.2rem] xxxs:pl-16 w-full  focus:outline-none caret-stone-700 h-fit "
      onChange={(e) => {
        setTitle(e.target.value);
      }}
    />
  );
};

export default TitleInput;
