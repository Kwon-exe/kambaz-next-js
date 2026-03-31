"use client";

import * as client from "./client";
import * as enrollmentsClient from "../enrollments/client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { setEnrollments } from "../enrollments/reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
      const enrollments = await enrollmentsClient.findMyEnrollments();
      dispatch(setEnrollments(enrollments));
    } catch (error: any) {
      console.error(error);
      dispatch(setCurrentUser(null));
      dispatch(setEnrollments([]));
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (pending) {
    return null;
  }

  return <>{children}</>;
}
