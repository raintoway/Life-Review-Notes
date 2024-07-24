// @ts-nocheck

import { useCallback, useEffect, useState } from "react";
import s from "./index.module.scss";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  // @ts-expect-error 正常报错
} from "react-beautiful-dnd";
import LocalStorage from "../../../../common/storage/localstorage";
import { Button } from "antd-mobile";
import { AddCircleOutline } from "antd-mobile-icons";
import { nanoid } from "nanoid";
import Editor from "../../../../common/view/components/editor";

type Props = {
  data: IExperience[];
  localStorage: LocalStorage;
};

export interface IExperience {
  id: string;
  content: string;
}

const Experience = (props: Props) => {
  const [data, setData] = useState<IExperience[]>(props.data);
  const { localStorage } = props;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
    if (sourceIndex === destinationIndex) return;
    const sourceIndexEle = data[sourceIndex];
    data.splice(sourceIndex, 1);
    const newDestinationIndex = destinationIndex;
    data.splice(newDestinationIndex, 0, sourceIndexEle);
    setData([...data]);
  };

  useEffect(() => {
    if (localStorage) {
      localStorage.updateData("experience", "data", data);
    }
  }, [data, localStorage]);

  const initTemplate = () => {
    setData([
      {
        id: nanoid(),
        content:
          "<h3>使用示例</h3><p>在这里可以记录你的个人经验，通过拖拽面板来调整位置</p>",
      },
    ]);
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
    setData([...data, { id: nanoid(), content: "" }]);
  };

  return (
    <div className={s.wrapper}>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <Droppable droppableId={"id"}>
          {(provided) => {
            return (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((link, index) => (
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
                                  data.splice(index, 1);
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
    </div>
  );
};
export default Experience;
