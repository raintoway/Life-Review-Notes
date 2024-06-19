import Quill from "quill";
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

export const toolbarConfig = ["bold", "italic", "underline", "strike"];
// Editor is an uncontrolled React component
const Editor = ({
  id,
  readOnly,
  defaultValue,
  onTextChange,
  onSelectionChange,
}) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onTextChange);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const quillRef = useRef<Quill>();

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
    onSelectionChangeRef.current = onSelectionChange;
  });
  useEffect(() => {
    quillRef.current?.enable(!readOnly);
  }, [readOnly]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        theme: "snow",
        modules: {
          toolbar: false,
        },
      });

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }
      quill.enable(!readOnly);

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });
      quillRef.current = quill;

      return () => {
        container.innerHTML = "";
      };
    }
  }, []);

  return <div ref={containerRef}></div>;
};

Editor.displayName = "Editor";

export default Editor;
