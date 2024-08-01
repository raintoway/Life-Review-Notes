import { useEffect, useState } from "react";
import s from "./index.module.scss";
import { Button, Dialog, Divider, Space, Toast } from "antd-mobile";
import { DownlandOutline, UploadOutline } from "antd-mobile-icons";
import LocalStorage from "../../../../common/storage/localstorage";
import { getCookie } from "../..";
import { host } from "../../../../common/fetch";
import dayjs from "dayjs";
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
  const { localStorage, logOut } = props;
  const syncData = async () => {
    const res = await localStorage.downloadAllDataAsJSON();
    const body = JSON.stringify({ data: res });
    if (res) {
      fetch(host + "api/syncData", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + getCookie("token"), // 设置认证令牌
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
                  Authorization: "Bearer " + getCookie("token"), // 设置认证令牌
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
                  localStorage.overwriteDataInIDB(res.data.data);
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
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      const data = decodeJwtToken(token);
      setInfo(data);
    }
  }, []);
  return (
    <div className={s.container}>
      <p>帐号：{info?.account}</p>
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
          <span>同步数据至本地</span>
        </Space>
      </Button>
      <Divider style={{ textAlign: "center" }}>
        同时，数据也会自动同步至云端
        <br />
        {dayjs(updateDate).format("YYYY-MM-DD HH:mm:ss")}
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
          <span>同步数据至云端</span>
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
      </Button>
    </div>
  );
}
