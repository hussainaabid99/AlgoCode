import "ace-builds/src-noconflict/ace";
//languages
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
//themes
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";

import DOMPurify from "dompurify";
import { useState } from "react";
import AceEditor from "react-ace";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { languages } from "../../constants/Languages";
import { themes } from "../../constants/themes";

type languageType = {
  languageName: string;
  languageValue: string;
};

type themeType = {
  themeName: string;
  themeValue: string;
};

export default function Description({ text }: { text: string }) {
  const [activeTab, setActiveTab] = useState("statement");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("solarized_dark");
  const [fontSize, setFontSize] = useState(18);

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
          <Markdown rehypePlugins={[rehypeRaw]}>{clean}</Markdown>
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
        className="right-panel flex flex-col min-h-full border-gray-500 border-[1px] rounded-md"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <div className="my-2 mx-3 flex align-content gap-2 overflow-visible">
          <button className="btn btn-sm bg-base-100 btn-neutral ">Run</button>
          <button className="btn btn-sm bg-base-100 btn-neutral ">
            Submit
          </button>
          <select
            value={language}
            className="select-sm bg-base-100 border-gray-600 border-1 rounded-md"
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((language: languageType) => (
              <option
                key={language.languageValue}
                value={language.languageValue}
              >
                {language.languageName}
              </option>
            ))}
          </select>
          <select
            value={theme}
            className="select-sm bg-base-100 border-gray-600 border-1 rounded-md"
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map((theme: themeType) => (
              <option key={theme.themeValue} value={theme.themeValue}>
                {theme.themeName}
              </option>
            ))}
          </select>
          <select
            value={fontSize}
            className="select-sm bg-base-100 border-gray-600 border-1 rounded-md"
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            <option value={14}>14</option>
            <option value={16}>16</option>
            <option value={20}>20</option>
            <option value={24}>24</option>
            <option value={28}>28</option>
            <option value={32}>32</option>
            <option value={40}>40</option>
          </select>
        </div>
        <div className="editor flex size-full">
          <AceEditor
            height="100%"
            width="100%"
            mode="javascript"
            theme={theme}
            fontSize={fontSize}
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
