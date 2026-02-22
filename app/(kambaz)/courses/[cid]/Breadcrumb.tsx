"use client";
import React from "react";
import { usePathname } from "next/navigation";
export default function Breadcrumb({
  course,
}: {
  course: { name: string } | undefined;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentSection = pathSegments[pathSegments.length - 1];

  // Map route names to display names
  const sectionNames: { [key: string]: string } = {
    home: "Home",
    modules: "Modules",
    assignments: "Assignments",
    grades: "Grades",
    piazza: "Piazza",
    people: "People",
    quizzes: "Quizzes",
    zoom: "Zoom",
  };

  // Show just course name if we're at the course root, otherwise append section
  const displaySection = sectionNames[currentSection];

  return (
    <span>
      {course?.name}
      {displaySection && " > " + displaySection}
    </span>
  );
}
