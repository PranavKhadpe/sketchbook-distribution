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
import ImageUploader from "quill-image-uploader";
import { makeStyles, Button } from "@fluentui/react-components";
import {
  Save20Filled,
  Eye20Filled,
  Add20Regular,
  ArrowRight16Filled,
  Delete20Filled,
} from "@fluentui/react-icons";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

const saveBlogPost = (
  id,
  title,
  tags,
  content,
  quillcontent,
  date,
  updateDate,
  published
) => {
  axios
    .post("http://<app-name>.azurewebsites.net/save", {
      id,
      title,
      tags,
      content,
      quillcontent,
      date,
      updateDate,
      published,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.message == "Post saved") {
        window.location.href = `./?id=${response.data.articleId}`;
      }
    })
    .catch((error) => {
      console.error("Error saving blog post:", error);
    });
};

const deleteBlogPost = (id) => {
  axios
    .delete(`http://<app-name>.azurewebsites.net/post/${id}`)
    .then((response) => {
      console.log(response.data);
      window.location.href = `./`;
    })
    .catch((error) => {
      console.error("Error deleting blog post:", error);
    });
};

const Editor = () => {
  const editorRef = useRef(null);
  //add a state variable to store the post title
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(moment().format("LL"));
  const [updateDate, setUpdateDate] = useState(moment().format("LL"));
  const [retrievedContent, setRetrievedContent] = useState("");
  const [retrievedDelta, setRetrievedDelta] = useState(null);
  const [tags, setTags] = useState([]);
  const [bold, setBold] = useState(0);
  const [italic, setItalic] = useState(0);
  const [underline, setUnderline] = useState(0);
  const [bullet, setBullet] = useState(0);
  const [order, setOrder] = useState(0);
  const textAreaRef = useRef(null);
  const [activeTagIndex, setActiveTagIndex] = useState(null);
  const [editorHtml, setEditorHtml] = useState("");
  const [editorContent, setEditorContent] = useState(null);
  const [quillInstance, setQuillInstance] = useState(null);
  const [searchParams] = useSearchParams();
  const [articleid, setArticleId] = useState(null);
  const [published, setPublished] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://<app-name>.azurewebsites.net/allposts")
      .then((response) => {
        setAllPosts(response.data);
      });
  }, []);

  const tagInputRefs = useRef([]);
  useAutosizeTextArea(textAreaRef.current, title);

  // useExternalScripts();
  LinkBlot.blotName = "link";
  LinkBlot.tagName = "a";

  async function getBlogPost(id) {
    axios
      .get(`http://<app-name>.azurewebsites.net/post/${id}`)
      .then((response) => {
        const blogPost = response.data;
        console.log(blogPost.quillcontent);
        setTitle(blogPost.title);
        setTags(blogPost.tags);
        setRetrievedContent(blogPost.content);
        setRetrievedDelta(blogPost.quillcontent);
        if (blogPost.publishingstatus == 0 || blogPost.publishingstatus == 1) {
          setPublished(blogPost.publishingstatus);
        }
        if (blogPost.creationtime) {
          setDate(blogPost.creationtime);
        }
      })
      .catch((error) => {
        console.error("Error retrieving blog post:", error);
      });
  }

  Quill.register(LinkBlot);
  Quill.register(Quote);
  Quill.register("modules/imageUploader", ImageUploader);

  useEffect(() => {
    console.log(editorHtml);
  }, [editorHtml]);

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
    if (!loaded) {
      if (quillInstance) {
        if (retrievedDelta) {
          quillInstance.setContents(retrievedDelta);
          console.log(retrievedDelta);
          setLoaded(true);
        }
      }
    }
  }, [quillInstance, retrievedDelta, loaded]);

  useEffect(() => {
    document.querySelector("#toolbar").addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    const article_id = searchParams.get("id");
    console.log(article_id);
    getBlogPost(article_id);
    setArticleId(article_id);
  }, [searchParams]);

  async function getQuote(editor) {
    const selection = await editor.getSelection();
    if (selection) {
      const selectedText = await editor.getText(
        selection.index,
        selection.length
      );
      const tooltip = document.createElement("div");
      tooltip.className =
        "tooltip bg-white shadow-md rounded px-1 py-1 w-full max-w-lg tooltip-text";
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
          console.log(editor.getContents());
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
      submitBtn.style.fontSize = "1.2rem";
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
      var old_element = document.getElementById("#image");
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      const editor = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
          imageUploader: {
            upload: (file) => {
              return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("image", file);

                fetch("https://api.imgbb.com/1/upload?key=YOUR_API_KEY", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((result) => {
                    console.log(result);
                    resolve(result.data.url);
                  })
                  .catch((error) => {
                    reject("Upload failed");
                    console.error("Error:", error);
                  });
              });
            },
          },
        },
      });

      setQuillInstance(editor);

      editor.on("text-change", function () {
        setEditorContent(editor.getContents());
        setEditorHtml(editor.root.innerHTML);
      });

      old_element = document.getElementById("#bold");
      new_element = old_element.cloneNode(true);
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

      old_element = document.getElementById("ordered");
      new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      old_element = document.getElementById("bulleted");
      new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      // old_element = document.getElementById("ql-size");
      // new_element = old_element.cloneNode(true);
      // old_element.parentNode.replaceChild(new_element, old_element);

      const boldButton = document.querySelector(".ql-bold");
      const italicButton = document.querySelector(".ql-italic");
      const underlineButton = document.querySelector(".ql-underline");
      const bulletButton = document.querySelector("#bulleted");
      const listButton = document.querySelector("#ordered");
      const sizeDropdown = document.querySelector(".ql-picker-label");
      const sizeChangeButtons = document.querySelectorAll(".ql-picker-item");

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

      bulletButton.addEventListener("click", function () {
        setBullet((bullet) => {
          const newBullet = bullet === 0 ? 1 : 0;
          if (newBullet === 1) {
            editor.format("list", "bullet", "user");
          } else {
            editor.format("list", false);
          }
          bulletButton.classList.toggle("ql-active", newBullet);
          return newBullet;
        });
      });

      listButton.addEventListener("click", function () {
        setOrder((order) => {
          const newOrder = order === 0 ? 1 : 0;
          if (newOrder === 1) {
            editor.format("list", "ordered", "user");
          } else {
            editor.format("list", false);
          }
          listButton.classList.toggle("ql-active", newOrder);
          return newOrder;
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

      sizeChangeButtons.forEach(function (sizeChanger) {
        sizeChanger.addEventListener("click", function () {
          console.log("changed");
          if (sizeChanger.dataset.value == undefined) {
            console.log("Dropdown changed to:", "Normal");
            editor.format("size", false, "user");
          } else {
            console.log("Dropdown changed to:", sizeChanger.dataset.value);
            editor.format("size", sizeChanger.dataset.value, "user");
          }
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
    }
  }, []);

  useEffect(() => {
    if (activeTagIndex !== null && tagInputRefs.current[activeTagIndex]) {
      tagInputRefs.current[activeTagIndex].focus();
    }
  }, [activeTagIndex]);

  const savecurrentpost = () => {
    saveBlogPost(
      articleid,
      title,
      tags,
      editorHtml,
      editorContent,
      date,
      updateDate,
      published
    );
  };

  const deletecurrentpost = () => {
    deleteBlogPost(articleid);
  };

  const handleTagEdit = (index, event) => {
    const updatedTags = [...tags];
    updatedTags[index] = event.target.value;
    setTags(updatedTags);
  };

  const handleTagClick = (index) => {
    setActiveTagIndex(index);
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="flex" style={{ width: "100%" }}>
        <div className="library">
          <div className="new-button">
            <a href=".">
              <Button icon={<Add20Regular />}>New</Button>
            </a>
          </div>
          <div className="draft-caption">Drafts:</div>
          {allPosts.map((post) => (
            <div className="library-links">
              {/* <ArrowRight16Filled /> */}
              <a
                key={post._id}
                href={`./?id=${post._id}`}
                className="post-link"
              >
                {post.title}
              </a>
            </div>
          ))}
        </div>
        <div className="container">
          <div
            className="flex"
            style={{
              width: "150%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div id="toolbar" className="w-2/3">
              {/* Render your custom toolbar components here */}
              {/* For example, you can include buttons for formatting, etc. */}
              <select id="ql-size" className="ql-size">
                <option value="small"></option>
                <option selected></option>
                <option value="large"></option>
                <option value="huge"></option>
              </select>
              <button id="#bold" className="ql-bold"></button>
              <button id="#italic" className="ql-italic"></button>
              <button id="#underline" className="ql-underline"></button>
              <button className="ql-script" value="sub"></button>
              <button className="ql-script" value="super"></button>
              <button id="ordered" className="ql-list" value="ordered"></button>
              <button id="bulleted" className="ql-list" value="bullet"></button>
              <button id="link-button" className="link">
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
              <button id="#image" class="ql-image"></button>
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
            <div
              className="w-1/3"
              style={{
                display: "flex",
                justifyContent: "start",
                height: "42px",
              }}
            >
              <Button
                appearance="outline"
                style={{ marginRight: "1rem", marginLeft: "1rem" }}
                onClick={() => {
                  if (published == 0) {
                    setPublished(1);
                  } else {
                    setPublished(0);
                  }
                }}
              >
                {published == 1 ? "Hide" : "Publish"}
              </Button>
              <Button
                appearance="outline"
                icon={<Save20Filled />}
                onClick={savecurrentpost}
              >
                Save
              </Button>
              {articleid && (
                <Button
                  appearance="outline"
                  icon={<Delete20Filled />}
                  onClick={deletecurrentpost}
                  style={{ marginLeft: "2rem" }}
                >
                  Delete
                </Button>
              )}
            </div>
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
                  lineHeight: "1.3",
                  fontSize: "2.5rem",
                  overflow: "hidden",
                  fontVariantNumeric: "lining-nums",
                }}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div id="date-tag">
              <em>{date}</em>
            </div>
            {tags.map((tag, index) => (
              <button
                key={index}
                className={`tag-button ${
                  activeTagIndex === index
                    ? "active border-dotted border-2 border-gray-800 text-gray-800 font-bold py-2 px-4 mr-2 rounded inline-flex items-center"
                    : "bg-gray-300 border-solid border-2 border-gray-300 text-gray-800 font-bold py-2 px-4 mr-2 rounded inline-flex items-center"
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
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mr-4 rounded inline-flex items-center"
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
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
