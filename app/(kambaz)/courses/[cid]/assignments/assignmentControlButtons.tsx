import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";

export default function AssignmentControlButtons() {
  return (
    <div className="float-end">
      <div className="bg-secondary border border-dark rounded-4 me-1 d-inline-block px-2 py-1">
        40% of Total
      </div>
      <BsPlus className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
