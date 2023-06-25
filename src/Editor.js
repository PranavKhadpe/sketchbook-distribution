import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./updates-to-quill.css";
import "./fonts/Outfit-SemiBold.ttf";
import useAutosizeTextArea from "./useAutosizeTextArea";
import QuoteBack from "./QuoteBack.js";
import LinkBlot from "./LinkBlot.js";
import Quote from "./Quote.js";
import Delta from "quill-delta";

const Editor = () => {
  const editorRef = useRef(null);
  //add a state variable to store the post title
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([
    "decision analysis",
    "bayesian statistics",
    "interpretability",
  ]);
  const textAreaRef = useRef(null);
  const [activeTagIndex, setActiveTagIndex] = useState(null);
  // const [numquotes, setNumquotes] = useState(0);
  const tagInputRefs = useRef([]);
  useAutosizeTextArea(textAreaRef.current, title);
  // useExternalScripts();
  LinkBlot.blotName = "link";
  LinkBlot.tagName = "a";

  Quill.register(LinkBlot);
  Quill.register(Quote);

  useEffect(() => {
    if (textAreaRef.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.current.style.height = scrollHeight + 3 + "px";
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const editor = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
        },
      });

      editor.on("text-change", () => {
        const html = editor.root.innerHTML;
        console.log(html);
        // handleQuoteBackRender();
      });

      const handleLinkClick = () => {
        const value = prompt("Enter link URL");
        editor.format("link", value);
      };

      const handlequotebackClick = () => {
        const quoteData = {
          url: "https://arxiv.org/pdf/2303.06794.pdf",
          title:
            "Sensing Wellbeing in the Workplace, Why and For Whom? Envisioning Impacts with Organizational Stakeholders",
          author: "Anna Kawakami",
          text: `However, in the human-computer interaction (HCI), ubiquitous computing (UbiComp), and computer-supported cooperative work (CSCW) literature, where many such sensing innovations are blossoming on the technical front [20, 21, 119, 126, 160], there is an inadequate empirical understanding of how everyday workers envision passive sensing-based wellbeing technologies may live within a socio-ecological context`,
        };

        const range = editor.getSelection(true);

        if (range) {
          editor.updateContents(
            new Delta()
              .retain(range.index)
              .delete(range.length)
              .insert({ qb: quoteData })
          );
        }
      };

      //when the link button is clicked, call the handleLinkClick function
      document
        .querySelector("#link-button")
        .addEventListener("click", handleLinkClick);

      document
        .querySelector("#quoteback-button")
        .addEventListener("click", handlequotebackClick);
    }
  }, []);

  useEffect(() => {
    if (activeTagIndex !== null && tagInputRefs.current[activeTagIndex]) {
      tagInputRefs.current[activeTagIndex].focus();
    }
  }, [activeTagIndex]);

  const handleTagEdit = (index, event) => {
    const updatedTags = [...tags];
    updatedTags[index] = event.target.value;
    setTags(updatedTags);
  };

  const handleTagClick = (index) => {
    setActiveTagIndex(index);
  };

  //   const handleTagExit = (index) => {
  //     setActiveTagIndex(null);
  //   };

  return (
    <div style={{ width: "100%" }}>
      <div className="flex" style={{ width: "100%" }}>
        <div className="w-1/3"></div>
        <div className="w-1/3">
          <div id="toolbar" style={{ width: "100%" }}>
            {/* Render your custom toolbar components here */}
            {/* For example, you can include buttons for formatting, etc. */}
            <button className="ql-bold">Bold</button>
            <button className="ql-italic">Italic</button>
            <button className="ql-underline">Underline</button>
            <button id="link-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
            <button id="quoteback-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ border: "1px solid black" }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h13M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div>
            <div id="title">
              <textarea
                type="text"
                value={title}
                ref={textAreaRef}
                placeholder="Enter a title..."
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  resize: "none",
                  lineHeight: "1",
                  fontSize: "2rem",
                  overflow: "hidden",
                }}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            {tags.map((tag, index) => (
              <button
                key={index}
                className={`tag-button ${
                  activeTagIndex === index
                    ? "active border-dotted border-2 border-gray-800 text-gray-800 font-bold py-2 px-4 mb-4 mr-2 rounded inline-flex items-center"
                    : "bg-gray-300 border-solid border-2 border-gray-300 text-gray-800 font-bold py-2 px-4 mb-4 mr-2 rounded inline-flex items-center"
                }`}
                style={{ pointerEvents: "none" }}
              >
                <input
                  ref={(ref) => (tagInputRefs.current[index] = ref)}
                  type="text"
                  className="tag-input"
                  value={tag}
                  style={{
                    fontFamily: "Outfit-Light",
                    fontWeight: "100",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    cursor: "pointer",
                    pointerEvents: "auto",
                    width: `${tag.length * 7 + 24}px`,
                  }}
                  onClick={() => handleTagClick(index)}
                  onChange={(e) => handleTagEdit(index, e)}
                />
                {activeTagIndex === index ? (
                  <span
                    style={{ pointerEvents: "auto" }}
                    onClick={() => {
                      setActiveTagIndex(null);
                    }}
                  >
                    +
                  </span>
                ) : (
                  <span
                    className="cancel-symbol"
                    style={{ pointerEvents: "auto" }}
                    onClick={() => {
                      // Remove the tag from the tags array
                      const updatedTags = [...tags];
                      updatedTags.splice(index, 1);
                      setTags(updatedTags);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000000"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mb-4 mr-4 rounded inline-flex items-center"
              onClick={() => {
                setTags([...tags, "Click to edit"]);
                setActiveTagIndex(tags.length);
              }}
            >
              <span style={{ fontFamily: "Outfit-Light", fontWeight: "100" }}>
                +tag
              </span>
            </button>
          </div>
          <div
            ref={editorRef}
            className="quill-editor"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
};

export default Editor;
