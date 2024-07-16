import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import s from "./wrapper.module.scss";
import Review, { ICollection } from ".";
import { StorageContext } from "../../../../App";

export interface IExperience {
  id: string;
  content: string;
}
const WrapReview = () => {
  const [initFlag, setInitFlag] = useState(false);
  const [data, setData] = useState<ICollection[]>([]);
  const [currentCollectionKey, setCurrentCollectionKey] = useState<string>("");
  const { localStorage } = useContext(StorageContext);
  const initData = useCallback(async () => {
    if (localStorage) {
      const data = await localStorage.getData("review", "data");
      const _currentCollectionKey = (await localStorage.getData(
        "review",
        "currentCollectionKey"
      )) as string;
      if (Array.isArray(data)) {
        setData(data as ICollection[]);
      }
      if (_currentCollectionKey) {
        setCurrentCollectionKey(_currentCollectionKey);
      }
      setInitFlag(true);
    }
  }, [localStorage]);
  useEffect(() => {
    initData();
  }, [localStorage, initData]);
  return initFlag && localStorage ? (
    <Review
      data={data}
      currentCollectionKey={currentCollectionKey}
      localStorage={localStorage}
    ></Review>
  ) : null;
};
export default WrapReview;
