// @ts-nocheck
import { useEffect, useState } from "react";
import s from "./index.module.scss";
import { Button, Dialog, Divider, Space, Toast } from "antd-mobile";
import { DownlandOutline, UndoOutline, UploadOutline } from "antd-mobile-icons";
import LocalStorage from "../../../../common/storage/localstorage";
import { host } from "../../../../common/fetch";
import dayjs from "dayjs";
import backupData from "../../../../backup/2025-05-07.json";
import { proxyGetLocalStorage } from "../../../../common/utils";
export interface IProps {
  localStorage: LocalStorage;
  logOut: () => void;
}
export interface Info {
  account: string;
  email: string;
  updateDate: number;
}
function decodeJwtToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  const decodedPayload = atob(parts[1]); // 解码Payload部分
  const payload = JSON.parse(decodedPayload);

  return payload;
}

export default function Info(props: IProps) {
  const [info, setInfo] = useState<Info>();
  const [updateDate, setUpdateDate] = useState<number>();
  const [snapShotUpdateDate, setSnapShotUpdateDate] = useState<number>();
  const { localStorage, logOut } = props;
  const [isInit, setIsInit] = useState(false);
  const syncData = async () => {
    const res = await localStorage.downloadAllDataAsJSON();
    const body = JSON.stringify({ data: res });
    if (res) {
      fetch(host + "api/syncData", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + proxyGetLocalStorage("token"), // 设置认证令牌
          "Content-Type": "application/json",
        }),
        body: body,
      })
        .then((response) => {
          if (response.status === 200) {
            Toast.show({
              icon: "success",
              content: "数据同步成功",
            });
          } else {
            Toast.show({
              icon: "fail",
              content: "数据同步失败：" + response.statusText,
            });
          }
        })
        .catch(() => {})
        .finally(() => {});
    }
  };

  const download = async () => {
    Dialog.show({
      closeOnAction: true,
      closeOnMaskClick: true,
      content: (
        <p
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            color: "#6f6d6d",
            fontWeight: "bold",
          }}
        >
          同步数据至本地会覆盖已有的数据，确定同步吗
        </p>
      ),
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
              fetch(host + "api/getData", {
                headers: new Headers({
                  Authorization: "Bearer " + proxyGetLocalStorage("token"), // 设置认证令牌
                }),
              })
                .then((response) => {
                  if (response.status === 200) {
                    return response.json();
                  } else {
                    Toast.show({
                      icon: "fail",
                      content: "数据获取失败：",
                    });
                  }
                })
                .then((res) => {
                  localStorage.overwriteDataFromIDB(res.data.data);
                  setUpdateDate(res.data.updateDate);
                  Toast.show({
                    icon: "success",
                    content: "数据同步成功",
                  });
                })
                .catch(() => {})
                .finally(() => {});
            },
          },
        ],
      ],
    });
  };
  const loadSnapshot = async () => {
    try {
      Dialog.show({
        closeOnAction: true,
        closeOnMaskClick: true,
        content: (
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#6f6d6d",
              fontWeight: "bold",
            }}
          >
            回退至备份会覆盖已有的数据，确定同步吗
          </p>
        ),
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
              onClick: async () => {
                try {
                  const snapshot = await localStorage.getData(
                    "snapshot",
                    "snapshot"
                  );
                  localStorage.overwriteDataFromIDB(snapshot as string);
                  Toast.show({
                    icon: "success",
                    content: "回退成功",
                  });
                } catch (err) {
                  Toast.show({
                    icon: "error",
                    content: "回退失败",
                  });
                }
              },
            },
          ],
        ],
      });
    } catch (err) {
      Toast.show({
        icon: "success",
        content: "回退失败",
      });
    }
  };
  const getSnapShotUpdateDate = async () => {
    const _updateDate = await localStorage.getData("snapshot", "updateDate");
    if (typeof _updateDate === "number") {
      setSnapShotUpdateDate(_updateDate);
    }
  };
  useEffect(() => {
    const isInit = window.localStorage.getItem("isInit");
    if (isInit === "1") {
      setIsInit(true);
    }
  }, []);
  const loadBackupData = async () => {
    await localStorage.overwriteDataFromIDB(JSON.stringify(backupData));
    Toast.show({
      icon: "success",
      content: "初始化成功",
    });
    setIsInit(true);
    window.localStorage.setItem("isInit", "1");
  };
  const backup = async () => {
    const data = await localStorage.downloadAllDataAsJSON();
    localStorage.downloadJSONData(data as string);
    Toast.show({
      icon: "success",
      content: "下载成功",
    });
  };
  useEffect(() => {
    const token = proxyGetLocalStorage("token");
    if (token) {
      const data = decodeJwtToken(token);
      setInfo(data);
      getSnapShotUpdateDate();
    }
  }, []);

  return (
    <div className={s.container}>
      <div style={{ marginTop: "60px" }}></div>
      {isInit ? null : (
        <Button
          block
          color="primary"
          size="large"
          className={s.syncBtn}
          onClick={() => loadBackupData()}
        >
          <Space>
            <DownlandOutline />
            <span>初始化</span>
          </Space>
        </Button>
      )}
      <div style={{ marginTop: "60px" }}></div>
      <Button
        block
        color="primary"
        size="large"
        className={s.syncBtn}
        onClick={() => backup()}
      >
        <Space>
          <UploadOutline />
          <span>下载备份</span>
        </Space>
      </Button>
      {/* <p>帐号：{info?.account}</p>
      <p>邮箱：{info?.email}</p>

      <Divider style={{ marginTop: "60px" }}>
        数据是自动保存在浏览器里的
      </Divider>
      <Button
        block
        color="primary"
        size="large"
        className={s.downloadBtn}
        onClick={download}
      >
        <Space>
          <DownlandOutline />
          <span>同步云端数据至本地</span>
        </Space>
      </Button>
      <Divider style={{ textAlign: "center" }}>
        同时，数据也会自动同步至云端
        {updateDate ? (
          <>
            <br />
            {dayjs(updateDate).format("YYYY-MM-DD HH:mm:ss")}{" "}
          </>
        ) : null}
      </Divider>
      <Button
        block
        color="primary"
        size="large"
        className={s.syncBtn}
        onClick={syncData}
      >
        <Space>
          <UploadOutline />
          <span>同步本地数据至云端</span>
        </Space>
      </Button>
      <Divider style={{ textAlign: "center" }}>
        并且，本地保留最近一次的备份
        {snapShotUpdateDate ? (
          <>
            <br />
            {dayjs(snapShotUpdateDate).format("YYYY-MM-DD HH:mm:ss")}
          </>
        ) : null}
      </Divider>
      <Button
        block
        color="primary"
        size="large"
        className={s.syncBtn}
        onClick={() => loadSnapshot()}
      >
        <Space>
          <UndoOutline />
          <span>回退至最近一次备份</span>
        </Space>
      </Button>
      <Button
        block
        fill="none"
        size="large"
        className={s.registerBtn}
        onClick={() => {
          logOut();
        }}
      >
        退出登录
      </Button> */}
    </div>
  );
}
