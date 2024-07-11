import { Graph, Shape, Node, NodeView, Cell, Edge } from "@antv/x6";
import { Snapline } from "@antv/x6-plugin-snapline";
import { History } from "@antv/x6-plugin-history";
import { useCallback, useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import { register } from "@antv/x6-react-shape";
import { Transform } from "@antv/x6-plugin-transform";
import CustomReactRect from "./components/rect";
import CustomReactRoundRect from "./components/round-rect";
import CustomReactPolygon from "./components/polygon";
import { Input } from "antd-mobile";
import { ICollection } from "../../main";
import { debounce } from "../../../../../common/utils";
// 定义节点
const groups = {
  bottom: {
    attrs: {
      circle: {
        r: 6,
        magnet: true,
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
      },
    },
    position: {
      args: { x: "50%", y: "100%" },
      name: "absolute",
    },
  },
  top: {
    attrs: {
      circle: {
        r: 6,
        magnet: true,
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
      },
    },
    position: {
      args: { x: "50%", y: "0%" },
      name: "absolute",
    },
  },
  left: {
    attrs: {
      circle: {
        r: 6,
        magnet: true,
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
      },
    },
    position: {
      args: { x: "0%", y: "50%" },
      name: "absolute",
    },
  },
  right: {
    attrs: {
      circle: {
        r: 6,
        magnet: true,
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
      },
    },
    position: {
      args: { x: "100%", y: "50%" },
      name: "absolute",
    },
  },
};
const ports = {
  groups: groups,
  items: [
    {
      group: "top",
    },
    {
      group: "bottom",
    },
    {
      group: "left",
    },
    {
      group: "right",
    },
  ],
};
const addRectPanel = {
  name: "button",
  args: {
    markup: [
      {
        tagName: "rect",
        selector: "button",
        attrs: {
          width: 50,
          height: 25,
          rx: 6,
          ry: 6,
          fill: "#dbf8e0",
          stroke: "transparent",
          "stroke-width": 1,
          cursor: "pointer",
        },
      },
    ],
    x: "50%",
    y: "100%",
    offset: { x: -90, y: 40 },
    onClick({ view }: { view: NodeView }) {
      const { width, height } = view.cell.size();
      const newNode = view.graph.addNode({
        shape: "custom-react-rect",
        x: view.cell.getPosition().x,
        y: view.cell.getPosition().y + height + 60,
        width: 100,
        height: 50,
        attrs: {
          body: {
            rx: 6,
            ry: 6,
            fill: "#dbf8e0",
            stroke: "transparent",
            "stroke-width": 1,
            cursor: "pointer",
          },
          text: {
            fill: "#6f6d6d",
          },
        },
        ports: { ...ports },
        label: "",
      });
      view.graph.addEdge({
        source: {
          cell: view.cell,
        },
        target: {
          cell: newNode,
        },
        attrs: {
          line: {
            stroke: "rgb(162, 177, 195)",
            strokeWidth: 2,
          },
        },
        zIndex: -1,
        router: {
          name: "orth",
          args: {
            padding: 10,
          },
        },
        connector: {
          name: "rounded",
          args: {
            radius: 10,
          },
        },
      });
      view.cell.removeTools();
    },
  },
};
const addPolygonPanel = {
  name: "button",
  args: {
    markup: [
      {
        tagName: "polygon",
        selector: "button",
        attrs: {
          width: 50,
          height: 25,
          label: "polygon",
          fill: "#ffeef1",
          stroke: "transparent",
          // 指定 refPoints 属性，多边形顶点随图形大小自动缩放
          // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
          points: "0,12.5 25,0 50,12.5 25,25",
        },
      },
    ],
    x: "50%",
    y: "100%",
    offset: { x: -25, y: 40 },
    onClick({ view }: { view: NodeView }) {
      const { width, height } = view.cell.size();
      const newNode = view.graph.addNode({
        shape: "custom-react-polygon",
        x: view.cell.getPosition().x,
        y: view.cell.getPosition().y + height + 60,
        width: 100,
        height: 50,
        attrs: {
          body: {
            refPoints: "0,10 10,0 20,10 10,20",
            fill: "#ffeef1",
            stroke: "transparent",
            "stroke-width": 1,
            cursor: "pointer",
          },
          text: {
            fill: "#6f6d6d",
          },
        },
        label: "",
        ports: { ...ports },
      });
      view.graph.addEdge({
        source: {
          cell: view.cell,
        },
        target: {
          cell: newNode,
        },
        attrs: {
          line: {
            stroke: "rgb(162, 177, 195)",
            strokeWidth: 2,
          },
        },
        router: {
          name: "orth",
          args: {
            padding: 10,
          },
        },
        connector: {
          name: "rounded",
          args: {
            radius: 10,
          },
        },
      });
      view.cell.removeTools();
    },
  },
};
const addRoundRectPanel = {
  name: "button",
  args: {
    markup: [
      {
        tagName: "rect",
        selector: "button",
        attrs: {
          width: 50,
          height: 25,
          rx: 14,
          ry: 16,
          fill: "#dbf4f7",
          stroke: "transparent",
          "stroke-width": 1,
          cursor: "pointer",
        },
      },
    ],
    x: "50%",
    y: "100%",
    offset: { x: 40, y: 40 },
    onClick({ view }: { view: NodeView }) {
      const { width, height } = view.cell.size();
      const newNode = view.graph.addNode({
        shape: "custom-react-round-rect",
        x: view.cell.getPosition().x,
        y: view.cell.getPosition().y + height + 100,
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
          },
          text: {
            fill: "#6f6d6d",
          },
        },
        label: "结束",
        ports: { ...ports },
      });
      view.graph.addEdge({
        source: {
          cell: view.cell,
        },
        target: {
          cell: newNode,
        },
        attrs: {
          line: {
            stroke: "rgb(162, 177, 195)",
            strokeWidth: 2,
          },
        },
        router: {
          name: "orth",
          args: {
            padding: 10,
          },
        },
        connector: {
          name: "rounded",
          args: {
            radius: 10,
          },
        },
      });
      view.cell.removeTools();
    },
  },
};
class TreeNode extends Node {
  private collapsed: boolean = false;

