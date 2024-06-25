import { useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import { nanoid } from "nanoid";
import Editor from "../components/editor";
const Delta = Quill.import("delta");
interface IData {
  content: string;
  id: string;
}
const Experience = () => {
  const [data, setData] = useState<IData[]>([
    {
      content: "121212",
      id: nanoid(),
    },
  ]);
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);

  // Use a ref to access the quill instance directly
  const quillRef = useRef();
  return (
    <div className={s.container}>
      {data.map((item) => {
        return (
          <div className={s.item} key={item.id}>
            {
              <Editor
                id={item.id}
                readOnly={readOnly}
                defaultValue={new Delta().insert(item.content)}
                onSelectionChange={setRange}
                onTextChange={setLastChange}
              />
            }
          </div>
        );
      })}
    </div>
  );
};
export default Experience;
