import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* NAVBAR */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="size-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-md shrink-0">
              <SparklesIcon className="size-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-base bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-widest">
                Collab 2
              </span>
              <span className="text-[10px] text-base-content/50 font-medium -mt-0.5 hidden sm:block">
                Code Together
              </span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <SignInButton mode="modal">
            <button className="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-primary hover:bg-primary/90 rounded-xl text-primary-content font-semibold text-sm shadow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <span>Get Started</span>
              <ArrowRightIcon className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 bg-base-100 border border-base-300 rounded-full px-4 py-1.5 text-sm text-base-content/70 shadow-sm">
              <ZapIcon className="size-3.5 text-primary" />
              Real-time Collaboration
            </div>

            {/* HEADLINE */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block">
                Code Together,
              </span>
              <span className="text-base-content">Learn Together</span>
            </h1>

            <p className="text-base sm:text-lg text-base-content/60 leading-relaxed max-w-lg">
              The ultimate platform for collaborative coding interviews and pair
              programming. Connect face-to-face, code in real-time, and ace your
              technical interviews.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-2">
              {["Live Video Chat", "Code Editor", "Multi-Language"].map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-base-300 bg-base-100 text-xs font-medium text-base-content/70"
                >
                  <CheckIcon className="size-3 text-success" />
                  {f}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-1">
              <SignInButton mode="modal">
                <button className="btn btn-primary rounded-xl px-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]">
                  Start Coding Now
                  <ArrowRightIcon className="size-4" />
                </button>
              </SignInButton>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { value: "10K+", label: "Active Users", color: "text-primary" },
                { value: "50K+", label: "Sessions", color: "text-secondary" },
                { value: "99.9%", label: "Uptime", color: "text-accent" },
              ].map(({ value, label, color }) => (
                <div
                  key={label}
                  className="bg-base-100 rounded-2xl border border-base-300 p-3 sm:p-4 text-center shadow-sm"
                >
                  <div className={`text-xl sm:text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-xs text-base-content/50 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-2xl scale-105" />
              <img
                src="/hero.png"
                alt="CodeCollab Platform"
                className="relative w-full h-auto rounded-3xl shadow-2xl border border-base-300 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {/* SECTION HEADER */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Everything You Need to{" "}
            <span className="text-primary font-mono">Succeed</span>
          </h2>
          <p className="text-base text-base-content/60 max-w-xl mx-auto">
            Powerful features designed to make your coding interviews seamless
            and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: VideoIcon,
              title: "HD Video Call",
              desc: "Crystal clear video and audio for seamless communication during interviews",
              bg: "bg-primary/10",
              color: "text-primary",
            },
            {
              icon: Code2Icon,
              title: "Live Code Editor",
              desc: "Collaborate in real-time with syntax highlighting and multiple language support",
              bg: "bg-secondary/10",
              color: "text-secondary",
            },
            {
              icon: UsersIcon,
              title: "Easy Collaboration",
              desc: "Share your screen, discuss solutions, and learn from each other in real-time",
              bg: "bg-accent/10",
              color: "text-accent",
            },
          ].map(({ icon: Icon, title, desc, bg, color }) => (
            <div
              key={title}
              className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div
                className={`size-12 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className={`size-6 ${color}`} />
              </div>
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <p className="text-sm text-base-content/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;