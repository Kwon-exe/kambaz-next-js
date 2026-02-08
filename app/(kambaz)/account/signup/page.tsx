import Link from "next/link";
import FormControl from "react-bootstrap/esm/FormControl";
export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h1>Sign Up</h1>
      <FormControl
        placeholder="username"
        className="wd-username mb-2"
        defaultValue="username"
      />
      <FormControl
        placeholder="password"
        type="password"
        className="wd-password mb-2"
        defaultValue="password"
      />
      <FormControl
        placeholder="verify password"
        type="password"
        className="wd-password-verify mb-2"
        defaultValue="password"
      />
      <Link href="profile" className="btn btn-primary w-100 mb-2">
        {" "}
        Sign up{" "}
      </Link>
      <Link id="wd-signin-link" href="/account/signin">
        Sign in
      </Link>
    </div>
  );
}