  protected postprocess() {
    this.toggleCollapse(false);
  }

  isCollapsed() {
    return this.collapsed;
  }

  toggleButtonVisibility(visible: boolean) {
    this.attr("buttonGroup", {
      display: visible ? "block" : "none",
    });
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed;
    if (!target) {
      this.attr("buttonSign", {
        d: "M 1 5 9 5 M 5 1 5 9",
        strokeWidth: 1.6,
      });
    } else {
      this.attr("buttonSign", {
        d: "M 2 5 8 5",
        strokeWidth: 1.8,
      });
    }
    this.collapsed = target;
  }
}

TreeNode.config({
  zIndex: 2,
  markup: [
    {
      tagName: "g",
      selector: "buttonGroup",
      children: [
        {
          tagName: "rect",
          selector: "button",
          attrs: {
            "pointer-events": "visiblePainted",
          },
        },
        {
          tagName: "path",
          selector: "buttonSign",
          attrs: {
            fill: "none",
            "pointer-events": "none",
          },
        },
      ],
    },
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ],
  attrs: {
    body: {
      refWidth: "100%",
      refHeight: "100%",
      strokeWidth: 1,
      fill: "#EFF4FF",
      stroke: "#5F95FF",
    },
    label: {
      textWrap: {
        ellipsis: true,
        width: -10,
      },
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      refX: "50%",
      refY: "50%",
      fontSize: 12,
    },
    buttonGroup: {
      refX: "100%",
      refY: "50%",
    },
    button: {
      fill: "#5F95FF",
      stroke: "none",
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: "pointer",
      event: "node:collapse",
    },
    buttonSign: {
      refX: 5,
      refY: -5,
      stroke: "#FFFFFF",
      strokeWidth: 1.6,
    },
  },
});
const FlowEditor = ({
  data,
  updateData,
}: {
  data: ICollection;
  updateData: (collection: ICollection) => void;
}) => {
  const containerRef = useRef(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(data.title);
    if (!containerRef.current) return;
    const container = containerRef.current;
    // #region 初始化画布
    const graph = new Graph({
      container: container,
      grid: true,
      panning: true,
      connecting: {
        allowBlank: false,
        snap: {
          radius: 20,
        },
        allowEdge: false,
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
            },
            zIndex: 0,
          });
        },
        validateConnection({ targetMagnet }) {
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
    // #region 使用插件
    const _transform = new Transform({
      resizing: true,
    });
    graph.use(_transform).use(new Snapline()).use(new History());

    register({
      shape: "custom-react-round-rect",
      width: 100,
      height: 50,
      component: CustomReactRoundRect,
    });
    register({
      shape: "custom-react-rect",
      width: 100,
      height: 50,
      component: CustomReactRect,
    });
    register({
      shape: "custom-react-polygon",
      width: 100,
      height: 50,
      component: CustomReactPolygon,
    });

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
    graph.on("edge:connected", ({ edge }) => {
      if (edge.getSourceCellId() === edge.getTargetCellId()) {
        edge.remove();
      } else if (edge.getTargetCell()) {
        graph.addEdge({
          source: {
            cell: edge.getSourceCellId(),
          },
          target: {
            cell: edge.getTargetCellId(),
          },
          attrs: {
            line: {
              stroke: "rgb(162, 177, 195)",
              strokeWidth: 2,
            },
          },
          zIndex: -1,
          router: {
            name: "orth",
            args: {
              padding: 10,
            },
          },
          connector: {
            name: "rounded",
            args: {
              radius: 10,
            },
          },
        });
        edge.remove();
      }
    });
    graph.on("edge:click", ({ edge }) => {
      edge.addTools({
        name: "button",
        args: {
          markup: [
            {
              tagName: "circle",
              selector: "button",
              attrs: {
                r: 8,
                fill: "#ddd",
              },
            },
            {
              tagName: "text",
              textContent: "x",
              selector: "icon",
              attrs: {
                fill: "white",
                fontSize: 14,
                textAnchor: "middle",
                pointerEvents: "none",
                y: "0.3em",
              },
            },
          ],
          x: "0%",
          y: "0%",
          offset: { x: 40, y: 0 },
          onClick() {
            edge.remove();
          },
        },
      });
    });

    graph.on("cell:click", ({ cell }) => {
      if (cell.isNode()) {
        const cellColor = cell.attrs?.body.fill ?? "#ddd";
        graph.view.svg.style.color = cellColor as string;
        cell.port.ports.forEach((item) => {
          switch (item.group) {
            case "top":
              cell.portProp(item.id!, "args/y", -20);
              break;
            case "bottom":
              cell.portProp(
                item.id!,
                "args/y",
                cell.store.data.size.height + 20
              );
              break;
            case "left":
              cell.portProp(item.id!, "args/x", -20);
              break;
            case "right":
              cell.portProp(
                item.id!,
                "args/x",
                cell.store.data.size.width + 20
              );
              break;
          }
          cell.portProp(item.id!, "attrs/circle/r", 8);
          cell.portProp(item.id!, "attrs/circle/stroke", "transparent");
          cell.portProp(item.id!, "attrs/circle/fill", cellColor);
        });
        if (cell.attrs.body.isStart) {
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
                      r: 8,
                      fill: "#ddd",
                    },
                  },
                  {
                    tagName: "text",
                    textContent: "x",
                    selector: "icon",
                    attrs: {
                      fill: "white",
                      fontSize: 14,
                      textAnchor: "middle",
                      pointerEvents: "none",
                      y: "0.3em",
                    },
                  },
                ],
                x: "100%",
                y: "0%",
                offset: { x: -6, y: 6 },
                onClick({ cell }: { cell: Cell }) {
                  cell.remove();
                },
              },
            },
          ]);
        }
      }
    });

    graph.on("node:port:click", ({ view, e }) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      view.cell.addTools([addRectPanel, addPolygonPanel, addRoundRectPanel]);
    });

    if (data.content) {
      graph.fromJSON(JSON.parse(data.content));
    } else {
      graph.addNode({
        shape: "custom-react-round-rect",
        x: 300,
        y: 100,
        attrs: {
          body: { fill: "#dbf4f7", isStart: true },
        },
        width: 100,
        height: 50,
        label: "开始",
        ports: { ...ports },
      });
      data.title = "使用示例";
      data.content = JSON.stringify(graph.toJSON());
      updateData({
        ...data,
      });
    }

    graph.centerContent();

    const pointerDownHandler = (e) => {
      // 假设 `graph` 是你的 X6 图对象
      const allCells = graph.getCells();
      // 筛选出所有的节点对象
      const allNodes = allCells.filter((cell) => cell.isNode());
      const allEdge = allCells.filter((cell) => cell.isEdge());
      if (e.target.classList.contains("x6-port-body")) {
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
              node.portProp(item.id!, "attrs/circle/r", 6);
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
              case "top":
                node.portProp(item.id!, "args/y", 0);
                break;
              case "bottom":
                node.portProp(item.id!, "args/y", node.store.data.size.height);
                break;
              case "left":
                node.portProp(item.id!, "args/x", 0);
                break;
              case "right":
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

    const timer = setInterval(() => {
      updateData({
        ...data,
        content: JSON.stringify(graph.toJSON()),
      });
    }, 3000);

    document.addEventListener("pointerdown", pointerDownHandler);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        updateData({
          ...data,
          content: JSON.stringify(graph.toJSON()),
        });
      }
    });
    return () => {
      document.removeEventListener("pointerdown", pointerDownHandler);
      clearInterval(timer);
      updateData({
        ...data,
        content: JSON.stringify(graph.toJSON()),
      });
      graph.dispose();
    };
  }, [data, updateData]);

  return (
    <div className={[s.container].join(" ")}>
      <Input
        className={s.title}
        placeholder="请输入标题"
        value={title}
        onChange={(val) => {
          setTitle(val);
          updateData({
            ...data,
            title: title,
          });
        }}
      />
      <div className={[s.graphBox].join(" ")} ref={containerRef}></div>
    </div>
  );
};

export default FlowEditor;
