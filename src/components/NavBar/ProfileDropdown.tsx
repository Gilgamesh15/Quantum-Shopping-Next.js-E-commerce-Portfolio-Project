"use client";

import { signOut } from "@/lib/auth";
import {
  Button,
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  User,
  User2,
  UserCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { DropdownMenuIcon } from "../ui/dropdown-menu";
import Link from "next/link";

export default function ProfileDropdown() {
  const session = useSession();
  const isAdmin = session.data?.user?.role === "admin";
  const isValidSession = session.status === "authenticated";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-transform hover:scale-[1.15]"
        >
          <User2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isValidSession ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <DropdownMenuIcon icon={User} />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile/settings">
                <DropdownMenuIcon icon={Settings} />
                Settings
              </Link>
            </DropdownMenuItem>

            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <DropdownMenuIcon icon={LayoutDashboard} />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <DropdownMenuIcon icon={LogOut} />
              <span>Sign out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/sign-in">
                <DropdownMenuIcon icon={LogIn} />
                <span>Sign in</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sign-up">
                <DropdownMenuIcon icon={UserCircle} />
                <span>Sign up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuArrow />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
