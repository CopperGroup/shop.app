"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Store } from "lucide-react";
// import { useState } from "react";
// import { Store, ChevronDown, LayoutDashboard, BarChart3, Package, LinkIcon, ShoppingCart, Users, CreditCard, BarChart4, FolderTree, Code, Receipt, Ticket, PlusCircle } from 'lucide-react';


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

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Store, ChevronDown, LayoutDashboard, BarChart3, Package, LinkIcon, ShoppingCart, Users, CreditCard, BarChart4, FolderTree, Code, Receipt, Ticket, PlusCircle } from 'lucide-react';

// const AdminSidebar = () => {
//     const pathname = usePathname();
//     const [openGroups, setOpenGroups] = useState<string[]>([]);

//     const toggleGroup = (title: string) => {
//         setOpenGroups((prev) =>
//             prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
//         );
//     }

//     return (
//         <section className="bg-white shadow-md leftsidebar overflow-y-hidden">
//             <div className="flex w-full flex-1 flex-col">
//                 <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
//                     <Link href="/" className="flex items-center gap-3 text-black">
//                         <div className="bg-gray-900 p-1.5 rounded-md">
//                             <Store className="size-5 text-white" />
//                         </div>
//                         <span className="text-lg font-semibold">SANTEHVAN</span>
//                     </Link>
//                 </div>
//                 <nav className="mt-4 pb-24 px-4 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 60px)' }}>
//                     <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Admin Panel</p>
//                     {sidebarLinks.map((group) => (
//                         <div key={group.title} className="mb-4">
//                             <button
//                                 className="w-60 flex items-center justify-between py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-md"
//                                 onClick={() => toggleGroup(group.title)}
//                             >
//                                 <span className="truncate">{group.title}</span>
//                                 <ChevronDown 
//                                     className={`size-4 text-gray-400 transition-transform duration-300 ease-in-out ${
//                                         openGroups.includes(group.title) ? 'transform rotate-180' : ''
//                                     }`} 
//                                 />
//                             </button>
//                             <div
//                                 className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
//                                     openGroups.includes(group.title) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
//                                 }`}
//                             >
//                                 {group.items.map((item) => {
//                                     const isActive =
//                                         pathname === item.href ||
//                                         (item.href.length > 1 && pathname.startsWith(item.href));
//                                     return (
//                                         <Link
//                                             key={item.label}
//                                             href={item.href}
//                                             className={`
//                                                 flex items-center px-3 py-2 text-sm transition-all duration-200 rounded-md
//                                                 ${
//                                                     isActive
//                                                         ? 'bg-gray-100 text-gray-900 font-medium'
//                                                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                                                 }
//                                             `}
//                                         >
//                                             <div className={`mr-3 p-1.5 rounded-full ${isActive ? 'bg-gray-900' : 'bg-gray-200'}`}>
//                                                 <item.icon className={`size-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
//                                             </div>
//                                             <span className="truncate">{item.label}</span>
//                                         </Link>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     ))}
//                 </nav>
//             </div>
//         </section>
//     );
// };

// export default AdminSidebar;

