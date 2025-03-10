import { Form, Input, Stepper, Switch } from "antd-mobile";
import { SettingData, userSetting } from "../model/setting-data";
import cssStyle from "./setting-layout.module.scss";

function SettingLayout() {
  const [form] = Form.useForm<SettingData>();
  const isOpen = Form.useWatch("isOpen", form);

  return (
    <div className={cssStyle.page}>
      <Form
        form={form}
        className={cssStyle.form}
        layout="vertical"
        initialValues={userSetting}
        mode="card"
      >
        <Form.Item
          name="isOpen"
          label="是否开启"
          valuePropName="checked"
          childElementPosition="right"
          layout="horizontal"
        >
          <Switch></Switch>
        </Form.Item>
        <Form.Header />
        <Form.Item
          name="serverURL"
          label="服务器"
          rules={[{ required: true, message: "服务器不能为空" }]}
          hidden={!isOpen}
        >
          <Input onChange={console.log} placeholder="请输Jira 服务器地址" />
        </Form.Item>
        <Form.Item
          name="interval"
          label="检测间隔"
          help="单位为分钟"
          hidden={!isOpen}
        >
          <Stepper step={1} min={1} max={10} />
        </Form.Item>
      </Form>
    </div>
  );
}

export default SettingLayout;
