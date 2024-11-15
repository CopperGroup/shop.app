"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function GoogleSignIn({ className, label }: { className: string | undefined, label: string }) {

  return (
    <button
      onClick={() => signIn("google")}
      className={cn("w-full flex justify-center items-center gap-4 text-dark-4 border border-dark-4 shadow-dark-4 shadow-extrasmall rounded-lg pl-3 px-1", className)}
    >
      <Image src="/google-logo.png" height={24} width={24} alt={"Google logo"} />
      <span className="font-[575] py-3">
        {label}
      </span>
    </button>
  );
}
