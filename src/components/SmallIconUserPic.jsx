import React from "react";
import { useSelector } from "react-redux";

import Avatar from "boring-avatars";
import { FaChevronDown } from "react-icons/fa6";

const SmallIconUserPic = ({ setMenuOpen, menuOpen }) => {
  const { image, user } = useSelector((state) => state.auth);
  return (
    <div
      className="flex gap-1 items-center cursor-pointer p-0.5 px-3"
      onClick={() => {
        setMenuOpen(!menuOpen);
      }}
    >
      <figure className="h-[1.4rem] aspect-square rounded-full border dark:border-stone-200 bg-violet-200 border-stone-700 overflow-hidden">
        {image ? (
          <img
            className="size-full block"
            src={image}
            alt="user's small round profile page as an icon"
          />
        ) : (
          <Avatar
            name={user?.username || "username"}
            variant="beam"
            aria-hidden="true"
          />
        )}
      </figure>
      <FaChevronDown
        className="text-[0.6rem] text-stone-600 dark:text-stone-300"
        aria-hidden="true"
      />
    </div>
  );
};

export default SmallIconUserPic;
