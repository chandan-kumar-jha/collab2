import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent truncate">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-base-content/60 ml-11 sm:ml-16">
              Ready to level up your coding skills?
            </p>
          </div>

          <button
            onClick={onCreateSession}
            className="group w-full sm:w-auto shrink-0 px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-200 hover:opacity-90"
          >
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-white font-bold text-base sm:text-lg">
              <ZapIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span>Create Session</span>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;