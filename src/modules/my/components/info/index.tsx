import { useState } from "react";
import s from "./index.module.scss";
import { Button, Divider, Space } from "antd-mobile";
import { DownlandOutline, UploadOutline } from "antd-mobile-icons";
import LocalStorage from "../../../../common/storage/localstorage";
export interface IProps {
  localStorage: LocalStorage;
}
export interface Info {
  account: string;
  email: string;
}
export default function Info(props: IProps) {
  const [info, setInfo] = useState<Info>();
  const { localStorage } = props;
  const download = () => {
    localStorage.downloadAllDataAsJSON();
  };
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
          <span>下载数据至本地</span>
        </Space>
      </Button>
      <Divider>同时，数据也会自动同步至云端</Divider>
      <Button block color="primary" size="large" className={s.syncBtn}>
        <Space>
          <UploadOutline />
          <span>同步数据至云端</span>
        </Space>
      </Button>
    </div>
  );
}
