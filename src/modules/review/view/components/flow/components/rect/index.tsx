import { useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import { TextArea } from "antd-mobile";
import React from "react";
import { FlowEditorContext } from "../..";
const CustomReactRect = (props) => {
  const { node, graph } = props;
  const data = node.store.data;
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputBoxRef = useRef(null);
  const { syncToStorage } = React.useContext(FlowEditorContext);
  return (
    <div className={s.container}>
      <div
        onClick={() => {
          setEditBoxVisible(true);
        }}
        className={[s.content, "flex-row-center-center"].join(" ")}
      >
        {editBoxVisible ? (
          <TextArea
            ref={inputBoxRef}
            onChange={(e) => {
              if (inputBoxRef.current) {
                const newHeight =
                  inputBoxRef.current.nativeElement.clientHeight + 30;
                const { width, height } = node.size();
                if (height === newHeight) {
                } else {
                  node.resize(width, newHeight);
                }
              }
              setLabel(e);
              data.label = e;
              syncToStorage(graph);
            }}
            value={label}
            className={s.inputBox}
            id={node.id}
            rows={1}
            autoSize={true}
          />
        ) : (
          data.label
        )}
      </div>
    </div>
  );
};

export default CustomReactRect;
