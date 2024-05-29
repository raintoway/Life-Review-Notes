import { AppstoreOutline } from "antd-mobile-icons";
import TaskList from "../modules/task-list/view/main";
import AbstractConcreteLibrary from "../modules/abstract-concrete-library/view/main";

export const routerConfig = [
  {
    key: "/task-list",
    title: "任务列表",
    icon: <AppstoreOutline />,
    comp: <TaskList />,
  },
  {
    key: "/abstract-concrete-library",
    title: "抽象具象库",
    icon: <AppstoreOutline />,
    comp: <AbstractConcreteLibrary />,
  },
];
