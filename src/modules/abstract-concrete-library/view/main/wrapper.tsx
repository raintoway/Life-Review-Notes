import { useContext, useEffect, useState } from "react";
import AbstractConcreteLibrary, {
  ICategory,
  ITransform,
  defaultTransform,
  type IData,
} from "./index";
import { StorageContext } from "../../../../App";

const WrapAbstractConcreteLibrary = () => {
  const [initFlag, setInitFlag] = useState(false);
  const [category, setCategory] = useState<ICategory[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [transform, setTransform] = useState<ITransform>(defaultTransform);
  const { localStorage } = useContext(StorageContext);
  const initData = async () => {
    if (localStorage) {
      const data = await localStorage.getData(
        "abstract-concrete-library",
        "category"
      );

      if (Array.isArray(data)) {
        setCategory(data as ICategory[]);
      }
      const _activekey = (await localStorage.getData(
        "abstract-concrete-library",
        "activeKey"
      )) as string;
      if (transform) {
        setActiveKey(_activekey);
      }
      setInitFlag(true);
    }
  };
  useEffect(() => {
    initData();
  }, [localStorage]);
  return initFlag && localStorage ? (
    <AbstractConcreteLibrary
      category={category}
      activeKey={activeKey}
      localStorage={localStorage}
    ></AbstractConcreteLibrary>
  ) : null;
};
export default WrapAbstractConcreteLibrary;
