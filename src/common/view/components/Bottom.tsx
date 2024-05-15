import { FC } from "react";
import {
  useHistory,
  useLocation,
  //@ts-expect-error react-router-dom5的问题
} from "react-router-dom";
import { TabBar } from "antd-mobile";
import { routerConfig } from "../../../router";
export const Bottom: FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  const setRouteActive = (value: string) => {
    history.push(value);
  };

  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      {routerConfig.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};
