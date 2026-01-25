import Link from "next/link";
export default function Assignments() {
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments"
             id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button> </h3>
      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link href="/courses/1234/assignments/123"
             className="wd-assignment-link" >
            A1 - ENV + HTML
          </Link> 
        </li>
          Multiple Modules | <b>Not Available</b> until May 6 at 12:00 AM | <b>Due</b> May 13 at 11:59 PM | 10 Points
        <li className="wd-assignment-list-item">
            <Link href="/courses/1234/assignments/124"
              className="wd-assignment-link">
              A2 - HTML
            </Link> 
        </li>
            Multiple Modules | <b>Not Available</b> until May 13 at 12:00 AM | <b>Due</b> May 20 at 11:59 PM | 10 Points
        <li className="wd-assignment-list-item">
            <Link href="/courses/1234/assignments/125"
              className="wd-assignment-link">
              A3 - CSS
            </Link>
        </li>
            Multiple Modules | <b>Not Available</b> until May 20 at 12:00 AM | <b>Due</b> May 27 at 11:59 PM | 10 Points
      </ul>
    </div>
);}
