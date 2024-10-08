"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Store } from "lucide-react";


const AdminSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const session = useSession();
   

    return (
        <section className="admin-panel-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-3 pl-5 max-lg:pl-0">
                <div className="flex gap-2 items-center">
                    <Link href="/" className="text-heading3-bold pl-3 max-lg:hidden">SANTEHVAN</Link>
                    <Link href="/" className="w-full flex justify-center lg:hidden"><Store className="size-8 bg-black text-white rounded-full p-1"/></Link>
                </div>
                <p className="text-small-x-semibold text-dark-4 pl-3 mt-10 max-lg:hidden">Admin</p>
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={`leftsidebar_link ${isActive && "bg-muted-normal border-r-[3px] border-black max-lg:border-r-0"}`}
                        >
                            <div className="flex gap-2 items-center max-lg:ml-1">
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
            </div>
        </section>
    );
};

export default AdminSidebar;
