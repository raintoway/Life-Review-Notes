import { useContext, useEffect, useState } from "react";
import Register from "./components/register";
import Info from "./components/info";
import { StorageContext } from "../../App";
import { host } from "../../common/fetch";
import {
  proxyDeleteLocalStorage,
  proxyGetLocalStorage,
} from "../../common/utils";
export default function My() {
  const [hadLogin, setHadLogin] = useState<boolean | undefined>(undefined);
  const [initFlag, setInitFlag] = useState(false);
  const { localStorage } = useContext(StorageContext);
  const checkLogin = async () => {
    fetch(host + "api/user/checkLogin", {
      headers: new Headers({
        Authorization: "Bearer " + proxyGetLocalStorage("token"), // 设置认证令牌
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          setHadLogin(false);
        } else {
          setHadLogin(true);
        }
      })
      .catch(() => {})
      .finally(() => {});
  };
  const initData = async () => {
    if (localStorage) {
      setInitFlag(true);
    }
  };
  useEffect(() => {
    checkLogin();
    initData();
  }, [localStorage]);
  return initFlag && localStorage ? (
    hadLogin === true ? (
      <Info
        localStorage={localStorage}
        logOut={() => {
          proxyDeleteLocalStorage("token");
          setHadLogin(false);
        }}
      ></Info>
    ) : hadLogin === false ? (
      <Register
        logIn={() => {
          setHadLogin(true);
        }}
      ></Register>
    ) : null
  ) : null;
}
