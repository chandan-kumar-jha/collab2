import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

 useEffect(() => {
  console.log("HOOK RUNNING 🔥", {
    session,
    loadingSession,
    isHost,
    isParticipant,
    hasInitialized,
  });

  let videoCall = null;
  let chatClientInstance = null;

  const initCall = async () => {
    console.log("INIT CALL STARTED 🔥");

    try {
      const { token, userId, userName, userImage } =
        await sessionApi.getStreamToken();

      const client = await initializeStreamClient(
        {
          id: userId,
          name: userName,
          image: userImage,
        },
        token
      );

      setStreamClient(client);

      videoCall = client.call("default", session.callId);

      console.log("Before join");

      await videoCall.join({
        create: isHost,
        video: true,
        audio: true,
      });
      const devices = await navigator.mediaDevices.enumerateDevices();

const camera = devices.find(d => d.kind === "videoinput");

if (camera) {
  await videoCall.camera.select(camera.deviceId);
  await videoCall.camera.enable();
}

      console.log("AFTER JOIN ✅");

      setCall(videoCall);

      videoCall.on("connection.changed", (e) => {
        console.log("Connection state:", e);
      });

      // CHAT
      const apiKey = import.meta.env.VITE_STREAM_API_KEY;
      chatClientInstance = StreamChat.getInstance(apiKey);

      await chatClientInstance.connectUser(
        {
          id: userId,
          name: userName,
          image: userImage,
        },
        token
      );

      setChatClient(chatClientInstance);

      const chatChannel = chatClientInstance.channel(
        "messaging",
        session.callId
      );

      await chatChannel.watch();
      setChannel(chatChannel);

    } catch (error) {
      console.error("❌ Error init call", error);
    } finally {
      setIsInitializingCall(false);
    }
  };

  // ✅ SAFE GUARD FLOW
  if (!session || loadingSession) return;
  if (!session.callId) return;
  if (hasInitialized) return; // 🔥 prevents loop

  console.log("INIT TRIGGERED 🚀");

  setHasInitialized(true); // 🔥 important
  initCall();

  return () => {
    (async () => {
      try {
        if (videoCall) await videoCall.leave();
        if (chatClientInstance)
          await chatClientInstance.disconnectUser();
        await disconnectStreamClient();
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    })();
  };
}, [session?.callId, loadingSession, hasInitialized, isHost, isParticipant]);
//session?.callId
  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;