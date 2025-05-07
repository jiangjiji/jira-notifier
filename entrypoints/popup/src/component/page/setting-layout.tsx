import { ISettingData, useSettingStore } from "@/src/store/settingStore";

import { Form, Input, Stepper, Switch } from "antd-mobile";
import cssStyle from "./setting-layout.module.scss";

function SettingLayout() {
  const [settingData, setSettingData] = useState<ISettingData>(
    useSettingStore.getState(),
  );
  const [form] = Form.useForm<ISettingData>();
  const isOpen = Form.useWatch("isOpen", form);
  const serverURL = Form.useWatch("serverURL", form);
  const interval = Form.useWatch("interval", form);

  useEffect(() => {
    useSettingStore.setState({
      isOpen,
      serverURL,
      interval,
    });
  }, [isOpen, serverURL, interval]);

  return (
    <div className={cssStyle.page}>
      <Form
        form={form}
        className={cssStyle.form}
        layout="vertical"
        initialValues={settingData}
        mode="card"
      >
        <Form.Item
          name="serverURL"
          label="服务器"
          rules={[{ required: true, message: "服务器不能为空" }]}
        >
          <Input onChange={console.log} placeholder="请输Jira 服务器地址" />
        </Form.Item>
        <Form.Header />
        <Form.Item
          name="isOpen"
          label="是否开启定时检测"
          valuePropName="checked"
        >
          <Switch></Switch>
        </Form.Item>
        <Form.Item name="interval" label="检测间隔" help="单位为分钟">
          <Stepper step={1} min={1} max={10} />
        </Form.Item>
      </Form>
    </div>
  );
}

export default SettingLayout;
