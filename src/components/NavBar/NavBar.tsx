/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { CartDropdown } from "./CartDropdown";
import ProfileDropdown from "./ProfileDropdown";
import ThemeSwitch from "./ThemeSwitch";

export default function NavBar() {
  return (
    <div className="flex items-center justify-around">
      <ThemeSwitch />
      <ProfileDropdown />
      <CartDropdown />
    </div>
  );
}
