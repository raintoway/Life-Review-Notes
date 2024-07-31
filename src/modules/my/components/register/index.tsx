import { Button, Dialog, Form, Input, Toast } from "antd-mobile";
import s from "./index.module.scss";
import { useState } from "react";
import { host } from "../../../../common/fetch";
export default function Register(props: { logIn: () => void }) {
  const { logIn } = props;
  const [isRegister, setIsRegister] = useState(false);
  const onFinish = (values: any) => {
    const data = JSON.stringify(values);
    if (isRegister) {
      fetch(host + "api/user/register", {
        method: "POST", // 指定请求方法为 POST
        headers: {
          "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        },
        body: data, // 请求体，这里是 JSON 字符串
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json(); // 解析 JSON 响应体
          } else {
            Toast.show({
              icon: "fail",
              content: "注册失败：" + response.statusText,
            });
          }
        })
        .then((res) => {
          if (res.code === 0) {
            Toast.show({
              icon: "success",
              content: "注册成功",
            });
            setIsRegister(false);
          } else {
            Toast.show({
              icon: "fail",
              content: res.msg,
            });
          }
        });
    } else {
      fetch(host + "api/user/login", {
        method: "POST", // 指定请求方法为 POST
        headers: {
          "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        },
        body: data, // 请求体，这里是 JSON 字符串
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json(); // 解析 JSON 响应体
          } else {
            Toast.show({
              icon: "fail",
              content: "登录失败：" + response.statusText,
            });
          }
        })
        .then((res) => {
          if (res.code === 0) {
            const { token } = res.data;
            const expires = new Date();
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 设置过期时间为当前时间加一天
            expires.toUTCString(); // 转换为GMT格式的日期字符串
            document.cookie = `token=${token}; expires=${expires}`;
            logIn();
          } else {
            Toast.show({
              icon: "fail",
              content: res.msg,
            });
          }
        });
    }
  };
  return (
    <div className={s.container}>
      <Form
        className={s.form}
        layout="horizontal"
        onFinish={onFinish}
        footer={
          <Button className={s.loginBtn} block type="submit" size="large">
            {isRegister ? "注册" : "登录"}
          </Button>
        }
      >
        <Form.Item
          name="account"
          label="帐号"
          rules={[
            { required: true, message: "帐号不能为空" },
            { type: "string", min: 3, max: 13 },
            {
              pattern: /^[a-zA-Z0-9_-]+$/,
              message: "只能输入数字 字符 _ -",
            },
          ]}
        >
          <Input placeholder="请输入帐号" clearable type="account" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: "密码不能为空" },
            { type: "string", min: 8, max: 16 },
            {
              pattern: /^[a-zA-Z0-9_\-.]+$/,
              message: "只能输入数字 字符 _ - .",
            },
          ]}
        >
          <Input placeholder="请输入密码" type="password" clearable />
        </Form.Item>
        {isRegister ? (
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true },
              { type: "string", min: 6 },
              { type: "email" },
            ]}
          >
            <Input placeholder="请输入邮箱" clearable />
          </Form.Item>
        ) : null}
      </Form>
      {isRegister ? (
        <Button
          onClick={() => setIsRegister(false)}
          block
          fill="none"
          size="large"
          className={s.registerBtn}
        >
          登录
        </Button>
      ) : (
        <Button
          onClick={() => setIsRegister(true)}
          block
          fill="none"
          size="large"
          className={s.registerBtn}
        >
          注册
        </Button>
      )}
    </div>
  );
}
