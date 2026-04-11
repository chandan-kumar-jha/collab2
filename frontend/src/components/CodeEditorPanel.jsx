import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-base-100 border-t border-base-300 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-5 sm:size-6 shrink-0"
          />
          <select
            className="select select-xs sm:select-sm max-w-[120px] sm:max-w-none"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-xs sm:btn-sm gap-1.5 sm:gap-2 shrink-0"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-3.5 sm:size-4 animate-spin" />
              <span className="hidden xs:inline">Running...</span>
            </>
          ) : (
            <>
              <PlayIcon className="size-3.5 sm:size-4" />
              <span className="hidden xs:inline">Run Code</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;