import { useContext, useEffect, useState } from "react";
import Register from "./components/register";
import Info from "./components/info";
import { StorageContext } from "../../App";

export default function My() {
  const [hasRegistered, setHasRegistered] = useState(true);
  const [initFlag, setInitFlag] = useState(false);
  const { localStorage } = useContext(StorageContext);
  const initData = async () => {
    if (localStorage) {
      setInitFlag(true);
    }
  };
  useEffect(() => {
    initData();
  }, [localStorage]);
  return initFlag && localStorage ? (
    hasRegistered ? (
      <Info localStorage={localStorage}></Info>
    ) : (
      <Register></Register>
    )
  ) : null;
}
