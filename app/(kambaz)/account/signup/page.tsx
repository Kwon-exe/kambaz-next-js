"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Alert, FormControl } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({ username: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = async () => {
    setError("");
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/account/profile");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to sign up right now");
    }
  };

  return (
    <div className="wd-signup-screen" id="wd-signup-screen">
      <h1>Sign up</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <FormControl
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="username"
        className="wd-username mb-2"
      />
      <FormControl
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
        type="password"
        className="wd-password mb-2"
      />
      <button
        onClick={signup}
        className="wd-signup-btn btn btn-primary mb-2 w-100"
      >
        Sign up
      </button>
      <Link id="wd-signin-link" href="/account/signin">
        Sign in
      </Link>
    </div>
  );
}
