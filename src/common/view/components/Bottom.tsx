import { FC, useCallback, useContext, useEffect } from "react";
import {
  useHistory,
  useLocation,
  //@ts-expect-error react-router-dom5的问题
} from "react-router-dom";
import { TabBar } from "antd-mobile";
import { routerConfig } from "../../../router";
import { StorageContext } from "../../../App";
export const Bottom: FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const { localStorage } = useContext(StorageContext);

  const initIndex = useCallback(async () => {
    if (localStorage) {
      const index = await localStorage.getData("utils", "index");
      if (index) {
        history.replace(index);
      }
    }
  }, [localStorage, history]);

  useEffect(() => {
    initIndex();
  }, [initIndex]);
  const setRouteActive = (value: string) => {
    history.push(value);
    localStorage?.updateData("utils", "index", value);
  };

  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      {routerConfig.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};
