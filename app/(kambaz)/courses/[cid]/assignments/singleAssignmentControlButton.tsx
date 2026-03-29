import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { FaTrash } from "react-icons/fa";

interface SingleAssignmentControlButtonProps {
  onDelete?: () => void;
}

export default function SingleAssignmentControlButton({
  onDelete,
}: SingleAssignmentControlButtonProps) {
  return (
    <div className="float-end">
      <GreenCheckmark />
      {onDelete && (
        <button
          onClick={onDelete}
          className="btn btn-link p-0 me-2 text-danger"
          aria-label="Delete assignment"
        >
          <FaTrash className="fs-6" />
        </button>
      )}
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
