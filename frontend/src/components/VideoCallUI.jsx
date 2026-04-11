import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
  ScreenShareButton,
} from "@stream-io/video-react-sdk";

import {
  Loader2Icon,
  MessageSquareIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router";

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();

  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  const [isChatOpen, setIsChatOpen] = useState(false);

  const isMobile = /Android|iPhone/i.test(navigator.userAgent);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-base sm:text-lg">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-2 sm:gap-3 relative str-video">
      <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-h-0 min-w-0">

        {/* Participants + Chat Toggle */}
        <div className="flex items-center justify-between gap-2 bg-base-100 px-3 py-2 sm:p-3 rounded-lg shadow shrink-0">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
            <span className="font-semibold text-sm sm:text-base">
              {participantCount}{" "}
              {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>

          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-xs sm:btn-sm gap-1.5 sm:gap-2 ${
                isChatOpen ? "btn-primary" : "btn-ghost"
              }`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="size-3.5 sm:size-4" />
              <span className="hidden xs:inline">Chat</span>
            </button>
          )}
        </div>

        {/* VIDEO AREA */}
        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative min-h-0">
          <SpeakerLayout />
        </div>

        {/* CONTROLS */}
        <div className="bg-base-100 px-2 py-2 sm:p-3 rounded-lg shadow flex justify-center gap-2 shrink-0 flex-wrap">
          <CallControls onLeave={() => navigate("/dashboard")} />
          {!isMobile && <ScreenShareButton />}
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-lg shadow overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out shrink-0
            ${isChatOpen
              ? "h-64 md:h-auto md:w-72 lg:w-80 opacity-100"
              : "h-0 md:w-0 opacity-0 pointer-events-none"
            }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#1c1e22] px-3 py-2 sm:p-3 border-b border-[#3a3d44] flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-white text-sm sm:text-base">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <XIcon className="size-4 sm:size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden stream-chat-dark min-h-0">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;