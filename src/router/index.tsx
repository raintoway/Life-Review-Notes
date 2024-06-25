import { AppstoreOutline } from "antd-mobile-icons";
import WrapTaskList from "../modules/task-list/view/main/wrapper";
import WrapAbstractConcreteLibrary from "../modules/abstract-concrete-library/view/main/wrapper";
import Experience from "../modules/experience/view/main/wrapper.tsx";
import Review from "../modules/review/view/main/wrapper.tsx";

export const routerConfig = [
  {
    key: "/task-list",
    title: "任务列表",
    icon: <AppstoreOutline />,
    comp: <WrapTaskList />,
  },
  {
    key: "/abstract-concrete-library",
    title: "抽象具象库",
    icon: <AppstoreOutline />,
    comp: <WrapAbstractConcreteLibrary />,
  },
  {
    key: "/experience",
    title: "个人经验",
    icon: <AppstoreOutline />,
    comp: <Experience />,
  },
  {
    key: "/review",
    title: "复盘",
    icon: <AppstoreOutline />,
    comp: <Review />,
  },
];
