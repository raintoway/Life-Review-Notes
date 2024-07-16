import {
  useRef,
  useEffect,
  useState,
  RefObject,
  MutableRefObject,
  useCallback,
} from "react";
import * as d3 from "d3";
import { nanoid } from "nanoid";
import { Button, Dialog, Input } from "antd-mobile";
import randomColor from "randomcolor";
import LocalStorage from "../../../../common/storage/localstorage";
import s from "./index.module.scss";
import { AddCircleOutline } from "antd-mobile-icons";

interface IProps {
  data: IData[];
  transform: ITransform;
  localStorage: LocalStorage;
}
export interface IData {
  id: string;
  label: string;
  children: string[];
  type: string;
  color?: string;
}
export interface ITransform {
  scale: number;
  translateX: number;
  translateY: number;
}
export const defaultTransform = {
  translateX: 0,
  translateY: 0,
  scale: 2,
};
const AbstractConcreteLibrary = (props: IProps) => {
  const { localStorage } = props;
  const currentElementRef = useRef<SVGElement>();
  const operationBoxRef = useRef();
  const containerRef =
    useRef<MutableRefObject<RefObject<HTMLDivElement> | null>>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [currentNode, setCurrentNode] = useState<IData | null>(null);
  const [data, setData] = useState<IData[]>(props.data);
  const transformRef = useRef<ITransform>(props.transform);

  const linkArc = (d) => {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
  };

  const initTemplate = () => {
    setData([
      {
        id: nanoid(),
        label: "抽象",
        children: [],
        type: "node",
        color: "pink",
      },
    ]);
  };

  const init = useCallback(async () => {
    const initFlag = await localStorage.getData(
      "abstract-concrete-library",
      "initFlag"
    );
    if (!initFlag) {
      if (Array.isArray(props.data) && props.data.length === 0) {
        initTemplate();
        localStorage.updateData("abstract-concrete-library", "initFlag", true);
      }
    }
  }, [props.data, localStorage]);

  useEffect(() => {
    init();
  }, [init]);

  const addNode = () => {
    setData([
      ...data,
      {
        id: nanoid(),
        label: "新建节点",
        children: [],
        type: "node",
        color: randomColor(),
      },
    ]);
  };

  const drag = (simulation) => {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const focusElement = () => {
    if (currentElementRef.current && operationBoxRef.current) {
      const data = currentElementRef.current.__data__;
      if (data.svgType === "node") {
        const { color } = data;
        const rect = currentElementRef.current.getBBox();
        const { width, height } = rect;
        const translateRegex = /translate\(([^)]+)\)/;
        const match = currentElementRef.current
          .getAttribute("transform")
          .match(translateRegex);
        if (match && match[1]) {
          // 分割参数并去除可能的空格
          const values = match[1].split(",").map(function (value) {
            return value.trim();
          });

          // 返回x和y的值
          const rsl = {
            x: parseFloat(values[0]),
            y: parseFloat(values[1]),
          };
          operationBoxRef.current
            .raise()
            .attr(
              "transform",
              `translate(${rsl.x + width / 2},${
                rsl.y + height / 2
              }) scale(0.01)`
            )
            .selectAll("path")
            .attr("fill", (d) => {
              return color;
            });
          operationBoxRef.current
            .select("*:nth-child(1)")
            .style("display", "block");
          operationBoxRef.current
            .select("*:nth-child(2)")
            .style("display", "block");
        }
      } else if (data.svgType === "link") {
        const { color } = data.source;
        // 假设你已经有一个SVG path元素，它包含一个圆弧
        const pathElement = currentElementRef.current;
        // 获取圆弧的总长度
        var totalLength = pathElement.getTotalLength();

        // 圆弧的中点长度
        var midLength = totalLength / 2;

        // 使用getPointAtLength()方法找到中点的坐标
        var midPoint = pathElement.getPointAtLength(midLength);
        operationBoxRef.current
          .attr(
            "transform",
            `translate(${midPoint.x},${midPoint.y}) scale(0.01)`
          )
          .selectAll("path")
          .attr("fill", (d) => {
            return color;
          });
        operationBoxRef.current
          .select("*:nth-child(1)")
          .style("display", "none");
        operationBoxRef.current
          .select("*:nth-child(2)")
          .style("display", "none");
      }
    }
  };

  const syncTransformToLocalStorage = useCallback(() => {
    if (localStorage) {
      localStorage.updateData(
        "abstract-concrete-library",
        "transform",
        transformRef.current
      );
    }
  }, [localStorage]);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const links = [];
      data.forEach((d) => {
        const cloneD = Object.create(d);
        const { children } = cloneD;
        children.forEach((child) => {
          const rsl = {};
          rsl.source = cloneD.id;
          rsl.color = cloneD.color;
          rsl.target = child;
          rsl.type = cloneD.id;
          rsl.svgType = "link";
          links.push(rsl);
        });
      });
      const nodes = data.map((item) => {
        return {
          id: item.id,
          color: item.color,
          svgType: "node",
          label: item.label,
        };
      });
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink(links).id((d) => d.id)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("x", d3.forceX())
        .force("y", d3.forceY());
      const svg = d3
        .select(containerRef.current)
        .append("svg")
        .on("click", (e) => {
          if (e.target === svg.node()) {
            operationBoxRef.current
              .lower()
              .attr("transform", `translate(-99999,-99999) scale(0.01)`)
              .selectAll("path");
          }
        })
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        // .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");

      const g = svg.append("g");
      const svgDrag = () => {
        function dragstarted(event, d) {}

        function dragged(event, d) {
          transformRef.current.translateX += event.dx;
          transformRef.current.translateY += event.dy;
          syncTransformToLocalStorage();
          g.attr(
            "transform",
            `translate(${transformRef.current.translateX},${transformRef.current.translateY}) scale(${transformRef.current.scale})`
          );
        }

        function dragended(event, d) {}

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      };
      svg.call(svgDrag());

      const zoomed = (args) => {
        const { transform } = args;
        const { k } = transform;
        transformRef.current.scale = k;
        syncTransformToLocalStorage();
        g.attr(
          "transform",
          `translate(${transformRef.current.translateX},${transformRef.current.translateY}) scale(${transformRef.current.scale})`
        );
      };
      const zoom = d3.zoom().scaleExtent([0.5, 32]).on("zoom", zoomed);
      svg
        .call(zoom)
        .call(
          zoom.transform,
          d3.zoomIdentity.scale(transformRef.current.scale)
        );
      // Per-type markers, as they don't inherit styles.
      g.append("defs")
        .selectAll("marker")
        .data(data)
        .join("marker")
        .attr("id", (d) => `arrow-${d.id}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", (d) => {
          return d.color;
        })
        .attr("d", "M0,-5L10,0L0,5");
      // .on("pine");

      const operationBox = g.append("g");
      operationBoxRef.current = operationBox;
      operationBox.attr("transform", "translate(-999999,-999999) scale(0.01)");
      operationBox
        .append("g")
        .attr("transform", "")
        .append("path")
        .attr(
          "d",
          "M1145.43 18.034a182.272 182.272 0 0 0-63.176-14.166c-74.382-12.8-175.331 6.856-255.232 49.664 23.61-57.571-66.133-32.37-100.352-23.41-109.91 28.445-208.782 79.93-296.732 150.13 7.765-48.896-54.045-20.423-98.418 16.27-87.353 72.306-156.786 158.635-199.196 263.169-37.803 93.041-37.49 187.278-3.584 274.944C243.285 608.34 352.313 487.566 492.516 366.194c156.956-135.965 344.66-240.64 453.546-250.027C535.524 322.475 264.192 663.78 0 1012.423h457.415v-17.635H48.242a59.164 59.164 0 0 0 21.19-15.048c30.465-33.251 55.41-71.566 87.667-103.168 40.618-39.822 43.008-36.55 77.937-37.432 67.983-1.792 136.818-6.713 203.577-18.944 142.023-25.942 263.282-90.653 356.011-202.326 23.154-27.875 45.54-75.15-14.194-73.386 21.05-9.956 36.125-15.93 50.062-23.695 108.829-60.53 209.807-129.877 273.721-239.616 17.323-29.525 37.035-86.186-21.361-75.15 32.113-31.289 63.914-57.088 89.144-87.979 37.803-45.767 27.933-77.368-26.567-100.039z"
        )
        .on("click", (e) => {
          setEditVisible(true);
          const currentData = currentElementRef.current?.__data__;
          const { id } = currentData;
          const node = data.find((item) => item.id === id);
          node && setCurrentNode(node);
        });
      operationBox
        .append("g")
        .attr("transform", "translate(1600,0)")
        .append("path")
        .attr(
          "d",
          "M914.288 420.576l0 109.728q0 22.848-16 38.848t-38.848 16l-237.728 0 0 237.728q0 22.848-16 38.848t-38.848 16l-109.728 0q-22.848 0-38.848-16t-16-38.848l0-237.728-237.728 0q-22.848 0-38.848-16t-16-38.848l0-109.728q0-22.848 16-38.848t38.848-16l237.728 0 0-237.728q0-22.848 16-38.848t38.848-16l109.728 0q22.848 0 38.848 16t16 38.848l0 237.728 237.728 0q22.848 0 38.848 16t16 38.848z"
        )
        .on("click", (e) => {
          if (currentElementRef.current) {
            const currentData = currentElementRef.current.__data__;
            if (currentData.svgType === "node") {
              const newId = nanoid(8);
              const addOne = {
                id: newId,
                label: newId,
                children: [],
                type: newId,
                color: randomColor(),
              };
              const source = data.find((node) => node.id === currentData.id);
              source?.children.push(newId);
              setData([...data, addOne]);
            }
          }
        });
      operationBox
        .append("g")
        .attr("transform", "translate(3200,0)")
        .append("path")
        .attr("data-del-btn", "1")
        .attr(
          "d",
          "M85.333333 512a64 64 0 0 1 64-64h725.333334a64 64 0 0 1 0 128h-725.333334A64 64 0 0 1 85.333333 512z"
        )
        .on("click", (e) => {
          if (currentElementRef.current) {
            const currentData = currentElementRef.current.__data__;
            if (currentData.svgType === "node") {
              const targetIndex = data.findIndex(
                (node) => node.id === currentData.id
              );
              targetIndex > -1 && data.splice(targetIndex, 1);
              data.forEach((node) => {
                const findIndex = node.children.indexOf(currentData.id);
                findIndex >= 0 && node.children.splice(findIndex, 1);
              });
              setData([...data]);
            } else if (currentData.svgType === "link") {
              const { id } = currentData.target;
              data.forEach((node) => {
                const findIndex = node.children.indexOf(id);
                findIndex >= 0 && node.children.splice(findIndex, 1);
              });
              setData([...data]);
            }
          }
        });

      const link = g
        .append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", (d) => {
          return d.color;
        })
        .attr(
          "marker-end",
          (d) => `url(${new URL(`#arrow-${d.type}`, location)})`
        )
        .on("click", (e) => {
          currentElementRef.current = e.currentTarget;
          focusElement();
        });

      const node = g
        .append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation))
        .on("click", (e) => {
          currentElementRef.current = e.currentTarget;
          focusElement();
        });

      node
        .append("circle")
        .attr("stroke", "transparent")
        .attr("stroke-width", 6)
        .attr("r", 6)
        .attr("fill", (d) => {
          return d.color;
        });

      node
        .append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .attr("stroke", (d) => d.color)
        .text((d) => d.label)
        .style("opacity", "0.6")
        .clone(true)
        .lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3);

      simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", (d) => {
          return `translate(${d.x},${d.y})`;
        });
      });

      // invalidation.then(() => simulation.stop());
      if (localStorage) {
        localStorage.updateData("abstract-concrete-library", "data", data);
      }
      return () => {
        svg.remove();
      };
    }
  }, [data, localStorage, syncTransformToLocalStorage]);

  return (
    <>
      <div
        style={{ width: "100%", height: "calc(100vh - 55px)" }}
        id="svgContainer"
        ref={containerRef}
      ></div>
      <Dialog
        visible={editVisible}
        content={
          <>
            {currentNode ? (
              <div className={[s.item].join(" ")}>
                <div
                  style={{
                    width: "80px",
                    color: currentNode.color,
                  }}
                >
                  名称：
                </div>
                <Input
                  style={{
                    "--color": currentNode.color,
                  }}
                  placeholder="请输入内容"
                  value={currentNode.label}
                  onChange={(val) => {
                    currentNode.label = val;
                    setCurrentNode({ ...currentNode });
                  }}
                />
              </div>
            ) : null}
          </>
        }
        closeOnAction
        onClose={() => {
          setEditVisible(false);
        }}
        actions={[
          [
            {
              key: "cancel",
              text: "取消",
              onClick: () => {
                setEditVisible(false);
              },
              style: { color: "#6f6d6d" },
            },
            {
              key: "confirm",
              text: "修改",
              onClick: () => {
                if (currentNode) {
                  const { id } = currentNode;
                  const target = data.find((item) => item.id === id);
                  if (target && currentNode) {
                    target.label = currentNode.label;
                    setData([...data]);
                  }
                }
              },
              style: { color: currentNode?.color },
            },
          ],
        ]}
      />
      <div className={s.operation}>
        <Button
          color="primary"
          fill="none"
          onClick={addNode}
          className={s.lowerMintGreen}
        >
          <AddCircleOutline />
        </Button>
      </div>
    </>
  );
};
export default AbstractConcreteLibrary;
