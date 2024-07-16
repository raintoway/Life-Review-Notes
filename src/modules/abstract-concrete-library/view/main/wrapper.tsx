import { useContext, useEffect, useState } from "react";
import AbstractConcreteLibrary, {
  ITransform,
  defaultTransform,
  type IData,
} from "./index";
import { StorageContext } from "../../../../App";

const WrapAbstractConcreteLibrary = () => {
  const [initFlag, setInitFlag] = useState(false);
  const [data, setData] = useState<IData[]>([]);
  const [transform, setTransform] = useState<ITransform>(defaultTransform);
  const { localStorage } = useContext(StorageContext);
  const initData = async () => {
    if (localStorage) {
      const data = await localStorage.getData(
        "abstract-concrete-library",
        "data"
      );

      if (Array.isArray(data)) {
        setData(data as IData[]);
      }
      const transform = (await localStorage.getData(
        "abstract-concrete-library",
        "transform"
      )) as ITransform;
      if (transform) {
        setTransform(transform);
      }
      setInitFlag(true);
    }
  };
  useEffect(() => {
    initData();
  }, [localStorage]);
  return initFlag && localStorage ? (
    <AbstractConcreteLibrary
      data={data}
      transform={transform}
      localStorage={localStorage}
    ></AbstractConcreteLibrary>
  ) : null;
};
export default WrapAbstractConcreteLibrary;
