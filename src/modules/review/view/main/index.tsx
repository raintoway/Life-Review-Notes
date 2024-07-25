import { useCallback, useEffect, useMemo, useState } from "react";
import s from "./index.module.scss";
import FlowEditor from "../components/flow";
import { nanoid } from "nanoid";
import LocalStorage from "../../../../common/storage/localstorage";
import { Button, Dialog, Picker } from "antd-mobile";
import { AddOutline, ContentOutline, DeleteOutline } from "antd-mobile-icons";
type Props = {
  data: ICollection[];
  localStorage: LocalStorage;
  currentCollectionKey: string;
};
export interface ICollection {
  key: string;
  title: string;
  content: string;
}
export default function Flow(props: Props) {
  const { localStorage } = props;
  const [collections, setCollections] = useState<ICollection[]>(props.data);
  const [currentCollectionKey, setCurrentCollectionKey] = useState<string>(
    props.currentCollectionKey
  );
  const currentCollection = useMemo(() => {
    return collections.find((item) => item.key === currentCollectionKey);
  }, [collections, currentCollectionKey]);
  const updateCollection = (
    collection: {
      key: string;
      title: string;
      content: string;
    },
    syncToView?: boolean
  ) => {
    const { key, title, content } = collection;
    const target = collections.find((item) => {
      return item.key === key;
    });
    if (target) {
      target.title = title;
      target.content = content;
      localStorage.updateData("review", "data", collections);
      syncToView && setCollections([...collections]);
    }
  };
  useEffect(() => {
    localStorage.updateData(
      "review",
      "currentCollectionKey",
      currentCollectionKey
    );
    localStorage.updateData("review", "data", collections);
  }, [currentCollectionKey, localStorage, collections]);

  const initTemplate = () => {
    const key = nanoid();
    const initCollection = [
      {
        key: key,
        title:
          "使用示例：一件事情的复盘 = 一颗决策树 = 为什么这么做，为什么不这么做 = 流程图",
        content:
          '{"cells":[{"position":{"x":0,"y":0},"size":{"width":100,"height":50},"attrs":{"text":{"fill":"#6f6d6d","text":"开始"},"body":{"stroke":"transparent","fill":"#dbf4f7","rx":20,"ry":22,"stroke-width":1,"cursor":"pointer","padding":10,"isStart":true},"label":{"textWrap":{"width":"100%","height":"100%","ellipsis":true,"breakWord":false}}},"visible":true,"shape":"custom-rect","ports":{"groups":{"bottom":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"100%"},"name":"absolute"}},"outer-bottom":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"100%"},"name":"absolute"}},"top":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"0%"},"name":"absolute"}},"outer-top":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"0%"},"name":"absolute"}},"left":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"0%","y":"50%"},"name":"absolute"}},"outer-left":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"0%","y":"50%"},"name":"absolute"}},"right":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"100%","y":"50%"},"name":"absolute"}},"outer-right":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"100%","y":"50%"},"name":"absolute"}}},"items":[{"group":"top","id":"aa202c8a-6a48-40ea-9f82-0b2fb042e39a"},{"group":"outer-top","id":"72825ab7-3e9d-402e-8cbe-6f4f7ec6e9a2"},{"group":"bottom","id":"f63588a7-e090-4ae8-8899-1063f513eea2"},{"group":"outer-bottom","id":"bcd70df2-74a3-4c06-ae22-d1d4d87b9a22"},{"group":"left","id":"17391854-870a-4cad-838c-8d1169ad21d2"},{"group":"outer-left","id":"d607a84c-12da-49a7-99d7-8e1986a636a7"},{"group":"right","id":"c32cd9eb-2fb7-4268-895d-e71138c9c304"},{"group":"outer-right","id":"cbe9de2e-9b6f-4747-85d4-a7e36782bfc7"}]},"id":"3c5c7d5a-d7af-413a-b05b-4bf70d86b73d","zIndex":1}]}',
      },
    ];
    setCollections(initCollection);
    setCurrentCollectionKey(key);
  };

  const init = useCallback(async () => {
    const initFlag = await localStorage.getData("review", "initFlag");
    if (!initFlag) {
      if (props.data.length === 0) {
        initTemplate();
        localStorage.updateData("review", "initFlag", true);
      }
    }
  }, [props.data, localStorage]);

  useEffect(() => {
    init();
  }, [init]);

  const addReview = () => {
    const key = nanoid();
    setCollections([...collections, { key: key, title: "", content: "" }]);
    requestAnimationFrame(() => {
      setCurrentCollectionKey(key);
      localStorage.updateData("review", "data", collections);
    });
  };
  const delReview = (key: string) => {
    const index = collections.findIndex((item) => {
      return item.key == key;
    });
    if (index !== -1) {
      collections.splice(index, 1);
      setCollections([...collections]);
      requestAnimationFrame(() => {
        if (currentCollectionKey === key) {
          setCurrentCollectionKey(collections[0].key);
        }
        localStorage.updateData("review", "data", collections);
      });
    }
  };
  return (
    <div className={s.container}>
      {currentCollection && (
        <>
          <FlowEditor
            data={currentCollection}
            updateData={updateCollection}
          ></FlowEditor>

          <Button
            color="primary"
            fill="none"
            onClick={addReview}
            className={s.addReviewBtn}
          >
            <AddOutline />
          </Button>
          <Picker
            columns={[
              collections.map((item, index) => {
                return { label: item.title, value: item.key, index: index };
              }),
            ]}
            value={[currentCollectionKey]}
            onConfirm={(value) => {
              if (value.length) {
                // @ts-expect-error 正常错误
                setCurrentCollectionKey(value[0]);
              }
            }}
            onSelect={(val, extend) => {
              console.log("onSelect", val, extend.items);
            }}
            renderLabel={(item) => {
              return (
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "blod",
                    lineHeight: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      maxWidth: "70vw" /* 设置容器宽度 */,
                      whiteSpace: "nowrap" /* 不自动换行 */,
                      overflow: "hidden" /* 隐藏溢出的内容 */,
                      textOverflow: "ellipsis" /* 显示省略号 */,
                      display: "inline-block",
                    }}
                  >
                    {item.label || "无题"}
                  </span>

                  {
                    // @ts-expect-error 正常错误
                    item.index > 0 ? (
                      <DeleteOutline
                        onClick={() => {
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
                                确定删除{item.label}吗？
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
                                    delReview(item.value as string);
                                  },
                                },
                              ],
                            ],
                          });
                        }}
                        color="#ffe3e8"
                        style={{ marginLeft: "10px" }}
                        fontSize={"1.4rem"}
                      />
                    ) : (
                      <span
                        style={{
                          width: "1.4rem",
                          display: "inline-block",
                          marginLeft: "10px",
                        }}
                      ></span>
                    )
                  }
                </span>
              );
            }}
          >
            {
              // @ts-expect-error 正常错误
              (items, { open }) => {
                return (
                  <Button className={s.listSwitch} onClick={open}>
                    <ContentOutline />
                  </Button>
                );
              }
            }
          </Picker>
        </>
      )}
    </div>
  );
}
