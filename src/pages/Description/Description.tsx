import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/ext-language_tools";

import DOMPurify from "dompurify";
import { useState } from "react";
import AceEditor from "react-ace";
import Markdown from "react-markdown";
import remarkRehype from "remark-rehype";

export default function Description({ text }: { text: string }) {
  const [activeTab, setActiveTab] = useState("statement");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const stopDragging = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const onDrag = (e: { clientX: number }) => {
    if (!isDragging) return;

    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 10 && newLeftWidth < 90) {
      setLeftWidth(newLeftWidth);
    }
  };

  function isActiveTab(tabname: string) {
    if (activeTab === tabname) {
      return "tab tab-active";
    } else {
      return "tab";
    }
  }
  const clean = DOMPurify.sanitize(text);

  return (
    <div
      className="container flex bg-base-200 w-full h-[100vh]"
      onMouseMove={onDrag}
      onMouseUp={stopDragging}
    >
      <div
        className="left-panel flex flex-col min-h-full border-gray-500 border-[1px] rounded-md "
        style={{ width: `${leftWidth}%` }}
      >
        <div
          role="tablist"
          className="tabs tabs-box border-base-100 border-b-2"
        >
          <button
            className={isActiveTab("statement")}
            onClick={() => setActiveTab("statement")}
          >
            Statement
          </button>
          <button
            className={isActiveTab("solutions")}
            onClick={() => setActiveTab("solutions")}
          >
            Solutions
          </button>
          <button
            className={isActiveTab("submissions")}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
        </div>
        <div className="markdownViewer overflow-x-auto p-[20px]">
          <Markdown rehypePlugins={[remarkRehype]}>{clean}</Markdown>
        </div>
      </div>
      <div
        className="divider h-full cursor-col-resize w-[2px] "
        onMouseDown={startDragging}
        style={{
          backgroundColor: isDragging ? "royalblue" : "white",
        }}
      ></div>
      <div
        className="right-panel h-full w-full border-gray-500 border-[1px] rounded-md m-0.5"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <div className="editor flex size-full">
          <AceEditor
            height="100%"
            width="100%"
            mode="javascript"
            theme="solarized_dark"
            editorProps={{ $blockScrolling: true }}
            showPrintMargin={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}
