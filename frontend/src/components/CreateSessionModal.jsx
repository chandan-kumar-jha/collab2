import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-2xl mx-4 sm:mx-auto p-4 sm:p-6">
        <h3 className="font-bold text-xl sm:text-2xl mb-4 sm:mb-6">Create New Session</h3>

        <div className="space-y-6 sm:space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label py-0">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select select-sm sm:select-md w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success py-3 px-4">
              <Code2Icon className="size-4 sm:size-5 shrink-0" />
              <div className="text-sm sm:text-base min-w-0">
                <p className="font-semibold">Room Summary:</p>
                <p className="truncate">
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action mt-4 sm:mt-6 flex-wrap gap-2">
          <button className="btn btn-ghost btn-sm sm:btn-md" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary btn-sm sm:btn-md gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-4 sm:size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-4 sm:size-5" />
            )}
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;