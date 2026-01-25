export default function Modules() {
  return (
    <div>
        <button className="btn btn-collapse-all">Collapse All</button>
        <button className="btn btn-view-progress">View Progress</button>
        <select>
            <option value="all">Publish All</option>
        </select>
        <button className="btn btn-add-module">+ Module</button>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 2</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">HTML</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to HTML</li>
                <li className="wd-content-item">HTML tags</li>
              </ul>
            </li>
          </ul> 
          </li>
        <li className="wd-module">
          <div className="wd-title">Week 3</div> 
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">CSS</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to CSS</li>
                <li className="wd-content-item">CSS styles</li>
              </ul>
            </li>
          </ul>
          </li>
      </ul>
    </div>
);}
