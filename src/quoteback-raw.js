import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Editor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: true,
        },
        clipboard: {
          matchVisual: false,
        },
      });

      editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        const allowedAttributes = ["class"]; // Add other attributes as needed

        const attributes = node.getAttributeNames();
        const cleanAttributes = attributes.filter((attr) =>
          allowedAttributes.includes(attr)
        );

        const deltaOps = [];

        delta.ops.forEach((op) => {
          if (op.insert && typeof op.insert === "string") {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = op.insert;

            const wrapperChildren = Array.from(wrapper.childNodes);
            wrapperChildren.forEach((childNode) => {
              const cloneNode = childNode.cloneNode();

              cleanAttributes.forEach((attr) => {
                const attrValue = node.getAttribute(attr);
                cloneNode.setAttribute(attr, attrValue);
              });

              deltaOps.push({ insert: cloneNode });
            });
          } else {
            deltaOps.push(op);
          }
        });

        delta.ops = deltaOps;
        return delta;
      });
    }
  }, []);

  return <div ref={editorRef} />;
};

export default Editor;
