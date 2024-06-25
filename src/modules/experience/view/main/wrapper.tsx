import { useContext, useEffect, useState } from "react";
import Experience, { type IExperience } from "./index";
import { MyContext } from "../../../../App";

const WrapExperience = () => {
  const [initFlag, setInitFlag] = useState(false);
  const [data, setData] = useState<IExperience[]>([]);
  const { localStorage } = useContext(MyContext);
  const initData = async () => {
    if (localStorage) {
      const data = await localStorage.getData("experience", "data");

      if (Array.isArray(data)) {
        setData(data as IExperience[]);
      }
      setInitFlag(true);
    }
  };
  useEffect(() => {
    initData();
  }, [localStorage]);
  return initFlag && localStorage ? (
    <Experience data={data} localStorage={localStorage}></Experience>
  ) : null;
};
export default WrapExperience;
