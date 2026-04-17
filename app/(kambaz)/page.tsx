import Link from "next/link";

export default function Kambaz() {
  return (
    <div className="container-fluid px-0">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-body p-4 p-md-5 bg-light">
              <div className="row g-4 align-items-center">
                <div className="col-lg-7">
                  <div className="text-uppercase text-danger fw-semibold small mb-2">
                    Kambaz Next.js
                  </div>
                  <h1 className="display-5 fw-bold mb-3">Welcome to Kambaz</h1>
                  <p className="lead text-secondary mb-4">
                    A simple course management workspace for dashboards,
                    modules, assignments, and account pages. Use the sidebar to
                    move through the app, or jump in below.
                  </p>

                  <div className="d-flex flex-wrap gap-2 mb-4">
                    <Link href="/account/signin" className="btn btn-danger">
                      Sign In
                    </Link>
                    <Link href="/dashboard" className="btn btn-outline-dark">
                      Go to Dashboard
                    </Link>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="bg-white rounded-4 border p-4 h-100">
                    <h2 className="h5 fw-bold mb-3">Group Members</h2>
                    <ul className="list-group list-group-flush mb-4">
                      <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <span>Nicolo Lagravinese</span>
                      </li>
                      <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <span>Kwon Lok Young</span>
                      </li>
                    </ul>

                    <div className="d-grid gap-2">
                      <a
                        className="btn btn-dark"
                        href="https://github.com/Kwon-exe/kambaz-next-js"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Frontend GitHub
                      </a>
                      <a
                        className="btn btn-outline-secondary"
                        href="https://github.com/Kwon-exe/kambaz-next-js/tree/master/kambaz-node-server-app"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Backend GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
