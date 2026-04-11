import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon, VideoOffIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel, videoAvailable, videoEnabled, isTogglingVideo, toggleVideo }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount, useCallMembers } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const members = useCallMembers();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg">Joining call...</p>
        </div>
      </div>
    );
  }

  // Check if any participant has video disabled
  const allVideoDisabled = members.every(m => !m.videoStream);

  return (
    <div className="h-full flex gap-3 relative str-video">
      <div className="flex-1 flex flex-col gap-3">
        {/* Participants count badge and Chat Toggle */}
        <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVideo}
              disabled={!toggleVideo || isTogglingVideo || !videoAvailable}
              className={`btn btn-sm gap-2 ${videoEnabled ? "btn-primary" : "btn-ghost"}`}
              title={videoEnabled ? "Disable camera" : "Enable camera"}
            >
              {videoEnabled ? (
                <>
                  <VideoIcon className="size-4" />
                  Camera On
                </>
              ) : (
                <>
                  <VideoOffIcon className="size-4" />
                  Camera Off
                </>
              )}
            </button>
            {chatClient && channel && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`btn btn-sm gap-2 ${isChatOpen ? "btn-primary" : "btn-ghost"}`}
                title={isChatOpen ? "Hide chat" : "Show chat"}
              >
                <MessageSquareIcon className="size-4" />
                Chat
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative">
          {allVideoDisabled && !videoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-300 z-20">
              <div className="text-center space-y-4">
                <VideoOffIcon className="w-16 h-16 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-semibold text-gray-600">
                    {videoAvailable ? "Camera is off" : "No Camera Available"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {videoAvailable ? "Enable your camera to appear in the call" : "Audio-only session active"}
                  </p>
                  {videoAvailable && (
                    <p className="text-xs text-gray-400 mt-2">
                      {videoEnabled ? "Camera enabled" : "Try enabling camera above"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <SpeakerLayout />
        </div>

        <div className="bg-base-100 p-3 rounded-lg shadow flex justify-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}

      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-lg shadow overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between">
                <h3 className="font-semibold text-white">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark">
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
