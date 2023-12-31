import Quill from "quill";

let Inline = Quill.import("blots/inline");

class LinkBlot extends Inline {
  static create(value) {
    let node = super.create();
    // Sanitize url value if desired
    node.setAttribute("href", value);
    node.setAttribute(
      "style",
      "color: black; border-bottom: 0.08em solid rgba(127, 127, 127, 0.2); text-decoration: none;"
    );
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute("target", "_blank");
    return node;
  }

  static formats(node) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute("href");
  }
}

export default LinkBlot;
