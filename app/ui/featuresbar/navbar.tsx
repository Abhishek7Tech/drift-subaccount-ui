"use client";
import React from "react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";
import useNavStore from "@/app/store/navStore";

export const FeaturesBar = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    active: boolean;
  }[];
  className?: string;
}) => {
  const setActiveNavItem = useNavStore((store) => store.setNavItems);
  const activeNavLinkHanlder = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // console.log("Id", e.currentTarget.id);
    setActiveNavItem(e.currentTarget.id);
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 1,
        }}
        animate={{}}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit  fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) =>
          navItem.active ? (
            <button
              key={`link=${idx}`}
              id={navItem.name}
              className={cn(
                "border text-sm cursor-pointer font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"
              )}
            >
              <span className="hidden sm:block font-medium text-sm">
                {navItem.name}
              </span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
            </button>
          ) : (
            <button
              onClick={(e) => activeNavLinkHanlder(e)}
              key={`link=${idx}`}
              id={navItem.name}
              className={cn(
                "relative dark:text-neutral-50 cursor-pointer items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
              )}
            >
              <span className="hidden sm:block font-medium text-sm">
                {navItem.name}
              </span>
            </button>
          )
        )}
        {/* <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button> */}
      </motion.div>
    </AnimatePresence>
  );
};
