// @ts-nocheck
import { Graph, Shape, Cell } from "@antv/x6";
import { Snapline } from "@antv/x6-plugin-snapline";
import { History } from "@antv/x6-plugin-history";
import { useCallback, useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import { Portal } from "@antv/x6-react-shape";
import { Transform } from "@antv/x6-plugin-transform";
import { TextArea, Dialog } from "antd-mobile";
import { ICollection } from "../../main";
import React from "react";
import updatePng from "./update.png";
import {
  ports,
  addRectPanel,
  addPolygonPanel,
  addRoundRectPanel,
} from "./config";

import Hammer from "hammerjs";
const X6ReactPortalProvider = Portal.getProvider(); // 注意，一个 graph 只能申明一个 portal provider
export const FlowEditorContext = React.createContext<{
  syncToStorage: (graph: Graph) => void;
}>({});

Graph.registerNode(
  "custom-rect",
  {
    inherit: "rect",
    width: 100,
    height: 50,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: "#5F95FF",
        fill: "#EFF4FF",
      },
      text: {
        fontSize: 12,
        fill: "#262626",
      },
    },
    ports: { ...ports },
  },
  true
);

Graph.registerNode(
  "custom-polygon",
  {
    inherit: "polygon",
    width: 100,
    height: 50,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: "#5F95FF",
        fill: "#EFF4FF",
      },
      text: {
        fontSize: 12,
        fill: "#262626",
      },
    },
    ports: {
      ...ports,
    },
  },
  true
);
const FlowEditor = ({
  data,
  updateData,
}: {
  data: ICollection;
  updateData: (collection: ICollection) => void;
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [deleteVisible, setDeleteVisible] = useState(false);
  const currentNodeRef = useRef(null);
  const graphRef = useRef(null);

  const init = useCallback(
    (graph: Graph) => {
      graph.addNode({
        shape: "custom-rect",
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        attrs: {
          body: {
            rx: 20,
            ry: 22,
            fill: "#dbf4f7",
            stroke: "transparent",
            "stroke-width": 1,
            cursor: "pointer",
            padding: 10,
            isStart: true,
          },
          text: {
            fill: "#6f6d6d",
          },
          label: {
            textWrap: {
              width: "100%",
              height: "100%",
              ellipsis: true,
              breakWord: false,
            },
          },
        },
        ports: { ...ports },
        label: "开始",
      });
      data.content = JSON.stringify(graph.toJSON());
      updateData({
        ...data,
      });
    },
    [data, updateData]
  );

  const syncToStorage = useCallback(
    (graph: Graph) => {
      updateData({
        ...data,
        content: JSON.stringify(graph.toJSON()),
      });
    },
    [updateData, data]
  );

  useEffect(() => {
    setTitle(data.label);
    if (!containerRef.current) return;
    let updatePngBlobUrl = "";
    fetch(updatePng)
      .then((response) => response.blob())
      .then((blob) => {
        updatePngBlobUrl = URL.createObjectURL(blob);
      })
      .catch((error) => {
        console.error("Error converting image to blob:", error);
      });
    const container = containerRef.current;
    // #region 初始化画布
    const graph = new Graph({
      container: container,
      grid: true,
      // panning: true,
      connecting: {
        router: "manhattan",
        connector: {
          name: "rounded",
          args: {
            radius: 10,
          },
        },
        anchor: "center",
        connectionPoint: "anchor",
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: "#A2B1C3",
                strokeWidth: 2,
                targetMarker: {
                  name: "block",
                  width: 12,
                  height: 8,
                },
              },
              text: {
                fill: "#6f6d6d",
              },
            },
            zIndex: 0,
          });
        },
        validateConnection({ targetMagnet, sourcePort, targetPort }) {
          if (sourcePort === targetPort) return false;
          return !!targetMagnet;
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: "stroke",
          args: {
            attrs: {
              fill: "#5F95FF",
              stroke: "#5F95FF",
            },
          },
        },
      },
    });

    graphRef.current = graph;

    // #region 使用插件
    const _transform = new Transform({
      resizing: true,
    });

    graph.use(_transform).use(new Snapline()).use(new History());

    // 我们也可以在插件实例上监听事件
    _transform.on("node:resizing", ({ node }) => {
      const targetTextArea = document.getElementById(node.id);
      if (targetTextArea) {
        const hiddenTextArea = targetTextArea.nextSibling;
        if (hiddenTextArea) {
          const scrollheight = hiddenTextArea.scrollHeight;
          targetTextArea.style.height = scrollheight + "px";
        }
      }
    });

    graph.on("edge:click", ({ edge }) => {
      edge.addTools([
        {
          name: "button",
          args: {
            markup: [
              {
                tagName: "circle",
                selector: "button",
                attrs: {
                  r: 10,
                  fill: "#ddd",
                },
              },
              {
                tagName: "text",
                textContent: "x",
                selector: "icon",
                attrs: {
                  fill: "white",
                  fontSize: 20,
                  textAnchor: "middle",
                  pointerEvents: "none",
                  y: "5",
                },
              },
            ],
            x: "0%",
            y: "0%",
            offset: { x: 40, y: -20 },
            onClick() {
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
                    确定删除该边吗？
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
                        edge.remove();
                      },
                    },
                  ],
                ],
              });
            },
          },
        },
        {
          name: "button",
          args: {
            markup: [
              {
                tagName: "circle",
                selector: "button",
                attrs: {
                  r: 10,
                  fill: "#ddd",
                },
              },
              {
                tagName: "image",
                selector: "image",
                attrs: {
                  href: updatePngBlobUrl ?? "",
                  width: 16,
                  height: 16,
                  y: "-8",
                  x: "-8",
                },
              },
            ],
            x: "0%",
            y: "0%",
            offset: { x: 40, y: -50 },
            onClick: async ({ cell }: { cell: Cell }) => {
              try {
                const label = cell.labels?.[0]?.attrs?.label?.text ?? "";
                setVisible(true);
                setLabel(label);
                currentNodeRef.current = cell;
              } catch (err) {}
            },
          },
        },
      ]);
    });

    graph.on("cell:click", ({ cell, e }) => {
      if (cell.isNode()) {
        const cellColor = cell.attrs?.body.fill ?? "#ddd";
        graph.view.svg.style.color = cellColor as string;
        cell.port.ports.forEach((item) => {
          switch (item.group) {
            case "outer-top":
              cell.portProp(item.id!, "args/y", -20);
              cell.portProp(item.id!, "attrs/circle/r", 10);
              cell.portProp(item.id!, "attrs/circle/stroke", "transparent");
              cell.portProp(item.id!, "attrs/circle/fill", cellColor);
              break;
            case "outer-bottom":
              cell.portProp(
                item.id!,
                "args/y",
                cell.store.data.size.height + 20
              );
              cell.portProp(item.id!, "attrs/circle/r", 10);
              cell.portProp(item.id!, "attrs/circle/stroke", "transparent");
              cell.portProp(item.id!, "attrs/circle/fill", cellColor);
              break;
            case "outer-left":
              cell.portProp(item.id!, "args/x", -20);
              cell.portProp(item.id!, "attrs/circle/r", 10);
              cell.portProp(item.id!, "attrs/circle/stroke", "transparent");
              cell.portProp(item.id!, "attrs/circle/fill", cellColor);
              break;
            case "outer-right":
              cell.portProp(
                item.id!,
                "args/x",
                cell.store.data.size.width + 20
              );
              cell.portProp(item.id!, "attrs/circle/r", 10);
              cell.portProp(item.id!, "attrs/circle/stroke", "transparent");
              cell.portProp(item.id!, "attrs/circle/fill", cellColor);
              break;
          }
        });
        if (cell.attrs?.body.isStart) {
        } else {
          cell.addTools([
            {
              name: "button",
              args: {
                markup: [
                  {
                    tagName: "circle",
                    selector: "button",
                    attrs: {
                      r: 10,
                      fill: "#ddd",
                    },
                  },
                  {
                    tagName: "text",
                    textContent: "x",
                    selector: "icon",
                    attrs: {
                      fill: "white",
                      fontSize: 20,
                      textAnchor: "middle",
                      pointerEvents: "none",
                      y: "5",
                    },
                  },
                ],
                x: "100%",
                y: "0%",
                offset: { x: -12, y: 12 },
                onClick({ cell }: { cell: Cell }) {
                  setDeleteVisible(true);
                  currentNodeRef.current = cell;
                },
              },
            },
          ]);
        }
        cell.addTools([
          {
            name: "button",
            args: {
              markup: [
                {
                  tagName: "circle",
                  selector: "button",
                  attrs: {
                    r: 10,
                    fill: "#ddd",
                  },
                },
                {
                  tagName: "image",
                  selector: "image",
                  attrs: {
                    href: updatePngBlobUrl ?? "",
                    width: 16,
                    height: 16,
                    y: "-8",
                    x: "-8",
                  },
                },
              ],
              x: "100%",
              y: "100%",
              offset: { x: -12, y: -12 },
              onClick: async ({ cell }: { cell: Cell }) => {
                setVisible(true);
                setLabel(cell.label ?? "");
                currentNodeRef.current = cell;
              },
            },
          },
        ]);
      }
    });

    graph.on("node:port:click", ({ view, e }) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const port = e.target;
      const group = port.getAttribute("port-group");
      view.cell.removeTools();
      view.cell.addTools([
        addRectPanel(group),
        addPolygonPanel(group),
        addRoundRectPanel(group),
      ]);
    });

    graph.on("edge:connected", ({ isNew, edge }) => {
      try {
        const sourcePortId = edge.getSourcePortId();
        const targetPortId = edge.getTargetPortId();
        const sourcePort = edge.getSourceCell().getPort(sourcePortId);
        const targetPort = edge.getTargetCell().getPort(targetPortId);
        const souceSplit = sourcePort.group.split("-");
        const targetSplit = targetPort.group.split("-");
        if (souceSplit.length > 1) {
          edge.prop(
            "source/port",
            edge.getSourceCell().getPortsByGroup(souceSplit[1])[0].id
          );
        }
        if (targetSplit.length > 1) {
          edge.prop(
            "target/port",
            edge.getTargetCell().getPortsByGroup(targetSplit[1])[0].id
          );
        }
      } catch (err) {}
    });

    if (data.content) {
      graph.fromJSON(JSON.parse(data.content));
    } else {
      init(graph);
    }

    graph.zoomToFit({ maxScale: 1 });

    const pointerDownHandler = (e?: PointerEvent) => {
      // 假设 `graph` 是你的 X6 图对象
      const allCells = graph.getCells();
      // 筛选出所有的节点对象
      const allNodes = allCells.filter((cell) => cell.isNode());
      const allEdge = allCells.filter((cell) => cell.isEdge());
      if (e?.target?.classList.contains("x6-port-body")) {
        // 现在 `allNodes` 包含了所有节点对象
        allNodes.forEach((node) => {
          if (
            node.port.ports.some((item) => {
              return item.id === e.target.getAttribute("port");
            })
          ) {
          } else {
            node.port.ports.forEach((item) => {
              switch (item.group) {
                case "top":
                  node.portProp(item.id!, "args/y", 0);
                  break;
                case "bottom":
                  node.portProp(
                    item.id!,
                    "args/y",
                    node.store.data.size.height
                  );
                  break;
                case "left":
                  node.portProp(item.id!, "args/x", 0);
                  break;
                case "right":
                  node.portProp(item.id!, "args/x", node.store.data.size.width);
                  break;
              }
              node.portProp(item.id!, "attrs/circle/r", 8);
              node.portProp(item.id!, "attrs/circle/stroke", "#8f8f8f");
              node.portProp(item.id!, "attrs/circle/fill", "#fff");
            });
            node.removeTools();
          }
        });
      } else {
        // 现在 `allNodes` 包含了所有节点对象
        allNodes.forEach((node) => {
          node.port.ports.forEach((item) => {
            switch (item.group) {
              case "outer-top":
                node.portProp(item.id!, "args/y", 0);
                break;
              case "outer-bottom":
                node.portProp(item.id!, "args/y", node.store.data.size.height);
                break;
              case "outer-left":
                node.portProp(item.id!, "args/x", 0);
                break;
              case "outer-right":
                node.portProp(item.id!, "args/x", node.store.data.size.width);
                break;
            }
            node.portProp(item.id!, "attrs/circle/r", 0);
          });
          node.removeTools();
        });
      }
      allEdge.forEach((edge) => {
        edge.removeTools();
      });
    };

    const mc = new Hammer(containerRef.current);

    const pinHandler = (e) => {
      if (e.type === "pinchstart") {
        console.log("Pinch start", e);
      }
      const pointer1 = e.pointers[0];
      const pointer2 = e.pointers[1];
      if (
        containerRef.current &&
        containerRef.current === pointer1.target.parentNode &&
        containerRef.current === pointer2.target.parentNode
      ) {
        // 计算缩放比例
        const scale = e.scale;
        graph.zoom(scale, { absolute: true });
      }
    };
    mc.get("pinch").set({ enable: true, pointers: 2 });
    mc.on("pinchstart pinchmove", pinHandler);
    const prePos = { x: 0, y: 0 };
    const panHandler = (e) => {
      if (
        containerRef.current &&
        containerRef.current === e.target.parentNode
      ) {
        // 计算画布的偏移量
        const translate = graph.transform.getTranslation();
        const offsetX = e.deltaX - prePos.x + translate.tx;
        const offsetY = e.deltaY - prePos.y + translate.ty;
        prePos.x = e.deltaX;
        prePos.y = e.deltaY;
        graph.translate(offsetX, offsetY);
      }
    };
    mc.get("pan").set();
    // 添加手势监听器
    mc.on("pan", panHandler);
    const handlerPanStart = () => {
      prePos.x = 0;
      prePos.y = 0;
    };
    mc.on("panstart", handlerPanStart);

    const timer = setInterval(() => {
      syncToStorage(graph);
    }, 2000);

    containerRef.current?.addEventListener("pointerdown", pointerDownHandler);
    pointerDownHandler();
    const beforeUnloadHandler = (e) => {
      syncToStorage(graph);
      clearInterval(timer);
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      mc.off("pan", panHandler);
      mc.off("panstart", handlerPanStart);
      mc.off("pinchstart pinchmove", pinHandler);
      URL.revokeObjectURL(updatePngBlobUrl);
      containerRef.current?.removeEventListener(
        "pointerdown",
        pointerDownHandler
      );
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      clearInterval(timer);
      syncToStorage(graph);
      pointerDownHandler();
      graph.dispose();
    };
  }, [data, updateData, init, syncToStorage]);

  return (
    <div className={[s.container].join(" ")}>
      <FlowEditorContext.Provider value={{ syncToStorage }}>
        <X6ReactPortalProvider />
      </FlowEditorContext.Provider>
      <TextArea
        className={s.title}
        placeholder="请输入标题"
        onChange={(val) => {
          setTitle(val);
          updateData({
            ...data,
            label: val,
          });
        }}
        value={title}
        rows={1}
        autoSize={{ minRows: 1, maxRows: 2 }}
      />
      <div className={[s.graphBox].join(" ")} ref={containerRef}></div>
      <Dialog
        visible={visible}
        content={
          <TextArea
            style={{
              "--color": "#6f6d6d",
              "--text-align": "center",
              "--font-size": "1.2rem",
              fontWeight: "bold",
            }}
            onChange={(e) => {
              try {
                setLabel(e);
              } catch (err) {}
            }}
            value={label}
            rows={1}
            autoSize={true}
            placeholder="请输入"
          />
        }
        closeOnAction={true}
        closeOnMaskClick={true}
        onClose={() => {
          setVisible(false);
        }}
        actions={[
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
                if (currentNodeRef.current) {
                  if (currentNodeRef.current.isNode()) {
                    currentNodeRef.current.setLabel(label);
                  } else {
                    currentNodeRef.current.setLabelAt(0, label);
                  }
                }
                graphRef.current && syncToStorage(graphRef.current);
              },
            },
          ],
        ]}
      />
      <Dialog
        visible={deleteVisible}
        content={
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#6f6d6d",
              fontWeight: "bold",
            }}
          >
            确定删除
            {currentNodeRef.current?.isNode()
              ? currentNodeRef.current.label?.slice(0, 20) ?? ""
              : ""}
            吗？
          </p>
        }
        closeOnAction={true}
        closeOnMaskClick={true}
        onClose={() => {
          setDeleteVisible(false);
        }}
        actions={[
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
                if (currentNodeRef.current) {
                  if (currentNodeRef.current.isNode()) {
                    currentNodeRef.current.remove();
                  }
                }
                graphRef.current && syncToStorage(graphRef.current);
              },
            },
          ],
        ]}
      />
    </div>
  );
};

export default FlowEditor;
