import React from "react";
import * as S from "./index.ts";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

type Props = {};
const q = [
  {
    id: "4bea859b-e7c3-431c-a185-62adfe2c9017",
    system: false,
    title: "Main menu",
    handle: "main-menu",
    links: [
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
    ],
    createdAt: "2021-03-11T14:05:54Z",
    updatedAt: "2021-03-11T14:05:54Z",
  },
  {
    id: "7bcb79c6-b822-49bd-82b1-9edf3d7e75ec",
    system: false,
    title: "Footer",
    handle: "footer",
    links: [
      {
        id: "66502ec4-1a04-4afb-b018-ece5a0799013",
        position: 1,
        title: "Privacy Policy",
        url: "/privacy-policy",
        subjectId: null,
        subjectType: "http",
        subject: "/privacy-policy",
        subjectParams: {},
        createdAt: "2021-03-11T14:05:55Z",
        updatedAt: "2021-06-08T12:29:55Z",
      },
    ],
    createdAt: "2021-03-11T14:05:55Z",
    updatedAt: "2021-03-11T14:05:55Z",
  },
  {
    id: "1123c3b7-bef3-4139-a0fc-2fa34a92f598",
    system: false,
    title: "Footer menu",
    handle: "footer-menu",
    links: [
      {
        id: "6112d22e-cb90-45d7-bbc9-738cece1a8a8",
        position: 1,
        title: "Privacy Policy",
        url: "/privacy-policy",
        subjectId: null,
        subjectType: "http",
        subject: "/privacy-policy",
        subjectParams: {},
        createdAt: "2021-04-29T09:22:07Z",
        updatedAt: "2021-04-29T09:22:07Z",
      },
    ],
    createdAt: "2021-03-15T22:25:04Z",
    updatedAt: "2021-03-15T22:25:04Z",
  },
];

const NavigationList = () => {
  const navigationsList = q;

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
        <S.Wrapper>
          {navigationsList.map((navigation) => (
            <React.Fragment key={navigation.id}>
              <S.NavigationHeader>{navigation.title}</S.NavigationHeader>
              <Droppable droppableId={navigation.id} key={navigation.id}>
                {(provided, snapshot) => {
                  return (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {navigation.links.map((link, index) => (
                        <Draggable
                          key={link.id}
                          draggableId={link.id}
                          index={index}
                        >
                          {(provided) => (
                            <S.MenuItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              key={link.id}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              {link.title}
                            </S.MenuItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>

              {/* <S.AddLink>+ Add page or link</S.AddLink> */}
            </React.Fragment>
          ))}
        </S.Wrapper>
      </DragDropContext>
    </div>
  );
};
export default NavigationList;
