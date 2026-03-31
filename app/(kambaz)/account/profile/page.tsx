"use client";
import * as client from "../client";
import { useEffect, useState } from "react";
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
  const [profile, setProfile] = useState<ProfileData>({});
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
      return;
    }
    const user = currentUser as ProfileData;
    setProfile({
      ...user,
      dob: toInputDate(user.dob),
    });
  }, [currentUser, router]);

  if (!currentUser) return null;

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
    setProfile({
      ...(updatedProfile as ProfileData),
      dob: toInputDate((updatedProfile as ProfileData).dob),
    });
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.replace("/account/signin");
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
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <FormControl
            id="wd-password"
            className="mb-2"
            value={profile.password || ""}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <FormControl
            id="wd-firstname"
            className="mb-2"
            value={profile.firstName || ""}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <FormControl
            id="wd-lastname"
            className="mb-2"
            value={profile.lastName || ""}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <FormControl
            id="wd-dob"
            className="mb-2"
            type="date"
            value={profile.dob || ""}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <FormControl
            id="wd-email"
            className="mb-2"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <select
            className="form-control mb-2"
            id="wd-role"
            value={profile.role || ""}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          >
            <option value="">Select role</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>{" "}
            <option value="STUDENT">Student</option>
            <option value="TA">TA</option>
          </select>
          <Button
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
            id="wd-update-btn"
          >
            Update
          </Button>
          <button
            onClick={signout}
            className="wd-signout-btn btn btn-danger w-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
