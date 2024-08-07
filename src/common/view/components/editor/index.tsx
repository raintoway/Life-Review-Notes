// @ts-nocheck
import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import s from "./index.module.scss";
import { CloseCircleOutline } from "antd-mobile-icons";
import { Dialog } from "antd-mobile";
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
  clipboard: {
    matchVisual: false,
  },
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

function Editor({
  value,
  setValue,
  deleteCurrent,
}: {
  value: string;
  setValue: (content: string) => void;
  deleteCurrent?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const style = {
    fontSize: "20px", // 这里设置默认字体大小
    width: "100%",
  };
  return (
    <div
      ref={containerRef}
      className={[s.container, "experience-item"].join(" ")}
      onClick={(e) => {
        if (!deleteCurrent) return;
        try {
          const currentTarget = e.currentTarget;
          (currentTarget.children[0] as HTMLElement).style.width =
            "calc(100% - 30px)";
          (currentTarget.children[1] as HTMLElement).style.display = "block";
          const allExperienceItem =
            document.querySelectorAll(".experience-item");
          Array.prototype.slice.call(allExperienceItem).forEach((item) => {
            if (item !== currentTarget) {
              item.children[0].style.width = "100%";
              item.children[1].style.display = "none";
            }
          });
        } catch (err) {}
      }}
    >
      <ReactQuill
        onFocus={() => {
          const container = containerRef.current;
          if (container) {
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
      {deleteCurrent ? (
        <CloseCircleOutline
          className={[s.delBtn].join(" ")}
          onClick={() => {
            Dialog.show({
              content: (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "1.2rem",
                    color: "#6f6d6d",
                    fontWeight: "bold",
                  }}
                >
                  确定删除这条经验吗？
                </p>
              ),
              closeOnAction: true,
              closeOnMaskClick: true,
              actions: [
                [
                  {
                    key: "cancel",
                    text: "取消",
                    style: { color: "#6f6d6d" },
                  },
                  {
                    key: "delete",
                    text: "确定",
                    style: { color: "pink" },
                    onClick: () => {
                      deleteCurrent();
                    },
                  },
                ],
              ],
            });
          }}
        />
      ) : null}
    </div>
  );
}
export default Editor;
