"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const cid = params.cid as string;
  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];
  const isActive = (path: string) => pathname.startsWith(path);
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const path = `/courses/${cid}/${link.toLowerCase()}`;
        return (
          <Link
            key={link}
            href={path}
            id={`wd-course-${link.toLowerCase()}-link`}
            className={`list-group-item border-0 ${
              isActive(path) ? "active" : "text-danger"
            }`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}
