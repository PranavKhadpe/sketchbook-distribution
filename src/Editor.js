import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./fonts/Outfit-SemiBold.ttf";
import useAutosizeTextArea from "./useAutosizeTextArea";
import QuoteBack from "./QuoteBack.js";

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
  const tagInputRefs = useRef([]);
  useAutosizeTextArea(textAreaRef.current, title);
  // useExternalScripts();

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
    var index = document.querySelectorAll(".quoteback");

    for (var item = 0; item < index.length; item++) {
      // remove the footer element
      console.log(index[item]);
      index[item].removeChild(index[item].querySelector("footer"));

      var text = index[item].innerHTML;

      var url = index[item].cite;
      var author = index[item].getAttribute("data-author");
      var title = index[item].getAttribute("data-title");
      var favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=64`;
      var darkmode = index[item].getAttribute("darkmode");

      // create a new component with that data
      var component = `
      <quoteback-component darkmode="${darkmode}" url="${url}" text="${encodeURIComponent(
        text
      )}" author="${author}" title="${title}" favicon="${favicon}"> 
      </quoteback-component>    
      `;
      var newEl = document.createElement("div");
      newEl.innerHTML = component;

      // replace the original blockquote with our quoteback seed component
      index[item].parentNode.replaceChild(newEl, index[item]);

      var template = document.createElement("template");
      template.innerHTML = `
      <div class="quoteback-container" role="quotation" aria-labelledby="quoteback-author" tabindex="0">
          <div id="quoteback-parent" class="quoteback-parent">
              <div class="quoteback-content"></div>       
          </div>

          <div class="quoteback-head">       
              <div class="quoteback-avatar"><img class="mini-favicon" src=""/></div>     
              <div class="quoteback-metadata">
                  <div class="metadata-inner">
                      <div aria-label="" id="quoteback-author" class="quoteback-author"></div>
                      <div aria-label="" class="quoteback-title"></div>
                  </div>  
              </div>

          <div class="quoteback-backlink"><a target="_blank" aria-label="go to the full text of this quotation" rel="noopener" href="" class="quoteback-arrow">Go to text <span class="right-arrow">&#8594;</span></a></div>
          </div>  
      </div>`;
      if (customElements.get("quoteback-component")) {
        console.log("already defined");
      } else {
        window.customElements.define("quoteback-component", QuoteBack);
      }
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
        // Do something with the updated HTML content
        console.log(html);
      });

      const delta = {
        ops: [
          {
            insert: {
              blockquote: {
                class: "quoteback",
                darkmode: "",
                "data-title": "Quote the web with Quotebacks",
                "data-author": "@ness_labs",
                cite: "https://nesslabs.com/quotebacks",
              },
            },
          },
          {
            insert:
              "The ethos behind Quotebacks is one of the reasons why I love the product. Yes, it’s a great addition to my thinking toolkit, allowing me to store quotes without polluting my note-taking and thinking system. But it’s also a tool which aims at making the Internet a more generous place. If you regularly write online, give it a try!",
          },
          {
            insert: {
              footer: [
                {
                  insert: "@ness_labs",
                },
                {
                  attributes: {
                    cite: "https://nesslabs.com/quotebacks",
                  },
                  insert: {
                    cite: {
                      insert: "https://nesslabs.com/quotebacks",
                      a: {},
                    },
                  },
                },
              ],
            },
          },
        ],
      };

      editor.updateContents(delta);
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
            <button id="quoteback">
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
          <div ref={editorRef} className="quill-editor" />
          <div>
            <blockquote
              class="quoteback"
              darkmode=""
              data-title="Quote the web with Quotebacks"
              data-author="@ness_labs"
              cite="https://nesslabs.com/quotebacks"
            >
              The ethos behind Quotebacks is one of the reasons why I love the
              product. Yes, it’s a great addition to my thinking toolkit,
              allowing me to store quotes without polluting my note-taking and
              thinking system. But it’s also a tool which aims at making the
              Internet a more generous place. If you regularly write online,
              give it a try!
              <footer>
                @ness_labs
                <cite>
                  {" "}
                  <a href="https://nesslabs.com/quotebacks">
                    https://nesslabs.com/quotebacks
                  </a>
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
};

export default Editor;
