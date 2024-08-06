import { useCallback, useContext, useEffect, useState } from "react";
import Review, { ICategory, ICollection } from ".";
import { StorageContext } from "../../../../App";

export interface IExperience {
  id: string;
  content: string;
}
const WrapReview = () => {
  const [initFlag, setInitFlag] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string[]>([]);
  const [category, setCategory] = useState<ICategory[]>([]);
  const { localStorage } = useContext(StorageContext);
  const initData = useCallback(async () => {
    if (localStorage) {
      const data = await localStorage.getData("review", "category");
      const _activeCategory = (await localStorage.getData(
        "review",
        "activeCategory"
      )) as string[];
      if (Array.isArray(data)) {
        setCategory(data as ICategory[]);
      }
      if (_activeCategory) {
        setActiveCategory(_activeCategory);
      }
      setInitFlag(true);
    }
  }, [localStorage]);
  useEffect(() => {
    initData();
  }, [localStorage, initData]);
  return initFlag && localStorage ? (
    <Review
      category={category}
      activeCategory={activeCategory}
      localStorage={localStorage}
    ></Review>
  ) : null;
};
export default WrapReview;
