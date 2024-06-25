import { useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import { nanoid } from "nanoid";
import {
  AddCircleOutline,
  CheckCircleOutline,
  MinusCircleOutline,
} from "antd-mobile-icons";
import { Button, Input, Slider, TextArea } from "antd-mobile";
import LocalStorage from "../../../../common/storage/localstorage";
export interface IProps {
  tasks: Task[];
  money: number;
  localStorage: LocalStorage;
}
export interface Task {
  content: string;
  id: string;
  importanceScore: number;
  emergencyScore: number;
}
import FlipMove from "react-flip-move";
import Editor from "../../../../common/view/components/editor";

export const TaskList = (props: IProps) => {
  const { localStorage } = props;
  const [tasks, setTasks] = useState<Task[]>(props.tasks);
  const [money, setMoney] = useState<number>(props.money);

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
  const delTask = (taskId: string) => {
    setTasks(
      tasks.filter((task) => {
        return task.id !== taskId;
      })
    );
  };
  const completeTask = (taskId: string) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      setMoney(money + task.importanceScore * 1 + task.emergencyScore * 0.5);
      delTask(taskId);
    }
  };

  useEffect(() => {
    if (localStorage) {
      localStorage.updateData("task-list", "list", tasks);
    }
  }, [tasks, localStorage]);

  useEffect(() => {
    if (localStorage) {
      localStorage.updateData("task-list", "money", money);
    }
  }, [money, localStorage]);

  return (
    <>
      <div className={[s.container, "flex-col-start-center"].join(" ")}>
        <div className={[s.moneyBox, "flex-row-start-center"].join(" ")}>
          ¥：
          <Input
            className={s.input}
            type="number"
            placeholder="请输入内容"
            value={money}
            onChange={(val) => {
              const transformToNum = Number(val);
              if (typeof transformToNum === "number") {
                setMoney(transformToNum);
              }
            }}
          />
        </div>
        <div className={s.tasks}>
          <FlipMove duration={200}>
            {tasks
              .sort((a, b) =>
                a.importanceScore * 10 + a.emergencyScore * 5 >
                b.importanceScore * 10 + b.emergencyScore * 5
                  ? -1
                  : 1
              )
              .map((task) => {
                return (
                  <div
                    key={task.id}
                    className={[
                      s.task,
                      "flex-row-start-center",
                      s[
                        `color-level-${Math.floor(
                          (task.importanceScore * 1.5 + task.emergencyScore) /
                            2.5
                        )}`
                      ],
                    ].join(" ")}
                  >
                    <div className={s.content}>
                      <div
                        className={[s.item, "flex-row-start-start"].join(" ")}
                      >
                        <div className={s.label}>任务描述</div>
                        {/* <TextArea
                          className={[s.taskName, s.value, "flex1"].join(" ")}
                          placeholder="请输入内容"
                          autoSize={{ maxRows: 100 }}
                        /> */}
                        <div
                          className={[s.taskName, s.value, "flex1"].join(" ")}
                        >
                          <Editor
                            key={"taskEditor" + task.id}
                            value={task.content}
                            setValue={(content: string) => {
                              task.content = content;
                              setTasks([...tasks]);
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={[s.item, "flex-row-start-center"].join(" ")}
                      >
                        <div className={s.label}>重要程度</div>
                        <Slider
                          onAfterChange={(e) => {
                            task.importanceScore = e as number;
                            setTasks([...tasks]);
                          }}
                          max={10}
                          defaultValue={task.importanceScore}
                          className={[s.slider, s.value, "flex1"].join(" ")}
                          icon={<></>}
                        />
                        <div
                          className={s[`color-level-${task.importanceScore}`]}
                        >
                          {task.importanceScore}
                        </div>
                        <Button
                          className={s.minusIcon}
                          color="primary"
                          fill="none"
                          onClick={() => delTask(task.id)}
                        >
                          <MinusCircleOutline
                            className={[s.lowerPink].join(" ")}
                          />
                        </Button>
                      </div>
                      <div
                        className={[s.item, "flex-row-start-center"].join(" ")}
                      >
                        <div className={s.label}>紧急程度</div>
                        <Slider
                          onAfterChange={(e) => {
                            task.emergencyScore = e as number;
                            setTasks([...tasks]);
                          }}
                          max={10}
                          defaultValue={task.emergencyScore}
                          className={[s.slider, s.value, "flex1"].join(" ")}
                          icon={<></>}
                        />
                        <div
                          className={s[`color-level-${task.emergencyScore}`]}
                        >
                          {task.emergencyScore}
                        </div>
                        <Button
                          className={s.checkIcon}
                          color="primary"
                          fill="none"
                          onClick={() => completeTask(task.id)}
                        >
                          <CheckCircleOutline
                            className={[s.lowerMintGreen].join(" ")}
                          />
                        </Button>
                      </div>
                    </div>
                    {/* <div
                      className={[s.sider, "flex-col-around-center"].join(" ")}
                    >
                      <Button
                        color="primary"
                        fill="none"
                        onClick={() => delTask(task.id)}
                      >
                        <MinusCircleOutline
                          className={[s.minusIcon, s.lowerPink].join(" ")}
                        />
                      </Button>
                      <Button
                        color="primary"
                        fill="none"
                        onClick={() => completeTask(task.id)}
                      >
                        <CheckCircleOutline
                          className={[s.checkIcon, s.lowerMintGreen].join(" ")}
                        />
                      </Button>
                    </div> */}
                  </div>
                );
              })}
          </FlipMove>
        </div>
        <div className={s.operation}>
          <Button
            color="primary"
            fill="none"
            onClick={addTask}
            className={s.lowerMintGreen}
          >
            <AddCircleOutline />
          </Button>
        </div>
      </div>
    </>
  );
};
