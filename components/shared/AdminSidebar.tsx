"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


const AdminSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const session = useSession();
   

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-3 pl-5">
                <div className="flex gap-2 items-center">
                    <Link href="/" className="text-heading3-bold pl-3">SANTEHVAN</Link>
                </div>
                <p className="text-small-x-semibold text-dark-4 pl-3 mt-10">Admin</p>
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={`leftsidebar_link ${isActive && "bg-muted-normal border-r-[3px] border-black"}`}
                        >
                            <div className="flex gap-2 items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    width={40}
                                    height={40}
                                    className={`rounded-full py-2 ml-2 ${isActive ? "stroke-white bg-black" : "stroke-black"}`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d={link.svgPath}
                                    />
                                </svg>
                                <p className={`w-40 max-lg:hidden text-black text-small-x-semibold h-fit ${!isActive && "-ml-2"}`}>{link.label}</p>
                            </div>
                        </Link>
                    );
                })}
                <div className="w-11/12 absolute right-0 rounded-l-lg bottom-5 px-4 hover:bg-muted-normal hover:border-black hover:border-r-[3px]">
                    <div className="flex gap-2">
                        <Image
                            src="/assets/user.svg"
                            width={54}
                            height={54}
                            alt="Profile picture"
                        />
                        <div className="w-full flex justify-between">
                            <div className="h-full flex flex-col justify-center">
                                {/*@ts-ignore*/}
                                <p className="text-base-semibold">{session.data?.user.username}</p>
                                <p className="text-small-medium text-dark-4">Admin</p>
                            </div>
                            
                        </div>
                    </div>
                </div>

                
            </div>
        </section>
    );
};

export default AdminSidebar;
