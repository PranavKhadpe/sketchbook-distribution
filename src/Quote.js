import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");
const Link = Quill.import("formats/link");

class Quote extends BlockEmbed {
  static blotName = "qb";
  static tagName = "DIV";
  static className = "quoteback-container";

  static create(value) {
    const node = super.create(value);
    node.setAttribute("role", "quotation");
    node.setAttribute("aria-labelledby", "quoteback-author");
    node.setAttribute("tabindex", "0");
    node.setAttribute("contenteditable", "false");

    const parent = document.createElement("div");
    parent.classList.add("quoteback-parent");
    parent.setAttribute("id", "quoteback-parent");

    const content = document.createElement("div");
    content.classList.add("quoteback-content");

    content.innerHTML = value.text;
    parent.appendChild(content);
    node.appendChild(parent);

    const head = document.createElement("div");
    head.classList.add("quoteback-head");

    const avatar = document.createElement("div");
    avatar.classList.add("quoteback-avatar");

    const img = document.createElement("img");
    img.classList.add("mini-favicon");
    img.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain_url=${value.url}&sz=64`
    );
    avatar.appendChild(img);
    head.appendChild(avatar);

    const metadata = document.createElement("div");
    metadata.classList.add("quoteback-metadata");

    const inner = document.createElement("div");
    inner.classList.add("metadata-inner");

    const author = document.createElement("div");
    author.classList.add("quoteback-author");
    author.setAttribute("aria-label", `quote by ${value.author}`);
    author.innerHTML = value.author;
    author.setAttribute("id", "quoteback-author");
    inner.appendChild(author);

    const title = document.createElement("div");
    title.classList.add("quoteback-title");
    title.setAttribute("aria-label", `title: ${value.title}`);
    title.innerHTML = value.title;
    inner.appendChild(title);

    metadata.appendChild(inner);
    head.appendChild(metadata);

    const backlink = document.createElement("div");
    backlink.classList.add("quoteback-backlink");

    const blink = document.createElement("a");
    blink.setAttribute("href", `${value.url}`);
    blink.setAttribute("target", "_blank");
    blink.setAttribute("rel", "noopener");
    blink.setAttribute("aria-label", "go to the full text of the quotation");
    blink.classList.add("quoteback-arrow");
    blink.innerHTML = "Go to text";
    const arrow = document.createElement("span");
    arrow.innerHTML = "→";

    blink.appendChild(arrow);
    backlink.appendChild(blink);
    head.appendChild(backlink);
    node.appendChild(head);

    return node;
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(node) {
    const contentNode = node.querySelector(".quoteback-content");
    const authorNode = node.querySelector(".quoteback-author");
    const titleNode = node.querySelector(".quoteback-title");
    const backlinkNode = node.querySelector(".quoteback-backlink a");

    return {
      text: contentNode ? contentNode.innerHTML : "",
      author: authorNode ? authorNode.innerHTML : "",
      title: titleNode ? titleNode.innerHTML : "",
      url: backlinkNode ? backlinkNode.getAttribute("href") : "",
    };
  }
}

export default Quote;
