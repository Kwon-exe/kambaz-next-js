"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { FormControl } from "react-bootstrap";
import Button from "react-bootstrap/Button";

type ProfileData = {
  _id?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  email?: string;
  role?: string;
};

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const toInputDate = (value?: string) => {
    if (!value) return "";
    return value.includes("T") ? value.split("T")[0] : value;
  };

  useEffect(() => {
    if (!currentUser) {
      router.replace("/account/signin");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const profile: ProfileData = {
    ...(currentUser as ProfileData),
    dob: toInputDate((currentUser as ProfileData).dob),
  };

  const updateProfile = (changes: Partial<ProfileData>) => {
    dispatch(setCurrentUser({ ...profile, ...changes }));
  };

  const signout = () => {
    dispatch(setCurrentUser(null));
    router.push("/account/signin");
  };

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <FormControl
            id="wd-username"
            className="mb-2"
            value={profile.username || ""}
            onChange={(e) => updateProfile({ username: e.target.value })}
          />
          <FormControl
            id="wd-password"
            className="mb-2"
            value={profile.password || ""}
            onChange={(e) => updateProfile({ password: e.target.value })}
          />
          <FormControl
            id="wd-firstname"
            className="mb-2"
            value={profile.firstName || ""}
            onChange={(e) => updateProfile({ firstName: e.target.value })}
          />
          <FormControl
            id="wd-lastname"
            className="mb-2"
            value={profile.lastName || ""}
            onChange={(e) => updateProfile({ lastName: e.target.value })}
          />
          <FormControl
            id="wd-dob"
            className="mb-2"
            type="date"
            value={profile.dob || ""}
            onChange={(e) => updateProfile({ dob: e.target.value })}
          />
          <FormControl
            id="wd-email"
            className="mb-2"
            value={profile.email || ""}
            onChange={(e) => updateProfile({ email: e.target.value })}
          />
          <select
            className="form-control mb-2"
            id="wd-role"
            value={profile.role || ""}
            onChange={(e) => updateProfile({ role: e.target.value })}
          >
            <option value="">Select role</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>{" "}
            <option value="STUDENT">Student</option>
            <option value="TA">TA</option>
          </select>
          <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
