"use client";

import { useState, useRef, useEffect } from "react";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";

const MobileAdminSidebar = () => {
  const pathname = usePathname();
  const session = useSession();
  const controls = useAnimation();
  const constraintsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 50 && isOpen) {
      setIsOpen(false);
    } else {
      controls.start(isOpen ? "open" : "closed");
    }
  };

  useEffect(() => {
    controls.start(isOpen ? "open" : "closed");
  }, [isOpen, controls]);

  const variants = {
    open: { y: "0%" },
    closed: { y: "calc(100% - 30px)" },
  };

  return (
    <motion.section
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-100 to-white shadow-lg rounded-t-3xl overflow-hidden z-50 md:hidden"
      ref={constraintsRef}
      initial="closed"
      animate={controls}
      variants={variants}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      drag={isOpen ? "y" : false}
      dragConstraints={constraintsRef}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <div 
        className="h-7 w-full bg-transparent cursor-pointer"
        onClick={toggleSidebar}
      >
        <div className="h-1.5 w-12 bg-gray-300 rounded-full mx-auto my-3" />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="px-5 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Link href="/" className="text-heading3-bold">SANTEHVAN</Link>
            <p className="text-small-x-semibold text-dark-4 mt-4 mb-2">Admin</p>
            <div className="flex flex-col gap-2">
              {sidebarLinks.map((link) => {
                const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                return (
                  <Link
                    href={link.route}
                    key={link.label}
                    className={`flex items-center p-2 rounded-lg ${
                      isActive ? "bg-muted-normal" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width={22}
                      height={22}
                      className={`mr-3 rounded-full p-[1px] ${isActive ? "stroke-white bg-black" : "stroke-black"}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={link.svgPath}
                      />
                    </svg>
                    <p className={`text-black text-small-x-semibold ${isActive ? "font-bold" : ""}`}>
                      {link.label}
                    </p>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default MobileAdminSidebar;