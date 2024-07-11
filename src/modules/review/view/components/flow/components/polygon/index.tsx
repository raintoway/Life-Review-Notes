import { useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import { TextArea } from "antd-mobile";
import { revisePort } from "../../../../utils";
const CustomReactPolygon = (props) => {
  const { node, graph } = props;
  const data = node.store.data;
  // console.log(111, node, graph, data);
  const [bottomBox, setBottomBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputBoxRef = useRef(null);
  return (
    <div className={s.container}>
      <div
        onClick={() => {
          setEditBoxVisible(true);
          setBottomBoxVisible(true);
        }}
        className={[s.content, "flex-row-center-center"].join(" ")}
      >
        {editBoxVisible ? (
          <TextArea
            ref={inputBoxRef}
            onChange={(e) => {
              if (inputBoxRef.current) {
                const newHeight =
                  inputBoxRef.current.nativeElement.clientHeight;
                const { width, height } = node.size();
                if ((newHeight * 10) / 5 > height) {
                  node.resize(width, (newHeight * 10) / 5);
                  // revisePort(node);
                }
              }
              setLabel(e);
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

export default CustomReactPolygon;