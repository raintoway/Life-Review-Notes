import { useEffect, useRef, useState } from "react";
import s from "./main.module.scss";
import { nanoid } from "nanoid";
import {
  AddCircleOutline,
  CheckCircleOutline,
  MinusCircleOutline,
} from "antd-mobile-icons";
import { Button, Slider, TextArea } from "antd-mobile";
import LocalStorage from "../../../common/storage/localstorage";
export interface IProps {}
export interface Task {
  content: string;
  id: string;
  importanceScore: number;
  emergencyScore: number;
}
// import Fluid from "./fluid";
export const TaskList = (props: IProps) => {
  const localStorageRef = useRef<LocalStorage | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [money, setMoney] = useState(0);
  const addTask = () => {
    setTasks([
      ...tasks,
      {
        content: "",
        id: nanoid(),
        importanceScore: 0,
        emergencyScore: 0,
      },
    ]);
  };
  useEffect(() => {
    const store = localStorageRef.current;
    if (store) {
      store.addData("list", tasks);
    }
  }, [tasks]);
  useEffect(() => {
    localStorageRef.current = new LocalStorage({ collection: "task-list" });
    const taskList = localStorageRef.current.getData("list");
    console.log("taskList", taskList);
    return () => {
      localStorageRef.current = null;
    };
  }, []);

  return (
    <>
      {/* <Fluid /> */}
      <div className={[s.container, "flex-col-start-center"].join(" ")}>
        <div className={s.moneyBox}>¥：{money}</div>
        <div className={s.tasks}>
          {tasks.map((task) => {
            return (
              <div
                key={task.id}
                className={[
                  s.task,
                  "flex-row-start-center",
                  s[
                    `color-level-${Math.floor(
                      (task.importanceScore * 1.5 + task.emergencyScore) / 2.5
                    )}`
                  ],
                ].join(" ")}
              >
                <div className={s.content}>
                  <div className={[s.item, "flex-row-start-start"].join(" ")}>
                    <div className={s.label}>任务描述</div>
                    <TextArea
                      className={[s.taskName, s.value, "flex1"].join(" ")}
                      placeholder="请输入内容"
                      autoSize={{ maxRows: 100 }}
                    />
                  </div>
                  <div className={[s.item, "flex-row-start-center"].join(" ")}>
                    <div className={s.label}>重要程度</div>
                    <Slider
                      onChange={(e) => {
                        task.importanceScore = e as number;
                        setTasks([...tasks]);
                      }}
                      max={10}
                      value={task.importanceScore}
                      className={[s.slider, s.value, "flex1"].join(" ")}
                      icon={<></>}
                    />
                    <div className={s[`color-level-${task.importanceScore}`]}>
                      {task.importanceScore}
                    </div>
                  </div>
                  <div className={[s.item, "flex-row-start-center"].join(" ")}>
                    <div className={s.label}>紧急程度</div>
                    <Slider
                      onChange={(e) => {
                        task.emergencyScore = e as number;
                        setTasks([...tasks]);
                      }}
                      max={10}
                      value={task.emergencyScore}
                      className={[s.slider, s.value, "flex1"].join(" ")}
                      icon={<></>}
                    />
                    <div className={s[`color-level-${task.emergencyScore}`]}>
                      {task.emergencyScore}
                    </div>
                  </div>
                </div>
                <div className={[s.sider, "flex-col-around-center"].join(" ")}>
                  <Button color="primary" fill="none">
                    <MinusCircleOutline className={s.minusIcon} />
                  </Button>
                  <Button color="primary" fill="none">
                    <CheckCircleOutline className={s.checkIcon} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className={s.operation}>
          <AddCircleOutline onClick={addTask} />
        </div>
      </div>
    </>
  );
};
