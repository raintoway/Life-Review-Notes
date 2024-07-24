import { NodeView } from "@antv/x6";

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
export const ports = {
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
const addRectConfig: Record<string, any> = {
    right: {
        template: { x: '100%', y: '-100%', offset: { x: 40, y: 0 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x + width + 40, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'right', targetPort: 'top'
    },
    bottom: {
        template: { x: '50%', y: '100%', offset: { x: -90, y: 40 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'bottom', targetPort: 'top'
    },
    left: {
        template: { x: '-100%', y: '-100%', offset: { x: 0, y: 0 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x - 100 - 40, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'left', targetPort: 'top'

    },
    top: {
        template: { x: '50%', y: '100%', offset: { x: -90, y: 40 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'bottom', targetPort: 'top'
    },
}
export const addRectPanel = (option: string) => {
    const config = addRectConfig[option]
    return {
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
            x: config.template.x,
            y: config.template.y,
            offset: { x: config.template.offset.x, y: config.template.offset.y },
            onClick({ view }: { view: NodeView }) {
                const nodeConfig = config.node(view)
                const newNode = view.graph.addNode({
                    shape: "custom-rect",
                    x: nodeConfig.x,
                    y: nodeConfig.y,
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
                            padding: 10,
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
                    label: "",
                });
                const sourcePort = view.cell.getPortsByGroup(config.sourcePort);
                const targetPort = newNode.getPortsByGroup(config.targetPort);
                if (sourcePort.length && targetPort.length) {
                    view.graph.addEdge({
                        source: {
                            cell: view.cell,
                            port: sourcePort[0].id,
                        },
                        target: {
                            cell: newNode,
                            port: targetPort[0].id,
                        },
                        zIndex: -1,
                        attrs: {
                            line: {
                                stroke: "rgb(162, 177, 195)",
                                strokeWidth: 2,
                            },
                            text: {
                                fill: "#6f6d6d",
                            },
                        },
                        router: {
                            name: "manhattan",
                        },
                        connector: {
                            name: "rounded",
                            args: {
                                radius: 8,
                            },
                        },
                        label: ''
                    });
                }
                view.cell.removeTools();
            },
        },
    };
}
const addPolygonConfig: Record<string, any> = {
    right: {
        template: { x: '100%', y: '-100%', offset: { x: 40, y: 40 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x + width + 40, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'right', targetPort: 'top'
    },
    bottom: {
        template: { x: '50%', y: '100%', offset: { x: -25, y: 40 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'bottom', targetPort: 'top'
    },
    left: {
        template: { x: '-100%', y: '-100%', offset: { x: 0, y: 40 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x - 100 - 40, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'left', targetPort: 'top'
    },
    top: {
        template: { x: '50%', y: '100%', offset: { x: -25, y: 40 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'bottom', targetPort: 'top'
    },
}
export const addPolygonPanel = (option: string) => {
    const config = addPolygonConfig[option]
    return {
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
                        points: "0,12.5 25,0 50,12.5 25,25",
                    },
                },
            ],
            x: config.template.x,
            y: config.template.y,
            offset: { x: config.template.offset.x, y: config.template.offset.y },
            onClick({ view }: { view: NodeView }) {
                const nodeConfig = config.node(view)
                const newNode = view.graph.addNode({
                    shape: "custom-polygon",
                    x: nodeConfig.x,
                    y: nodeConfig.y,
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
                        label: {
                            textWrap: {
                                width: "100%",
                                height: "100%",
                                ellipsis: true,
                                breakWord: false,
                            },
                        },
                    },
                    label: "",
                    ports: { ...ports },
                });
                const sourcePort = view.cell.getPortsByGroup(config.sourcePort);
                const targetPort = newNode.getPortsByGroup(config.targetPort);
                if (sourcePort.length && targetPort.length) {
                    view.graph.addEdge({
                        source: {
                            cell: view.cell,
                            port: sourcePort[0].id,
                        },
                        target: {
                            cell: newNode,
                            port: targetPort[0].id,
                        },
                        attrs: {
                            line: {
                                stroke: "rgb(162, 177, 195)",
                                strokeWidth: 2,
                            },
                            text: {
                                fill: "#6f6d6d",
                            },
                        },
                        zIndex: -1,
                        router: {
                            name: "manhattan",
                        },
                        connector: {
                            name: "rounded",
                            args: {
                                radius: 8,
                            },
                        },
                        label: ''
                    });
                }
                view.cell.removeTools();
            },
        },
    };
}
const addRoundRectConfig: Record<string, any> = {
    right: {
        template: { x: '100%', y: '-100%', offset: { x: 40, y: 80 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x + width + 40, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'right', targetPort: 'top'
    },
    bottom: {
        template: { x: '50%', y: '100%', offset: { x: 40, y: 40 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'bottom', targetPort: 'top'
    },
    left: {
        template: { x: '-100%', y: '-100%', offset: { x: 0, y: 80 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x - 100 - 40, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'left', targetPort: 'top'
    },
    top: {
        template: { x: '50%', y: '100%', offset: { x: 40, y: 40 } }, node: (view: NodeView) => {
            const { width, height } = view.cell.size();
            return { x: view.cell.getPosition().x, y: view.cell.getPosition().y + height + 60 }
        }, sourcePort: 'bottom', targetPort: 'top'
    },
}
export const addRoundRectPanel = (option: string) => {
    const config = addRoundRectConfig[option]
    return {
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
            x: config.template.x,
            y: config.template.y,
            offset: { x: config.template.offset.x, y: config.template.offset.y },
            onClick({ view }: { view: NodeView }) {
                const nodeConfig = config.node(view)
                const newNode = view.graph.addNode({
                    shape: "custom-rect",
                    x: nodeConfig.x,
                    y: nodeConfig.y,
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
                    label: "结束",
                });
                const sourcePort = view.cell.getPortsByGroup(config.sourcePort);
                const targetPort = newNode.getPortsByGroup(config.targetPort);
                if (sourcePort.length && targetPort.length) {
                    view.graph.addEdge({
                        source: {
                            cell: view.cell,
                            port: sourcePort[0].id,
                        },
                        target: {
                            cell: newNode,
                            port: targetPort[0].id,
                        },
                        attrs: {
                            line: {
                                stroke: "rgb(162, 177, 195)",
                                strokeWidth: 2,
                            },
                            text: {
                                fill: "#6f6d6d",
                            },
                        },
                        zIndex: -1,
                        router: {
                            name: "manhattan",
                        },
                        connector: {
                            name: "rounded",
                            args: {
                                radius: 8,
                            },
                        },
                        label: ''
                    });
                }
                view.cell.removeTools();
            },
        },
    };
}
