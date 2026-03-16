"use client";
import { FormControl } from "react-bootstrap";
import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../courses/reducer";
import { RootState } from "../store";
import { enroll, unenroll } from "../enrollments/reducer";

type Course = {
  _id: string;
  name: string;
  number?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  description: string;
};

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const dispatch = useDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const isFaculty = currentUser?.role === "FACULTY";
  const isEnrolled = (courseId: string) =>
    !!currentUser &&
    enrollments.some(
      (enrollment) =>
        enrollment.user === currentUser._id && enrollment.course === courseId,
    );

  const visibleCourses = showAllCourses
    ? courses
    : courses.filter((course: any) => isEnrolled(course._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">{isFaculty ? "New Course" : "Courses"}</h5>
        <div className="d-flex gap-2">
          {isFaculty && (
            <>
              <button
                className="btn btn-warning"
                onClick={() => dispatch(updateCourse(course))}
                id="wd-update-course-click"
              >
                Update
              </button>
              <button
                className="btn btn-primary"
                id="wd-add-new-course-click"
                onClick={() => dispatch(addNewCourse(course))}
              >
                Add
              </button>
            </>
          )}
          <button
            className="btn btn-primary"
            id="wd-show-all-courses-click"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            Enrollments
          </button>
        </div>
      </div>
      {isFaculty && (
        <>
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
        </>
      )}
      <hr />
      <h2 id="wd-dashboard-published">
        Published Courses ({visibleCourses.length})
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {visibleCourses.map((course: any) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={
                    isEnrolled(course._id)
                      ? `/courses/${course._id}/home`
                      : "/dashboard"
                  }
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/Kambaz.jpg"
                    width="100%"
                    height={160}
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button variant="primary">Go</Button>
                      {currentUser && (
                        <button
                          className={`btn ${
                            isEnrolled(course._id)
                              ? "btn-danger"
                              : "btn-success"
                          }`}
                          id={
                            isEnrolled(course._id)
                              ? "wd-unenroll-course-click"
                              : "wd-enroll-course-click"
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            if (isEnrolled(course._id)) {
                              dispatch(
                                unenroll({
                                  userId: currentUser._id,
                                  courseId: course._id,
                                }),
                              );
                              return;
                            }
                            dispatch(
                              enroll({
                                userId: currentUser._id,
                                courseId: course._id,
                              }),
                            );
                          }}
                        >
                          {isEnrolled(course._id) ? "Unenroll" : "Enroll"}
                        </button>
                      )}
                    </div>
                    {isFaculty && (
                      <div className="d-flex justify-content-end gap-2 mt-2">
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            dispatch(deleteCourse(course._id));
                          }}
                          className="btn btn-danger"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
