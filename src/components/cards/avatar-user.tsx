"use client";

import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { signOut, useSession } from "next-auth/react";

function AvatarUser() {

  const session = useSession();
  
  if (!session) return null;

  if (session.status !== "authenticated") return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="border-2 border-primary rounded-full hover:cursor-pointer">
          <Avatar>
            <AvatarImage src="/images/user.png" alt="user"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4 mt-2 border">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <h2 className="p-4 text-center font-bold">{session.data.user.user}</h2>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full p-0 mb-2">
          <Button onClick={() => signOut({
            callbackUrl: '/login'
          })} className="w-full text-primary-foreground hover:cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sessión
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AvatarUser;