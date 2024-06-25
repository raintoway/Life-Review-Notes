import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import s from './index.module.scss'
const modules = {
  toolbar: [
    [
      { header: 1 },
      { header: 2 },
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      { list: "ordered" },
      { list: "bullet" },
      "image",
    ],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
const style = {
  fontSize: "20px", // 这里设置默认字体大小
};
function Editor({
  value,
  setValue,
}: {
  value: string;
  setValue: (content: string) => void;
}) {
  const containerRef = useRef(null);
  return (
    <div ref={containerRef} className={s.container}>
      <ReactQuill
        onFocus={() => {
          if (containerRef.current) {
            console.log(111);
            
            const container = containerRef.current;
            container.querySelector(".ql-toolbar").style.opacity = 1;
            container.querySelector(".ql-toolbar").style.visibility = "visible";
            container.querySelector(".ql-toolbar").style.animation =
              "fadeInOut 1s ease-in-out;";
          }
        }}
        onBlur={() => {
          if (containerRef.current) {
            const container = containerRef.current;
            container.querySelector(".ql-toolbar").style.opacity = 0;
            container.querySelector(".ql-toolbar").style.visibility = "hidden";
            container.querySelector(".ql-toolbar").style.animation =
              "fadeInOut 1s ease-in-out;";
          }
        }}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        style={style}
      />
    </div>
  );
}
export default Editor;
