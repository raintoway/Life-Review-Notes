import React, { useRef, useState } from "react";
import s from "./wrapper.module.scss";

type Props = {};

export interface IExperience {
  id: string;
  content: string;
}
const WrapReview = () => {
  const [data, setData] = useState<IExperience[]>([
    {
      id: "f89f1f42-d045-4179-8ba5-8c738479e288",
      content: "Browse all pro",
    },
    {
      id: "faa464e4-88c7-43e1-af2c-1c7752a1931f",
      content: "Filip",
    },
    {
      id: "8d1d5289-2aba-40bc-bdce-5311540996a2",
      content: "My link",
    },
    {
      id: "d23c968c-1ad3-443f-b547-cf89839ad46b",
      content: "Home",
    },
  ]);
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    console.log(111, source, destination);
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    if (sourceIndex === destinationIndex) return;
    const sourceIndexEle = data[sourceIndex];
    data.splice(sourceIndex, 1);
    const newDestinationIndex = destinationIndex;
    data.splice(newDestinationIndex, 0, sourceIndexEle);
    setData([...data]);
  };
  const handleClick = (e) => {
    e.preventDefault();
    const editor = e.target.parentNode.querySelector(".ql-editor p");
    console.log("click", e, editor);
  };

  return <div className={s.wrapper}>复盘记录</div>;
};
export default WrapReview;
