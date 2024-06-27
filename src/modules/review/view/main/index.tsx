import { useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import FlowEditor from "../components/flow";
interface IData {
  content: string;
  id: string;
}
const Review = () => {
  return <FlowEditor></FlowEditor>;
};
export default Review;
