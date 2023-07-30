import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./updates-to-quill.css";
import "./fonts/Outfit-SemiBold.ttf";
import "./fonts/EBGaramond-VariableFont_wght.ttf";
import "./fonts/EBGaramond-Italic-VariableFont_wght.ttf";
import useAutosizeTextArea from "./useAutosizeTextArea";
import QuoteBack from "./QuoteBack.js";
import LinkBlot from "./LinkBlot.js";
import Quote from "./Quote.js";
import Delta from "quill-delta";

const Editor = () => {
  const editorRef = useRef(null);
  //add a state variable to store the post title
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [bold, setBold] = useState(0);
  const [italic, setItalic] = useState(0);
  const [underline, setUnderline] = useState(0);
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
    document.querySelector("#toolbar").addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
  }, []);

  async function getQuote(editor) {
    const selection = await editor.getSelection();
    if (selection) {
      const selectedText = await editor.getText(
        selection.index,
        selection.length
      );
      const tooltip = document.createElement("div");
      tooltip.className =
        "tooltip bg-white shadow-md rounded px-1 py-1 w-full max-w-lg";
      const textrow = document.createElement("div");
      textrow.className = "flex flex-wrap -mx-3 mb-1";
      const textrowinnerdiv = document.createElement("div");
      textrowinnerdiv.className = "w-full px-3";
      const textinput = document.createElement("textarea");
      textinput.className =
        "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      textinput.placeholder = "Enter quote text";
      textinput.id = "quote-text";
      textrowinnerdiv.appendChild(textinput);
      textrow.appendChild(textrowinnerdiv);
      tooltip.appendChild(textrow);
      const authorrow = document.createElement("div");
      authorrow.className = "flex flex-wrap -mx-3 mb-1";
      const authornamediv = document.createElement("div");
      authornamediv.className = "w-full md:w-1/2 pl-3";
      const authornameinput = document.createElement("input");
      authornameinput.className =
        "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      authornameinput.placeholder = "Author Name";
      authornameinput.id = "author-name";
      authornamediv.appendChild(authornameinput);
      authorrow.appendChild(authornamediv);
      const titlediv = document.createElement("div");
      titlediv.className = "w-full md:w-1/2 pr-3 pl-1";
      const titleinput = document.createElement("input");
      titleinput.className =
        "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      titleinput.placeholder = "Title";
      titleinput.id = "quote-title";
      titlediv.appendChild(titleinput);
      authorrow.appendChild(titlediv);
      tooltip.appendChild(authorrow);
      const urlrow = document.createElement("div");
      urlrow.className = "flex flex-wrap -mx-3 mb-1";
      const urlnamediv = document.createElement("div");
      urlnamediv.className = "w-full px-3";
      const urlnameinput = document.createElement("input");
      urlnameinput.className =
        "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
      urlnameinput.placeholder = "URL";
      urlnameinput.id = "url";
      urlnamediv.appendChild(urlnameinput);
      urlrow.appendChild(urlnamediv);
      tooltip.appendChild(urlrow);
      const submitBtnrow = document.createElement("div");
      submitBtnrow.className = "flex flex-wrap -mx-3 mb-2";
      const submitBtn = document.createElement("button");
      //add mutliple classes to submitBtn
      submitBtn.className =
        "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-3";
      submitBtn.textContent = "Add Quote";
      submitBtn.addEventListener("click", function () {
        var roughtext = textinput.value;
        roughtext = roughtext.replace(/(\r\n|\n|\r)/gm, " ");
        roughtext = roughtext.replace(/(\s\s)/gm, " ");
        roughtext = roughtext.trim();

        const quoteData = {
          url: urlnameinput.value,
          title: titleinput.value,
          author: authornameinput.value,
          text: roughtext,
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
        //destroy tooltip
        tooltip.remove();
      });
      submitBtnrow.appendChild(submitBtn);
      tooltip.appendChild(submitBtnrow);

      var element = document.getElementById("quill");
      var position = element.getBoundingClientRect();
      var x = position.left;
      var y = position.top;

      // Calculate the position of the tooltip
      const bounds = editor.getBounds(selection.index, selection.length);
      tooltip.style.top = bounds.top + y + "px";
      const editorWidth = document.querySelector(".ql-editor").offsetWidth;
      tooltip.style.left = x + editorWidth + 10 + "px";

      // Add the tooltip to the DOM
      document.body.appendChild(tooltip);

      function handleClickOutside(event) {
        if (!tooltip.contains(event.target)) {
          document.removeEventListener("click", handleClickOutside);
          console.log("click outside");
          tooltip.remove();
        }
      }

      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }
  }

  async function getSelectionEditor(editor) {
    console.log("clicked");
    const selection = await editor.getSelection();
    if (selection) {
      const selectedText = await editor.getText(
        selection.index,
        selection.length
      );
      console.log(selection.index);
      console.log(selectedText);
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip bg-white shadow-md rounded px-1 py-1";
      tooltip.style.fontSize = "0.8rem";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter link URL";
      input.className = "link-input";
      tooltip.appendChild(input);

      const submitBtn = document.createElement("button");
      //add mutliple classes to submitBtn
      submitBtn.className =
        "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded";
      submitBtn.textContent = "Insert";
      submitBtn.style.borderTopLeftRadius = "0px";
      submitBtn.style.borderBottomLeftRadius = "0px";
      submitBtn.addEventListener("click", function () {
        const linkUrl = input.value;
        console.log("Link URL:", linkUrl);
        editor.format("link", linkUrl);
        //destroy tooltip
        tooltip.remove();
      });
      tooltip.appendChild(submitBtn);

      var element = document.getElementById("quill");
      var position = element.getBoundingClientRect();
      var x = position.left;
      var y = position.top;

      // Calculate the position of the tooltip
      const bounds = editor.getBounds(selection.index, selection.length);
      tooltip.style.top = bounds.top + y - 40 + "px";
      tooltip.style.left = bounds.left + x + "px";

      // Add the tooltip to the DOM
      document.body.appendChild(tooltip);

      function handleClickOutside(event) {
        if (!tooltip.contains(event.target)) {
          document.removeEventListener("click", handleClickOutside);
          console.log("click outside");
          tooltip.remove();
        }
      }

      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      const editor = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
        },
      });

      // var old_element = document.getElementById("#link-button");
      // var new_element = old_element.cloneNode(true);
      // old_element.parentNode.replaceChild(new_element, old_element);

      var old_element = document.getElementById("#bold");
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      old_element = document.getElementById("#italic");
      new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      //replace link button with cloneNode
      old_element = document.getElementById("link-button");
      new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      old_element = document.getElementById("quoteback-button");
      new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      old_element = document.getElementById("#underline");
      new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      const boldButton = document.querySelector(".ql-bold");
      const italicButton = document.querySelector(".ql-italic");
      const underlineButton = document.querySelector(".ql-underline");

      const linkButton = document.querySelector(".link");

      linkButton.addEventListener("click", function () {
        getSelectionEditor(editor);
      });

      const QuoteButton = document.querySelector("#quoteback-button");

      QuoteButton.addEventListener("click", function () {
        getQuote(editor);
      });

      boldButton.addEventListener("click", function () {
        setBold((bold) => {
          const newBold = bold === 0 ? 1 : 0;
          editor.format("bold", newBold === 1, "user");
          boldButton.classList.toggle("ql-active", newBold);
          return newBold;
        });
      });

      italicButton.addEventListener("click", function () {
        setItalic((italic) => {
          const newItalic = italic === 0 ? 1 : 0;
          editor.format("italic", newItalic === 1, "user");
          italicButton.classList.toggle("ql-active", newItalic);
          return newItalic;
        });
      });

      underlineButton.addEventListener("click", function () {
        setUnderline((underline) => {
          const newUnderline = underline === 0 ? 1 : 0;
          editor.format("underline", newUnderline === 1, "user");
          underlineButton.classList.toggle("ql-active", newUnderline);
          return newUnderline;
        });
      });

      // editor.on("text-change", () => {
      //   const html = editor.root.innerHTML;
      //   console.log(html);
      //   // handleQuoteBackRender();
      // });

      // editor.root.addEventListener("keydown", (event) => {
      //   if (event.key === "Backspace") {
      //     event.preventDefault();
      //     const selection = editor.getSelection();
      //     const [line, offset] = editor.getLine(selection.index);
      //     // console.log(line);
      //     const prevBlot = 0;

      //     if (
      //       offset === 0 &&
      //       line.domNode.classList.contains("quoteback-container")
      //     ) {
      //       event.preventDefault();
      //       console.log("hehe");
      //       const confirmation = window.confirm(
      //         "Are you sure you want to delete this quote?"
      //       );

      //       if (confirmation) {
      //         editor.deleteText(line.length() - 1, 1, Quill.sources.USER);
      //       }
      //     }
      //   }
      // });
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

      // document
      //   .querySelector("#quoteback-button")
      //   .addEventListener("click", handlequotebackClick);
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
            <select class="ql-size">
              <option value="small"></option>
              <option selected></option>
              <option value="large"></option>
              <option value="huge"></option>
            </select>
            <button id="#bold" class="ql-bold"></button>
            <button id="#italic" class="ql-italic"></button>
            <button id="#underline" class="ql-underline"></button>
            <button class="ql-script" value="sub"></button>
            <button class="ql-script" value="super"></button>
            <button id="link-button" class="link">
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
            id="quill"
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
