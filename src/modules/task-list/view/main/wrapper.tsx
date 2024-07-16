import { useContext, useEffect, useState } from "react";
import { Task, TaskList } from "./index";
import { StorageContext } from "../../../../App";

const WrapTaskList = () => {
  const [initFlag, setInitFlag] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [money, setMoney] = useState(0);
  const { localStorage } = useContext(StorageContext);
  const initData = async () => {
    if (localStorage) {
      const taskList = await localStorage.getData("task-list", "list");

      if (Array.isArray(taskList)) {
        setTasks(taskList as Task[]);
      }
      const money = await localStorage.getData("task-list", "money");
      if (typeof money === "number") {
        setMoney(money);
      }
      setInitFlag(true);
    }
  };
  useEffect(() => {
    initData();
  }, [localStorage]);
  return initFlag && localStorage ? (
    <TaskList
      tasks={tasks}
      money={money}
      localStorage={localStorage}
    ></TaskList>
  ) : null;
};
export default WrapTaskList;
