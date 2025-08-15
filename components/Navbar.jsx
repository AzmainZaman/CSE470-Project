"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileIcon from "./ProfileIcon";
import { useTheme } from "@/app/hooks/useTheme.js";
import ToogleTheme from "./ToogleTheme";
const Navbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className={`h-[10%] overflow-hidden ${
        theme
          ? "bg-[#7f0000]"
          : "bg-orange-600"
      }`}
    >
      <div className="w-[40%] ml-[5%] h-full float-left flex justify-start items-center">
        <Link href="/">
          <div
            className={`text-[15px] sm:text-[18px] md:text-[22px] lg:text-[25px] xl:text-[30px] 2xl:text-[35px] font-bold text-left ${
              theme ? "text-white" : "text-white"
            }`}
          >
            Library Management System
          </div>
        </Link>
      </div>
      <div className="h-full float-left flex justify-end items-center w-[50%] mr-[5%]">
        <ul className="flex gap-5 text-[#cfcfcf]">
          {/* <li>
            <ToogleTheme />
          </li> */}
          <li>
            <ProfileIcon />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
