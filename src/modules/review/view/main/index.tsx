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
  }, [currentCollectionKey, localStorage]);

  const initTemplate = () => {
    const key = nanoid();
    setCollections([
      {
        key: key,
        title:
          "使用示例：一件事情的复盘 = 一颗决策树 = 为什么这么做，为什么不这么做 = 流程图",
        content:
          '{"cells":[{"position":{"x":300,"y":100},"size":{"width":100,"height":50},"view":"react-shape-view","attrs":{"body":{"fill":"#dbf4f7","isStart":true}},"shape":"custom-react-round-rect","id":"f94d013b-2193-400f-861f-ee8272a69bbf","label":"开始","ports":{"groups":{"bottom":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"100%"},"name":"absolute"}},"top":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"0%"},"name":"absolute"}},"left":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"0%","y":"50%"},"name":"absolute"}},"right":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"100%","y":"50%"},"name":"absolute"}}},"items":[{"group":"top","id":"8c7b0c58-e822-43b7-aaa6-cf8b1002de46"},{"group":"bottom","id":"134d4f2b-5c19-4937-9b88-b8da6b87502b"},{"group":"left","id":"3028a6dc-330a-4673-ad2d-0661b156b1dc"},{"group":"right","id":"84a563b2-575e-4eb8-a902-339b618064c0"}]},"zIndex":1}]}',
      },
    ]);
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
                  {item.index > 0 ? (
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
                  )}
                </span>
              );
            }}
          >
            {(items, { open }) => {
              return (
                <Button className={s.listSwitch} onClick={open}>
                  <ContentOutline />
                </Button>
              );
            }}
          </Picker>
        </>
      )}
    </div>
  );
}
