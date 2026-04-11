function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col min-h-0">
      <div className="px-3 sm:px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-xs sm:text-sm shrink-0">
        Output
      </div>
      <div className="flex-1 overflow-auto p-3 sm:p-4 min-h-0">
        {output === null ? (
          <p className="text-base-content/50 text-xs sm:text-sm">
            Click "Run Code" to see the output here...
          </p>
        ) : output.success ? (
          <pre className="text-xs sm:text-sm font-mono text-success whitespace-pre-wrap break-words">
            {output.output}
          </pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-xs sm:text-sm font-mono text-base-content whitespace-pre-wrap break-words mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-xs sm:text-sm font-mono text-error whitespace-pre-wrap break-words">
              {output.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;