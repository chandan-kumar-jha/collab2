import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  /* ─── shared problem description markup ─── */
  const ProblemPanel = (
    <div className="h-full overflow-y-auto bg-base-200">
      {/* HEADER */}
      <div className="p-4 sm:p-6 bg-base-100 border-b border-base-300">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold text-base-content leading-tight">
              {session?.problem || "Loading..."}
            </h1>
            {problemData?.category && (
              <p className="text-sm text-base-content/60 mt-1">{problemData.category}</p>
            )}
            <p className="text-xs sm:text-sm text-base-content/60 mt-1 sm:mt-2">
              Host: {session?.host?.name || "Loading..."} •{" "}
              {session?.participant ? 2 : 1}/2 participants
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className={`badge ${getDifficultyBadgeClass(session?.difficulty)}`}>
              {session?.difficulty
                ? session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)
                : "Easy"}
            </span>
            {isHost && session?.status === "active" && (
              <button
                onClick={handleEndSession}
                disabled={endSessionMutation.isPending}
                className="btn btn-error btn-xs sm:btn-sm gap-1.5 sm:gap-2"
              >
                {endSessionMutation.isPending ? (
                  <Loader2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <LogOutIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                <span className="hidden xs:inline">End Session</span>
              </button>
            )}
            {session?.status === "completed" && (
              <span className="badge badge-ghost">Completed</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Description */}
        {problemData?.description && (
          <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 border border-base-300">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-base-content">Description</h2>
            <div className="space-y-3 text-sm sm:text-base leading-relaxed">
              <p className="text-base-content/90">{problemData.description.text}</p>
              {problemData.description.notes?.map((note, idx) => (
                <p key={idx} className="text-base-content/90">{note}</p>
              ))}
            </div>
          </div>
        )}

        {/* Examples */}
        {problemData?.examples && problemData.examples.length > 0 && (
          <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 border border-base-300">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-base-content">Examples</h2>
            <div className="space-y-4">
              {problemData.examples.map((example, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-sm">{idx + 1}</span>
                    <p className="font-semibold text-sm sm:text-base text-base-content">Example {idx + 1}</p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm space-y-1.5">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-primary font-bold min-w-[60px] sm:min-w-[70px]">Input:</span>
                      <span className="break-all">{example.input}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-secondary font-bold min-w-[60px] sm:min-w-[70px]">Output:</span>
                      <span className="break-all">{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div className="pt-2 border-t border-base-300 mt-2">
                        <span className="text-base-content/60 font-sans text-xs">
                          <span className="font-semibold">Explanation:</span> {example.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problemData?.constraints && problemData.constraints.length > 0 && (
          <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 border border-base-300">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-base-content">Constraints</h2>
            <ul className="space-y-2 text-base-content/90">
              {problemData.constraints.map((constraint, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <code className="text-xs sm:text-sm break-all">{constraint}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  /* ─── shared video panel markup ─── */
  const VideoPanel = (
    <div className="h-full bg-base-200 p-3 sm:p-4 overflow-auto">
      {isInitializingCall ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto animate-spin text-primary mb-4" />
            <p className="text-base sm:text-lg">Connecting to video call...</p>
          </div>
        </div>
      ) : !streamClient || !call ? (
        <div className="h-full flex items-center justify-center">
          <div className="card bg-base-100 shadow-xl max-w-xs sm:max-w-md w-full">
            <div className="card-body items-center text-center p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                <PhoneOffIcon className="w-8 h-8 sm:w-12 sm:h-12 text-error" />
              </div>
              <h2 className="card-title text-xl sm:text-2xl">Connection Failed</h2>
              <p className="text-sm sm:text-base text-base-content/70">
                Unable to connect to the video call
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <StreamVideo client={streamClient}>
            <StreamCall call={call}>
              <VideoCallUI chatClient={chatClient} channel={channel} />
            </StreamCall>
          </StreamVideo>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      {/* MOBILE LAYOUT */}
      <div className="flex-1 overflow-y-auto md:hidden flex flex-col">
        <div className="min-h-[45vh]">{ProblemPanel}</div>
        <div className="min-h-[40vh]">
          <CodeEditorPanel
            selectedLanguage={selectedLanguage}
            code={code}
            isRunning={isRunning}
            onLanguageChange={handleLanguageChange}
            onCodeChange={(value) => setCode(value)}
            onRunCode={handleRunCode}
          />
        </div>
        <div className="min-h-[20vh]">
          <OutputPanel output={output} />
        </div>
        <div className="min-h-[50vh]">{VideoPanel}</div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="flex-1 hidden md:block">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20}>
                {ProblemPanel}
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL */}
          <Panel defaultSize={50} minSize={30}>
            {VideoPanel}
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;