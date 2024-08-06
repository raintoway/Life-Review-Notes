import { useContext, useEffect, useState } from "react";
import Experience, { IExperienceData } from "./index";
import { StorageContext } from "../../../../App";

const WrapExperience = () => {
  const [initFlag, setInitFlag] = useState(false);
  const [data, setData] = useState<IExperienceData[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const { localStorage } = useContext(StorageContext);
  const initData = async () => {
    if (localStorage) {
      const data = await localStorage.getData("experience", "data");
      const activeKey = await localStorage.getData("experience", "activeKey");
      if (Array.isArray(data)) {
        setData(data as IExperienceData[]);
      }
      setActiveKey(activeKey as string);
      setInitFlag(true);
    }
  };
  useEffect(() => {
    initData();
  }, [localStorage]);
  return initFlag && localStorage ? (
    <Experience
      data={data}
      localStorage={localStorage}
      activeKey={activeKey}
    ></Experience>
  ) : null;
};
export default WrapExperience;
