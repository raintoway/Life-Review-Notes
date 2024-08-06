import { useCallback, useEffect, useMemo, useState } from "react";
import s from "./index.module.scss";
import FlowEditor from "../components/flow";
import { nanoid } from "nanoid";
import LocalStorage from "../../../../common/storage/localstorage";
import { Button, CascadePicker, Dialog, Input, TextArea } from "antd-mobile";
import { ContentOutline, DeleteOutline } from "antd-mobile-icons";
import { PickerColumnItem } from "antd-mobile/es/components/picker-view";
type Props = {
  category: ICategory[];
  localStorage: LocalStorage;
  activeCategory: string[];
};
export interface ICollection {
  value: string;
  label: string;
  content: string;
}
export interface ICategory {
  label: string;
  value: string;
  children: ICollection[];
}
export default function Flow(props: Props) {
  const { localStorage } = props;
  const [activeCategory, setActiveCategory] = useState<string[]>(
    props.activeCategory ?? []
  );
  const [category, setCategory] = useState<ICategory[]>(props.category);
  const currentCategory = useMemo(() => {
    if (activeCategory.length === 2) {
      const currentCategory = category.find(
        (item) => item.value === activeCategory[0]
      );
      return currentCategory ?? null;
    } else return null;
  }, [category, activeCategory]);
  const currentCollection = useMemo(() => {
    if (activeCategory.length === 2 && currentCategory) {
      return (
        currentCategory?.children.find(
          (item) => item.value === activeCategory[1]
        ) ?? null
      );
    } else return null;
  }, [activeCategory, currentCategory]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string[]>([]);
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  const [addCategoryItem, setAddCategoryItem] = useState<ICategory>({
    label: "",
    value: "",
    children: [],
  });
  const [addNoteVisible, setAddNoteVisible] = useState(false);
  const [addNoteItem, setAddNoteItem] = useState<ICollection>({
    label: "",
    value: "",
    content: "",
  });
  const updateCollection = (collection: {
    value: string;
    label: string;
    content: string;
  }) => {
    const { label, content } = collection;
    if (currentCollection) {
      currentCollection.label = label;
      currentCollection.content = content;
      localStorage.updateData("review", "category", category);
    }
  };
  useEffect(() => {
    localStorage.updateData("review", "category", category);
    localStorage.updateData("review", "activeCategory", activeCategory);
  }, [localStorage, category, activeCategory]);

  const initTemplate = () => {
    const key = "category-" + nanoid();
    const secKey = nanoid();
    setCategory([
      {
        value: key,
        label: "工作",
        children: [
          {
            value: secKey,
            label:
              "使用示例：一件事情的复盘 = 一颗决策树 = 为什么这么做，为什么不这么做 = 流程图",
            content:
              '{"cells":[{"position":{"x":0,"y":0},"size":{"width":100,"height":50},"attrs":{"text":{"fill":"#6f6d6d","text":"开始"},"body":{"stroke":"transparent","fill":"#dbf4f7","rx":20,"ry":22,"stroke-width":1,"cursor":"pointer","padding":10,"isStart":true},"label":{"textWrap":{"width":"100%","height":"100%","ellipsis":true,"breakWord":false}}},"visible":true,"shape":"custom-rect","ports":{"groups":{"bottom":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"100%"},"name":"absolute"}},"outer-bottom":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"100%"},"name":"absolute"}},"top":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"0%"},"name":"absolute"}},"outer-top":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"50%","y":"0%"},"name":"absolute"}},"left":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"0%","y":"50%"},"name":"absolute"}},"outer-left":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"0%","y":"50%"},"name":"absolute"}},"right":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"100%","y":"50%"},"name":"absolute"}},"outer-right":{"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#8f8f8f","strokeWidth":1,"fill":"#fff"}},"position":{"args":{"x":"100%","y":"50%"},"name":"absolute"}}},"items":[{"group":"top","id":"aa202c8a-6a48-40ea-9f82-0b2fb042e39a"},{"group":"outer-top","id":"72825ab7-3e9d-402e-8cbe-6f4f7ec6e9a2"},{"group":"bottom","id":"f63588a7-e090-4ae8-8899-1063f513eea2"},{"group":"outer-bottom","id":"bcd70df2-74a3-4c06-ae22-d1d4d87b9a22"},{"group":"left","id":"17391854-870a-4cad-838c-8d1169ad21d2"},{"group":"outer-left","id":"d607a84c-12da-49a7-99d7-8e1986a636a7"},{"group":"right","id":"c32cd9eb-2fb7-4268-895d-e71138c9c304"},{"group":"outer-right","id":"cbe9de2e-9b6f-4747-85d4-a7e36782bfc7"}]},"id":"3c5c7d5a-d7af-413a-b05b-4bf70d86b73d","zIndex":1}]}',
          },
          {
            value: "addNote",
            label: "+",
            content: "",
          },
        ],
      },
      {
        value: "category-addCategory",
        label: "+",
        children: [],
      },
    ]);
    setActiveCategory([key, secKey]);
  };

  const init = useCallback(async () => {
    const initFlag = await localStorage.getData("review", "initFlag");
    if (!initFlag) {
      if (props.category.length === 0) {
        initTemplate();
        localStorage.updateData("review", "initFlag", true);
      }
    }
  }, [props.category, localStorage]);

  useEffect(() => {
    init();
  }, [init]);

  const addNote = () => {
    if (selectedCategoryKey.length === 2) {
      const selectedCategory = category.find(
        (item) => item.value === selectedCategoryKey[0]
      );
      if (selectedCategory) {
        const value = nanoid();
        selectedCategory.children.splice(
          selectedCategory.children.length - 1,
          0,
          {
            value: value,
            label: addNoteItem.label,
            content: "",
          }
        );
        setCategory([...category]);
      }
    }
  };
  const delReview = () => {
    if (selectedCategoryKey.length === 2) {
      const selectedCategory = category.find(
        (item) => item.value === selectedCategoryKey[0]
      );
      if (selectedCategory) {
        const index = selectedCategory.children.findIndex((item) => {
          return item.value == selectedCategoryKey[1];
        });
        if (index !== -1) {
          selectedCategory.children.splice(index, 1);
          setCategory([...category]);
          setActiveCategory([
            selectedCategoryKey[0],
            selectedCategory.children[0].value,
          ]);
        }
      }
    }
  };
  const addCategory = () => {
    if (selectedCategoryKey.length === 2) {
      const value = "category-" + nanoid();
      category.splice(category.length - 1, 0, {
        label: addCategoryItem.label,
        value: value,
        children: [
          {
            value: "addNote",
            label: "+",
            content: "",
          },
        ],
      });
      setCategory([...category]);
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
          <CascadePicker
            className={s.picker}
            options={category}
            visible={menuVisible}
            value={activeCategory}
            onClose={() => {
              setMenuVisible(false);
            }}
            onConfirm={(val) => {
              if (val && Array.isArray(val) && val.length === 2) {
                setActiveCategory(val as string[]);
              }
            }}
            onSelect={(val) => {
              if (val && Array.isArray(val) && val.length === 2) {
                setSelectedCategoryKey(val as string[]);
              }
            }}
            renderLabel={(item: PickerColumnItem) => {
              const flag = (item.value as string)?.split("-") ?? [];
              const isCategory = flag[0] === "category";
              const isAddCategoryBtn =
                flag.length === 2 && flag[1] === "addCategory";
              const isAddNoteBtn = item.value === "addNote";
              return (
                <div
                  style={{
                    width: isCategory ? "100px" : "calc(100vw - 110px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    if (
                      isAddNoteBtn &&
                      selectedCategoryKey.length === 2 &&
                      selectedCategoryKey[1] === "addNote"
                    ) {
                      setAddNoteVisible(true);
                    }
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                    onClick={() => {
                      if (
                        isAddCategoryBtn &&
                        selectedCategoryKey.length === 2 &&
                        selectedCategoryKey[0] === "category-addCategory"
                      ) {
                        setAddCategoryVisible(true);
                      }
                    }}
                  >
                    {item.label || "无题"}
                  </div>
                  {isCategory ? null : selectedCategoryKey.length === 2 &&
                    selectedCategoryKey[1] === item.value &&
                    !isAddNoteBtn ? (
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
                                  delReview();
                                },
                              },
                            ],
                          ],
                        });
                      }}
                      color="#ffe3e8"
                      style={{ marginLeft: "10px", marginRight: "10px" }}
                      fontSize={"1.4rem"}
                    ></DeleteOutline>
                  ) : (
                    <div style={{ width: "45px" }}></div>
                  )}
                </div>
              );
            }}
          />
          <Button className={s.listSwitch} onClick={() => setMenuVisible(true)}>
            <ContentOutline />
          </Button>
        </>
      )}
      <Dialog
        style={{ zIndex: 1001 }}
        visible={addCategoryVisible}
        content={
          <Input
            style={{
              "--text-align": "center",
              "--color": "#6f6d6d",
            }}
            placeholder="请输入分类标题"
            value={addCategoryItem.label}
            onChange={(val) => {
              addCategoryItem.label = val;
              setAddCategoryItem({ ...addCategoryItem });
            }}
          />
        }
        closeOnAction={true}
        closeOnMaskClick={true}
        onClose={() => {
          setAddCategoryVisible(false);
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
              text: "添加",
              style: { color: "pink" },
              onClick: () => {
                if (addCategoryItem.label) {
                  addCategory();
                }
              },
            },
          ],
        ]}
      />
      <Dialog
        style={{ zIndex: 1001 }}
        visible={addNoteVisible}
        content={
          <Input
            style={{
              "--text-align": "center",
              "--color": "#6f6d6d",
            }}
            placeholder="请输入复盘笔记标题"
            value={addNoteItem.label}
            onChange={(val) => {
              addNoteItem.label = val;
              setAddNoteItem({ ...addNoteItem });
            }}
          />
        }
        closeOnAction={true}
        closeOnMaskClick={true}
        onClose={() => {
          setAddNoteVisible(false);
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
              text: "添加",
              style: { color: "pink" },
              onClick: () => {
                if (addNoteItem.label) {
                  addNote();
                }
              },
            },
          ],
        ]}
      />
    </div>
  );
}
