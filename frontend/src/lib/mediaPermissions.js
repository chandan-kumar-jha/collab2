/**
 * Utility to request browser camera/microphone permissions
 */
export const requestMediaPermissions = async () => {
  try {
    console.log("Requesting media permissions...");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    
    // Stop the stream immediately - we just needed permission
    stream.getTracks().forEach(track => track.stop());
    console.log("Media permissions granted ✅");
    return true;
  } catch (error) {
    console.warn("Media permission denied:", error.message);
    return false;
  }
};

/**
 * Check if camera permission was already granted
 */
export const checkCameraPermission = async () => {
  try {
    const permission = await navigator.permissions.query({ name: 'camera' });
    return permission.state === 'granted';
  } catch (error) {
    console.warn("Could not check camera permission:", error.message);
    return false;
  }
};
