import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/Kambaz.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1235" className="wd-dashboard-course-link">
            <Image src="/images/Kambaz.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1235 Object Oriented Design </h5>
              <p className="wd-dashboard-course-title">
                Learn the fundamentals of OOD
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1236" className="wd-dashboard-course-link">
            <Image src="/images/Kambaz.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1236 Web Development </h5>
              <p className="wd-dashboard-course-title">
                Web Development
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1237" className="wd-dashboard-course-link">
            <Image src="/images/Kambaz.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1237 Theory of Computation </h5>
              <p className="wd-dashboard-course-title">
                Theory of Computation
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1238" className="wd-dashboard-course-link">
            <Image src="/images/Kambaz.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1238 Data Structures and Algorithms </h5>
              <p className="wd-dashboard-course-title">
                Data Structures and Algorithms
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1239" className="wd-dashboard-course-link">
            <Image src="/images/Kambaz.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1239 Cybersecurity </h5>
              <p className="wd-dashboard-course-title">
                Introduction to Cybersecurity
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1250" className="wd-dashboard-course-link">
            <Image src="/images/Kambaz.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1250 Software Engineering </h5>
              <p className="wd-dashboard-course-title">
                Software Engineering
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
);}
