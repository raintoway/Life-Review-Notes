// @ts-nocheck
import { useCallback, useEffect, useState, useMemo } from "react";
import s from "./index.module.scss";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  // @ts-expect-error 正常报错
} from "react-beautiful-dnd";
import LocalStorage from "../../../../common/storage/localstorage";
import { Button, JumboTabs, Dialog, Input } from "antd-mobile";
import { AddCircleOutline } from "antd-mobile-icons";
import { nanoid } from "nanoid";
import Editor from "../../../../common/view/components/editor";
import { active } from "d3";

type Props = {
  data: IExperienceData[];
  localStorage: LocalStorage;
  activeKey?: string;
};

export interface IExperienceData {
  key: string;
  title: string;
  data: IExperience[];
}
export interface IExperience {
  id: string;
  content: string;
}

const Experience = (props: Props) => {
  const { localStorage } = props;
  const [data, setData] = useState<IExperienceData[]>(props.data);
  const [activeKey, setActiveKey] = useState(
    props.activeKey ?? (props.data.length && props.data[0].key) ?? ""
  );
  const currentData = useMemo(() => {
    const target = data.find((item) => item.key === activeKey);
    if (target) {
      return target.data;
    } else {
      return [];
    }
  }, [data, activeKey]);

  const [addCategory, setAddCategory] = useState<IExperienceData>();
  const [addVisible, setAddVisible] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    if (sourceIndex === destinationIndex) return;
    const sourceIndexEle = currentData[sourceIndex];
    currentData.splice(sourceIndex, 1);
    const newDestinationIndex = destinationIndex;
    currentData.splice(newDestinationIndex, 0, sourceIndexEle);
    setData([...data]);
  };

  useEffect(() => {
    if (localStorage) {
      localStorage.updateData("experience", "data", data);
      localStorage.updateData("experience", "activeKey", activeKey);
    }
  }, [data, localStorage, activeKey]);

  const initTemplate = () => {
    const firstKey = nanoid();
    setData([
      {
        key: firstKey,
        title: "工作",
        data: [
          {
            id: nanoid(),
            content:
              "<h3>使用示例</h3><p>在这里可以记录你的个人经验，通过拖拽面板来调整位置</p>",
          },
        ],
      },
      {
        key: nanoid(),
        title: "学习",
        data: [
          {
            id: nanoid(),
            content:
              "<h3>使用示例</h3><p>在这里可以记录你的个人经验，通过拖拽面板来调整位置</p>",
          },
        ],
      },
      {
        key: nanoid(),
        title: "生活",
        data: [
          {
            id: nanoid(),
            content:
              "<h3>使用示例</h3><p>在这里可以记录你的个人经验，通过拖拽面板来调整位置</p>",
          },
        ],
      },
      {
        key: nanoid(),
        title: "爱情",
        data: [
          {
            id: nanoid(),
            content:
              "<h3>使用示例</h3><p>在这里可以记录你的个人经验，通过拖拽面板来调整位置</p>",
          },
        ],
      },
    ]);
    setActiveKey(firstKey);
  };

  const init = useCallback(async () => {
    const initFlag = await localStorage.getData("experience", "initFlag");
    if (!initFlag) {
      if (props.data.length === 0) {
        initTemplate();
        localStorage.updateData("experience", "initFlag", true);
      }
    }
  }, [props.data, localStorage]);

  useEffect(() => {
    init();
  }, [init]);

  const addExperience = () => {
    currentData.push({ id: nanoid(), content: "" });
    setData([...data]);
  };

  return (
    <div className={s.wrapper}>
      <JumboTabs
        style={{ marginBottom: "20px" }}
        activeKey={activeKey}
        onChange={(val) => {
          if (val === "+") {
            setAddCategory({ key: nanoid(), title: "", data: [] });
            setAddVisible(true);
          } else {
            setActiveKey(val);
          }
        }}
      >
        {data.map((item) => {
          return (
            <JumboTabs.Tab title={item.title} key={item.key}></JumboTabs.Tab>
          );
        })}
        <JumboTabs.Tab title={"+"} key={"+"}></JumboTabs.Tab>
      </JumboTabs>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <Droppable droppableId={"id"}>
          {(provided) => {
            return (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {currentData.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={link.id}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        {
                          <div className={s.editorWrapper}>
                            <div className={s.editorContainer}>
                              <Editor
                                key={"editor" + link.id}
                                value={link.content}
                                setValue={(content: string) => {
                                  link.content = content;
                                  setData([...data]);
                                }}
                                deleteCurrent={() => {
                                  currentData.splice(index, 1);
                                  setData([...data]);
                                }}
                              />
                            </div>
                          </div>
                        }
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
      <div className={s.operation}>
        <Button
          color="primary"
          fill="none"
          onClick={addExperience}
          className={s.lowerMintGreen}
        >
          <AddCircleOutline />
        </Button>
      </div>
      <Dialog
        visible={addVisible}
        content={
          <>
            {addCategory ? (
              <Input
                style={{
                  "--color": "#6f6d6d",
                  "--text-align": "center",
                }}
                placeholder="请输入分类标题"
                value={addCategory?.title}
                onChange={(val) => {
                  if (addCategory) {
                    addCategory.title = val;
                    setAddCategory({ ...addCategory });
                  }
                }}
              />
            ) : null}
          </>
        }
        destroyOnClose
        closeOnAction
        closeOnMaskClick
        onClose={() => {
          setAddVisible(false);
        }}
        actions={[
          [
            {
              key: "cancel",
              text: "取消",
              onClick: () => {
                setAddVisible(false);
              },
              style: { color: "#6f6d6d" },
            },
            {
              key: "confirm",
              text: "添加",
              onClick: () => {
                if (addCategory?.title) {
                  setData([...data, addCategory]);
                }
              },
              style: { color: "#ffe3e8" },
            },
          ],
        ]}
      />
    </div>
  );
};
export default Experience;
