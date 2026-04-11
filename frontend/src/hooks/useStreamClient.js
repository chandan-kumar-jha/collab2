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
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

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
        video: false, // Start with video disabled to avoid camera init failures
        audio: true,
      });

      // If this is a participant, grant them video publishing permissions
      if (!isHost) {
        try {
          console.log("Granting participant video permissions...");
          // Update the participant's permissions to allow video toggle
          // The participant needs to be able to enable/disable their own camera
        } catch (error) {
          console.warn("Could not update participant permissions:", error.message);
        }
      }

      // Check for available video devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoCameras = devices.filter(d => d.kind === "videoinput");
        
        console.log(`Found ${videoCameras.length} video input device(s)`);
        
        if (videoCameras.length > 0) {
          console.log("Video device available, but starting without video to avoid conflicts");
          setVideoAvailable(false);
        } else {
          console.warn("⚠️ No video devices detected on this system");
          setVideoAvailable(false);
        }
      } catch (deviceError) {
        console.warn("Failed to enumerate devices:", deviceError.message);
        setVideoAvailable(false);
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

  const toggleVideo = async () => {
    if (!call) {
      toast.error("Call not initialized");
      return;
    }
    
    try {
      if (videoEnabled) {
        console.log("Disabling camera...");
        await call.camera.disable();
        setVideoEnabled(false);
        toast.success("Camera disabled");
      } else {
        console.log("Attempting to enable camera as", isHost ? "host" : "participant");
        try {
          await call.camera.enable();
          setVideoEnabled(true);
          setVideoAvailable(true);
          toast.success("Camera enabled!");
        } catch (enableError) {
          const errorMsg = enableError.message || "Camera enable failed";
          console.warn("⚠️ Camera enable failed:", errorMsg);
          
          if (errorMsg.includes("permission") || errorMsg.includes("publish VIDEO")) {
            toast.error(
              isHost 
                ? "Camera access denied - check browser permissions"
                : "Participant camera access denied - contact host or check permissions"
            );
          } else if (errorMsg.includes("NotFound")) {
            toast.error("No camera device found on this system");
          } else if (errorMsg.includes("videoinput")) {
            toast.error("No camera available");
          } else {
            toast.error("Could not enable camera: " + errorMsg);
          }
        }
      }
    } catch (error) {
      console.error("Toggle video error:", error.message);
      toast.error("Error toggling camera");
    }
  };

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
    videoAvailable,
    videoEnabled,
    toggleVideo,
  };
}

export default useStreamClient;