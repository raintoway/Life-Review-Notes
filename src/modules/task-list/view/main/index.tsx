import { useCallback, useEffect, useState } from "react";
import s from "./index.module.scss";
import { nanoid } from "nanoid";
import {
  AddCircleOutline,
  ArrowDownCircleOutline,
  CheckCircleOutline,
  CloseCircleOutline,
} from "antd-mobile-icons";
import { Button, Dialog, Input, Slider, Space } from "antd-mobile";
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
  const initTemplate = () => {
    setTasks([
      {
        content:
          "<h3>使用示例</h3><ol><li><p>在这里可以记录你的任务列表，通过给任务设置 <strong>重要程度</strong> 和 <strong>紧急程度</strong>，自动给任务排序。</li><li>通过完成任务，累计金钱，满足 <strong>成就感</strong> 的同时建立 <strong>奖励机制</strong></li></ol> </p>",
        id: nanoid(),
        importanceScore: 0,
        emergencyScore: 0,
      },
    ]);
  };

  const init = useCallback(async () => {
    const initFlag = await localStorage.getData("task-list", "initFlag");
    if (!initFlag) {
      if (props.tasks.length === 0) {
        initTemplate();
        localStorage.updateData("task-list", "initFlag", true);
      }
    }
  }, [props.tasks, localStorage]);

  useEffect(() => {
    init();
  }, [init]);

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
            value={money + ""}
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
                    onClick={(e) => {
                      try {
                        const currentTarget = e.currentTarget;
                        const checkIcon =
                          currentTarget.querySelector(".task-check-icon");
                        checkIcon &&
                          ((checkIcon as HTMLElement).style.display = "block");
                        const closeIcon =
                          currentTarget.querySelector(".task-close-icon");
                        closeIcon &&
                          ((closeIcon as HTMLElement).style.display = "block");
                        const allCheckIcon =
                          document.querySelectorAll(".task-check-icon");
                        Array.prototype.slice
                          .call(allCheckIcon)
                          .forEach((item) => {
                            if (item !== checkIcon) {
                              item.style.display = "none";
                            }
                          });
                        const allCloseIcon =
                          document.querySelectorAll(".task-close-icon");
                        Array.prototype.slice
                          .call(allCloseIcon)
                          .forEach((item) => {
                            if (item !== closeIcon) {
                              item.style.display = "none";
                            }
                          });
                      } catch (err) {}
                    }}
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
                          className={[s.closeIcon, "task-close-icon"].join(" ")}
                          color="primary"
                          fill="none"
                          onClick={() => {
                            Dialog.show({
                              content: (
                                <p
                                  style={{
                                    textAlign: "center",
                                    fontSize: "1.2rem",
                                    color: "#6f6d6d",
                                    fontWeight: "bold",
                                  }}
                                >
                                  确定删除这条任务吗？
                                </p>
                              ),
                              closeOnAction: true,
                              closeOnMaskClick: true,
                              actions: [
                                [
                                  {
                                    key: "cancel",
                                    text: "取消",
                                    style: { color: "#6f6d6d" },
                                  },
                                  {
                                    key: "delete",
                                    text: "确定",
                                    style: { color: "pink" },
                                    onClick: () => {
                                      delTask(task.id);
                                    },
                                  },
                                ],
                              ],
                            });
                          }}
                        >
                          <CloseCircleOutline
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
                          className={[s.checkIcon, "task-check-icon"].join(" ")}
                          color="primary"
                          fill="none"
                          onClick={() => {
                            Dialog.show({
                              content: (
                                <p
                                  style={{
                                    textAlign: "center",
                                    fontSize: "1.2rem",
                                    color: "#6f6d6d",
                                    fontWeight: "bold",
                                  }}
                                >
                                  确定完成这条任务吗？
                                </p>
                              ),
                              closeOnAction: true,
                              closeOnMaskClick: true,
                              actions: [
                                [
                                  {
                                    key: "cancel",
                                    text: "取消",
                                    style: { color: "#6f6d6d" },
                                  },
                                  {
                                    key: "delete",
                                    text: "确定",
                                    style: { color: "pink" },
                                    onClick: () => {
                                      completeTask(task.id);
                                    },
                                  },
                                ],
                              ],
                            });
                          }}
                        >
                          <CheckCircleOutline
                            className={[s.lowerMintGreen].join(" ")}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </FlipMove>
        </div>
        <div className={s.operation}>
          <Space direction="vertical">
            {/* <Button
              color="primary"
              fill="none"
              onClick={download}
              className={s.downloadBtn}
            >
              <ArrowDownCircleOutline />
            </Button> */}
            <Button
              color="primary"
              fill="none"
              onClick={addTask}
              className={s.lowerMintGreen}
            >
              <AddCircleOutline />
            </Button>
          </Space>
        </div>
      </div>
    </>
  );
};
