"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const links = currentUser ? ["profile"] : ["signin", "signup"];
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      <Link
        href="/account/signin"
        id="wd-account-signin-link"
        className={`list-group-item border-0 ${
          isActive("/account/signin") ? "active" : "text-danger"
        }`}
      >
        Signin
      </Link>

      <Link
        href="/account/signup"
        id="wd-account-signup-link"
        className={`list-group-item border-0 ${
          isActive("/account/signup") ? "active" : "text-danger"
        }`}
      >
        Signup
      </Link>

      <Link
        href="/account/profile"
        id="wd-account-profile-link"
        className={`list-group-item border-0 ${
          isActive("/account/profile") ? "active" : "text-danger"
        }`}
      >
        Profile
      </Link>

      {currentUser?.role === "ADMIN" && (
        <Link
          href="/account/users"
          id="wd-account-users-link"
          className={`list-group-item border-0 ${
            isActive("/account/users") ? "active" : "text-danger"
          }`}
        >
          Users
        </Link>
      )}
    </div>
  );
}
