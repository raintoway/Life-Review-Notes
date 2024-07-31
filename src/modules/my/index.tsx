import { useContext, useEffect, useState } from "react";
import Register from "./components/register";
import Info from "./components/info";
import { StorageContext } from "../../App";
import { host } from "../../common/fetch";
export function deleteCookie(name: string) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
}
export function getCookie(name: string) {
  // 分割cookie字符串为cookie数组
  const cookies = document.cookie.split("; ");
  // 遍历数组寻找匹配的cookie
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const equals = cookie.indexOf("=");
    // 如果找到了cookie的名称和值的分隔符
    if (equals > -1) {
      const cookieName = cookie.substring(0, equals).trim();
      const cookieValue = cookie.substring(equals + 1);
      // 如果当前cookie的名称匹配传入的name参数
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
  }
  // 如果没有找到匹配的cookie，返回null
  return null;
}

export default function My() {
  const [hadLogin, setHadLogin] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const { localStorage } = useContext(StorageContext);
  const checkLogin = async () => {
    fetch(host + "api/user/checkLogin", {
      headers: new Headers({
        Authorization: "Bearer " + getCookie("token"), // 设置认证令牌
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          setHadLogin(false);
        } else {
          setHadLogin(true);
        }
      })
      .catch((error) => {})
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
    hadLogin ? (
      <Info
        localStorage={localStorage}
        logOut={() => {
          deleteCookie("token");
          setHadLogin(false);
        }}
      ></Info>
    ) : (
      <Register
        logIn={() => {
          setHadLogin(true);
        }}
      ></Register>
    )
  ) : null;
}
