import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-sm sm:text-base text-base-content/70">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-3 sm:space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-base-100 hover:scale-[1.01] transition-transform"
            >
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2">
                      <div className="size-9 sm:size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Code2Icon className="size-4 sm:size-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h2 className="text-base sm:text-xl font-bold truncate">{problem.title}</h2>
                          <span className={`badge badge-sm sm:badge-md ${getDifficultyBadgeClass(problem.difficulty)} shrink-0`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-base-content/60">{problem.category}</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-base-content/80 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">
                      {problem.description.text}
                    </p>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-1 sm:gap-2 text-primary shrink-0">
                    <span className="font-medium text-sm sm:text-base hidden xs:inline">Solve</span>
                    <ChevronRightIcon className="size-4 sm:size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-8 sm:mt-12 card bg-base-100 shadow-lg">
          <div className="card-body p-4 sm:p-6">
            <div className="stats stats-vertical sm:stats-horizontal w-full">
              <div className="stat py-3 sm:py-4">
                <div className="stat-title text-xs sm:text-sm">Total Problems</div>
                <div className="stat-value text-2xl sm:text-4xl text-primary">{problems.length}</div>
              </div>
              <div className="stat py-3 sm:py-4">
                <div className="stat-title text-xs sm:text-sm">Easy</div>
                <div className="stat-value text-2xl sm:text-4xl text-success">{easyProblemsCount}</div>
              </div>
              <div className="stat py-3 sm:py-4">
                <div className="stat-title text-xs sm:text-sm">Medium</div>
                <div className="stat-value text-2xl sm:text-4xl text-warning">{mediumProblemsCount}</div>
              </div>
              <div className="stat py-3 sm:py-4">
                <div className="stat-title text-xs sm:text-sm">Hard</div>
                <div className="stat-value text-2xl sm:text-4xl text-error">{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;