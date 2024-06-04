import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Swatches } from "@d3/color-legend";
import { nanoid } from "nanoid";

interface IData {
  id: string;
  children: string[];
  type: string;
}
const ForceGraph = () => {
  const svgRef = useRef(null);

  const linkArc = (d) => {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
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
  const [data, setData] = useState<IData[]>([
    {
      id: "Microsoft",
      children: ["Amazon", "HTC"],
      type: "Microsoft",
    },
    {
      id: "Amazon",
      children: ["HTC"],
      type: "Amazon",
    },
    {
      id: "HTC",
      children: [],
      type: "HTC",
    },
  ]);
  useEffect(() => {
    const width = 928;
    const height = 600;
    const mergedData = data;
    const types = Array.from(new Set(mergedData.map((d) => d.id)));
    const color = d3.scaleOrdinal(types, d3.schemeCategory10);
    const links = [];
    mergedData.forEach((d) => {
      const cloneD = Object.create(d);
      const { children } = cloneD;
      children.forEach((child) => {
        const rsl = {};
        rsl.source = cloneD.id;
        rsl.target = child;
        links.push(rsl);
      });
    });
    const nodes = Array.from(
      new Set(mergedData.flatMap((l) => [l.id])),
      (id) => {
        return { id, color: color(id) };
      }
    );
    console.log(222, nodes, links);

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
      .select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");
    // Per-type markers, as they don't inherit styles.
    svg
      .append("defs")
      .selectAll("marker")
      .data(types)
      .join("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", (d) => {
        return color(d.type);
      })
      .attr(
        "marker-end",
        (d) => `url(${new URL(`#arrow-${d.type}`, location)})`
      );

    const node = svg
      .append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation));

    node
      .append("circle")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("r", 6)
      .attr("fill", (d) => {
        return d.color;
      });
    node
      .append("text")
      .attr("x", 8)
      .attr("y", "0.31em")
      .text((d) => d.id)
      .clone(true)
      .lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3);

    const addNodeIcon = node.append("g");
    addNodeIcon.attr("transform", "translate(-5,7) scale(0.01)");
    addNodeIcon
      .append("path")
      .attr(
        "d",
        "M914.288 420.576l0 109.728q0 22.848-16 38.848t-38.848 16l-237.728 0 0 237.728q0 22.848-16 38.848t-38.848 16l-109.728 0q-22.848 0-38.848-16t-16-38.848l0-237.728-237.728 0q-22.848 0-38.848-16t-16-38.848l0-109.728q0-22.848 16-38.848t38.848-16l237.728 0 0-237.728q0-22.848 16-38.848t38.848-16l109.728 0q22.848 0 38.848 16t16 38.848l0 237.728 237.728 0q22.848 0 38.848 16t16 38.848z"
      )
      .attr("color", (d) => {
        return d.color;
      })
      .on("click", (e) => {
        const targetData = e.target.__data__;
        const addOne = {
          source: targetData.id,
          target: nanoid(),
          type: targetData.id,
        };
        setData([...data, addOne]);
      });

    const delNodeIcon = node.append("g");
    delNodeIcon.attr("transform", "translate(5,7) scale(0.01)");
    delNodeIcon
      .append("path")
      .attr(
        "d",
        "M914.288 420.576l0 109.728q0 22.848-16 38.848t-38.848 16l-237.728 0 0 237.728q0 22.848-16 38.848t-38.848 16l-109.728 0q-22.848 0-38.848-16t-16-38.848l0-237.728-237.728 0q-22.848 0-38.848-16t-16-38.848l0-109.728q0-22.848 16-38.848t38.848-16l237.728 0 0-237.728q0-22.848 16-38.848t38.848-16l109.728 0q22.848 0 38.848 16t16 38.848l0 237.728 237.728 0q22.848 0 38.848 16t16 38.848z"
      )
      .attr("color", (d) => {
        return d.color;
      })
      .on("click", (e) => {
        const targetData = e.target.__data__;
        const targetIndex = data.findIndex(
          (node) => node.source === targetData.id
        );
        console.log(111, targetIndex, targetData.id, data);

        targetIndex > -1 && data.splice(targetIndex, 1);
        setData([...data]);
      });

    simulation.on("tick", () => {
      link.attr("d", linkArc);
      node.attr("transform", (d) => {
        return `translate(${d.x},${d.y})`;
      });
    });

    // invalidation.then(() => simulation.stop());

    return () => {
      // svg.remove();
    };
  }, [data]);

  return <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>;
};
export default ForceGraph;
