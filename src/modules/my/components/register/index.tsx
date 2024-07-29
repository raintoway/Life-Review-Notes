import { Button, Dialog, Form, Input } from "antd-mobile";
import s from "./index.module.scss";
interface MobileValue {
  preValue: string | number;
  realValue: string;
}
export default function Register() {
  const onFinish = (values: any) => {
    Dialog.alert({
      content: <pre>{JSON.stringify(values, null, 2)}</pre>,
    });
  };
  return (
    <div className={s.container}>
      <Form
        className={s.form}
        layout="horizontal"
        onFinish={onFinish}
        footer={
          <Button className={s.registerBtn} block type="submit" size="large">
            注册
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
      </Form>
    </div>
  );
}
