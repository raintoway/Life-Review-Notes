// @ts-nocheck
import { Node } from "@antv/x6";
export const revisePort = (node: Node) => {
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
}