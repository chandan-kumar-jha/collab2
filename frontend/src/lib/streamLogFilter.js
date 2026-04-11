/**
 * Filter Stream SDK console warnings that are not actionable in audio-only setups
 */
export const setupStreamLogFiltering = () => {
  const originalWarn = console.warn;
  const originalError = console.error;

  // Pattern of warnings to suppress
  const suppressPatterns = [
    /Participant with sessionId.*not found/,
    /Failed to play stream/,
    /Failed to get video stream/,
    /Starting videoinput failed/,
    /The fetching process for the media resource was aborted/,
    /No permission to publish VIDEO/,
    /Call control handler failed.*No permission/,
  ];

  const shouldSuppress = (message) => {
    const msgStr = String(message);
    return suppressPatterns.some(pattern => pattern.test(msgStr));
  };

  // Override console.warn to filter Stream SDK warnings
  console.warn = function(...args) {
    if (!args.some(arg => shouldSuppress(arg))) {
      originalWarn.apply(console, args);
    }
  };

  // Override console.error to filter Stream SDK errors (but keep actual errors)
  console.error = function(...args) {
    if (!args.some(arg => shouldSuppress(arg))) {
      originalError.apply(console, args);
    }
  };
};
