import React, { useState } from "react";
import * as S from "./index.styled";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import Editor from "../components/editor";
import { Delta } from "quill/core";

type Props = {};
const q = [
  {
    id: "f89f1f42-d045-4179-8ba5-8c738479e288",
    position: 1,
    title: "Browse all pro",
    url: "/collections/all",
    subjectId: null,
    subjectType: "http",
    subject: "/collections/all",
    subjectParams: {},
    createdAt: "2021-04-29T09:22:06Z",
    updatedAt: "2021-06-07T12:18:13Z",
  },
  {
    id: "faa464e4-88c7-43e1-af2c-1c7752a1931f",
    position: 2,
    title: "Filip",
    url: "https://radio-maryja.pl",
    subjectId: null,
    subjectType: "http",
    subject: "https://radio-maryja.pl",
    subjectParams: {},
    createdAt: "2021-05-24T12:12:04Z",
    updatedAt: "2021-06-07T14:52:53Z",
  },
  {
    id: "8d1d5289-2aba-40bc-bdce-5311540996a2",
    position: 3,
    title: "My link",
    url: null,
    subjectId: null,
    subjectType: "http",
    subject: null,
    subjectParams: {},
    createdAt: "2021-06-02T14:13:55Z",
    updatedAt: "2021-06-07T14:52:53Z",
  },
  {
    id: "d23c968c-1ad3-443f-b547-cf89839ad46b",
    position: 4,
    title: "Home",
    url: "/",
    subjectId: null,
    subjectType: "http",
    subject: "/",
    subjectParams: {},
    createdAt: "2021-04-29T09:22:06Z",
    updatedAt: "2021-06-06T11:29:58Z",
  },
];

const NavigationList = () => {
  const navigationsList = q;
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    console.log(result);

    if (source.droppableId !== destination.droppableId) {
      const sourceNav = navigationsList.find(
        (navigation) => navigation.id === source.droppableId
      );
      const destNav = navigationsList.find(
        (navigation) => navigation.id === destination.droppableId
      );

      if (sourceNav && destNav) {
        const sourceLinks = [...sourceNav.links];
        const destLinks = [...destNav.links];

        const [removed] = sourceLinks.splice(source.index, 1);
        destLinks.splice(destination.index, 0, removed);

        sourceNav.links = sourceLinks;
        destNav.links = destLinks;
      }
    } else {
      const nav = navigationsList.find(
        (navigation) => navigation.id === destination.droppableId
      );

      if (nav) {
        const copiedLinks = [...nav.links];
        const [removed] = copiedLinks.splice(source.index, 1);
        copiedLinks.splice(destination.index, 0, removed);

        nav.links = copiedLinks;
      }
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <Droppable droppableId={"id"} key={"id"}>
          {(provided, snapshot) => {
            return (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {navigationsList.map((link, index) => (
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
                          <div
                            draggable={false}
                            style={{ pointerEvents: "none" }}
                          >
                            111
                            <Editor
                              id={"editor" + link.id}
                              readOnly={false}
                              defaultValue={new Delta().insert(link.title)}
                              onSelectionChange={setRange}
                              onTextChange={setLastChange}
                            />
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
    </div>
  );
};
export default NavigationList;
