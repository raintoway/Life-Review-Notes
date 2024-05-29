import { useEffect, useState } from "react";
import { Task, TaskList } from "./main";
import LocalStorage from "../../../../common/storage/localstorage";

const WrapTaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [money, setMoney] = useState(0);
  const [localStorage, setLocalStorage] = useState<LocalStorage | null>(null);
  const initData = async () => {
    const _localStorage = new LocalStorage();
    await _localStorage.init("task-list");
    const taskList = await _localStorage.getData("list");
    if (Array.isArray(taskList)) {
      setTasks(taskList as Task[]);
    }
    const money = await _localStorage.getData("money");
    if (typeof money === "number") {
      setMoney(money);
    }
    setLocalStorage(_localStorage);
  };
  useEffect(() => {
    initData();
  }, []);
  return localStorage ? (
    <TaskList
      tasks={tasks}
      money={money}
      localStorage={localStorage}
    ></TaskList>
  ) : null;
};
export default WrapTaskList;
