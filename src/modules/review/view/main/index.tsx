import { useEffect, useMemo, useState } from "react";
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
  const [collections, setCollections] = useState<ICollection[]>(
    props.data.length ? props.data : [{ key: nanoid(), title: "", content: "" }]
  );
  const [currentCollectionKey, setCurrentCollectionKey] = useState<string>(
    props.currentCollectionKey || collections[0].key
  );
  const currentCollection = useMemo(() => {
    return collections.find((item) => item.key === currentCollectionKey);
  }, [collections, currentCollectionKey]);
  const updateCollection = (collection: {
    key: string;
    title: string;
    content: string;
  }) => {
    const { key, title, content } = collection;
    const target = collections.find((item) => {
      return item.key === key;
    });
    if (target) {
      target.title = title;
      target.content = content;
      localStorage.updateData("review", "data", collections);
    }
  };
  useEffect(() => {
    localStorage.updateData(
      "review",
      "currentCollectionKey",
      currentCollectionKey
    );
  }, [currentCollectionKey, localStorage]);
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
                  {item.label || "无题"}
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
                                style: { color: "#ffe3e8" },
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
