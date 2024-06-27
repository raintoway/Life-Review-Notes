import { Graph, Shape } from "@antv/x6";
import { Stencil } from "@antv/x6-plugin-stencil";
import { Transform } from "@antv/x6-plugin-transform";
import { Selection } from "@antv/x6-plugin-selection";
import { Snapline } from "@antv/x6-plugin-snapline";
import { History } from "@antv/x6-plugin-history";
import { useEffect, useRef } from "react";
import s from "./index.module.scss";

const FlowEditor = () => {
  const containerRef = useRef(null);
  const stencilRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    // #region 初始化画布
    const graph = new Graph({
      container: container,
      grid: true,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: "ctrl",
        minScale: 0.5,
        maxScale: 3,
      },
      connecting: {
        router: "manhattan",
        connector: {
          name: "rounded",
          args: {
            radius: 8,
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
    // #endregion

    // #region 使用插件
    graph
      .use(new Transform({}))
      .use(
        new Selection({
          rubberband: true,
          showNodeSelectionBox: true,
        })
      )
      .use(new Snapline())
      .use(new History());
    // #endregion

    // #region 初始化 stencil
    const stencil = new Stencil({
      title: "流程图",
      target: graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: 180,
      collapsable: true,
      groups: [
        {
          title: "基础流程图",
          name: "group1",
        },
      ],
      layoutOptions: {
        columns: 2,
        columnWidth: 80,
        rowHeight: 55,
      },
    });
    stencilRef.current!.appendChild(stencil.container);
    // #endregion

    // 控制连接桩显示/隐藏
    const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
      for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = show ? "visible" : "hidden";
      }
    };
    graph.on("node:mouseenter", () => {
      const container = containerRef.current;
      if (!container) return;
      const ports = container.querySelectorAll(
        ".x6-port-body"
      ) as NodeListOf<SVGElement>;
      showPorts(ports, true);
    });
    graph.on("node:mouseleave", () => {
      const container = containerRef.current;
      if (!container) return;
      const ports = container.querySelectorAll(
        ".x6-port-body"
      ) as NodeListOf<SVGElement>;
      showPorts(ports, false);
    });
    // #endregion
    // #region 初始化图形
    const ports = {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#5F95FF",
              strokeWidth: 1,
              fill: "#fff",
              style: {
                visibility: "hidden",
              },
            },
          },
        },
        right: {
          position: "right",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#5F95FF",
              strokeWidth: 1,
              fill: "#fff",
              style: {
                visibility: "hidden",
              },
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#5F95FF",
              strokeWidth: 1,
              fill: "#fff",
              style: {
                visibility: "hidden",
              },
            },
          },
        },
        left: {
          position: "left",
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: "#5F95FF",
              strokeWidth: 1,
              fill: "#fff",
              style: {
                visibility: "hidden",
              },
            },
          },
        },
      },
      items: [
        {
          group: "top",
        },
        {
          group: "right",
        },
        {
          group: "bottom",
        },
        {
          group: "left",
        },
      ],
    };

    Graph.registerNode(
      "custom-rect",
      {
        inherit: "rect",
        width: 66,
        height: 36,
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
        width: 66,
        height: 36,
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
          items: [
            {
              group: "top",
            },
            {
              group: "bottom",
            },
          ],
        },
      },
      true
    );

    Graph.registerNode(
      "custom-circle",
      {
        inherit: "circle",
        width: 45,
        height: 45,
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

    const r1 = graph.createNode({
      shape: "custom-rect",
      label: "开始",
      attrs: {
        body: {
          rx: 20,
          ry: 26,
        },
      },
    });
    const r2 = graph.createNode({
      shape: "custom-rect",
      label: "过程",
    });
    const r3 = graph.createNode({
      shape: "custom-rect",
      attrs: {
        body: {
          rx: 6,
          ry: 6,
        },
      },
      label: "可选过程",
    });
    const r4 = graph.createNode({
      shape: "custom-polygon",
      attrs: {
        body: {
          refPoints: "0,10 10,0 20,10 10,20",
        },
      },
      label: "决策",
    });
    const r5 = graph.createNode({
      shape: "custom-polygon",
      attrs: {
        body: {
          refPoints: "10,0 40,0 30,20 0,20",
        },
      },
      label: "数据",
    });
    const r6 = graph.createNode({
      shape: "custom-circle",
      label: "连接",
    });
    stencil.load([r1, r2, r3, r4, r5, r6], "group1");
  }, []);
  return (
    <div className={[s.container].join(" ")}>
      <div className={[ s.graphBox].join(" ")} ref={containerRef}></div>
      <div className={s.stencilBox} ref={stencilRef}></div>
    </div>
  );
};

export default FlowEditor;
