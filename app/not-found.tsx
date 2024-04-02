"use client";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function NotFound() {
  return (
    <main className={inter.className}>
      <div className="flex justify-center items-center gap-4 h-[90vh] text-3xl">
        Page not found <Link href={"/"} className="underline">click here to go to main page</Link>
      </div>
    </main>
  );
}
