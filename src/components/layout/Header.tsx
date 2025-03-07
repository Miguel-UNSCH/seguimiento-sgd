"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import AvatarUser from "@/components/cards/avatar-user";
import { Session } from "next-auth";

interface HeaderProps {
  session: Session;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card relative z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              width={32}
              height={32}
              alt="Logo"
              className="mr-2"
            />
            <span className="font-bold text-xl text-foreground">
              GORE Ayacucho
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AvatarUser session={session} />
          </div>
        </div>
      </div>
    </header>
  );
}