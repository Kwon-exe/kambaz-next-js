"use client";
import { FaAlignJustify } from "react-icons/fa";
import { ReactNode, useEffect, useState } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { cid } = useParams();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const course = courses.find((course: any) => course._id === courseId);

  const [showNav, setShowNav] = useState(true);

  const canAccessCourse =
    (currentUser?.role === "FACULTY" ||
      (currentUser?._id != null &&
        !!courseId &&
        enrollments.some(
          (enrollment) =>
            enrollment.user === currentUser._id &&
            enrollment.course === courseId,
        ))) &&
    !!courseId &&
    !!course;

  useEffect(() => {
    if (!canAccessCourse) {
      router.replace("/dashboard");
    }
  }, [canAccessCourse, router]);

  if (!canAccessCourse) {
    return null;
  }

  return (
    <div id="wd-courses">
      <h2>
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          style={{ cursor: "pointer" }}
          onClick={() => setShowNav(!showNav)}
        />
        {course?.name}
      </h2>
      <hr />

      <div className="d-flex">
        {showNav && (
          <div>
            <CourseNavigation />
          </div>
        )}

        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
