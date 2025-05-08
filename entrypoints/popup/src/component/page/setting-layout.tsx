import {
  ISettingData,
  NotificationType,
  useSettingStore,
} from "@/src/store/settingStore";

import { useJiraStore } from "@/src/store/jiraStore";
import { DeleteFilled } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Radio,
  Slider,
  Switch,
} from "antd";
import cssStyle from "./setting-layout.module.scss";

function SettingLayout() {
  const settingData = useSettingStore((state) => state);
  const clearIgnore = useJiraStore((state) => state.clearIgnore);

  const [form] = Form.useForm<ISettingData>();
  const isOpen = Form.useWatch("isOpen", form);
  const serverURL = Form.useWatch("serverURL", form);
  const interval = Form.useWatch("interval", form);
  const isAutoFocused = Form.useWatch("isAutoFocused", form);
  const notifyType = Form.useWatch("notifyType", form);

  useEffect(() => {
    useSettingStore.setState({
      isOpen,
      serverURL,
      interval,
      isAutoFocused,
      notifyType,
    });
  }, [isOpen, serverURL, interval, isAutoFocused, notifyType]);

  return (
    <div className={cssStyle.page}>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              screenXSMax: 0,
            },
          },
        }}
      >
        <Form form={form} className={cssStyle.form} initialValues={settingData}>
          <Form.Item
            name="serverURL"
            label="服务器"
            rules={[{ required: true, message: "服务器不能为空" }]}
          >
            <Input onChange={console.log} placeholder="请输Jira 服务器地址" />
          </Form.Item>
          <Form.Item name="isOpen" label="定时检测" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="interval" label="检测间隔">
            <div style={{ display: "flex" }}>
              <Form.Item name="interval" noStyle>
                <Slider
                  style={{ flex: 1 }}
                  step={1}
                  min={10}
                  max={600}
                  tooltip={{ open: false }}
                />
              </Form.Item>
              <Form.Item name="interval" noStyle>
                <InputNumber
                  min={10}
                  max={600}
                  suffix="s"
                  controls={false}
                  style={{ width: 60, marginLeft: 8 }}
                />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item name="notifyType" label="通知方式">
            <Radio.Group>
              <Radio.Button value={NotificationType.None}>不通知</Radio.Button>
              <Radio.Button value={NotificationType.InterBrowser}>
                浏览器
              </Radio.Button>
              <Radio.Button value={NotificationType.System}>系统</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="isAutoFocused"
            label="直接跳转"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </ConfigProvider>

      <Button
        type="primary"
        icon={<DeleteFilled />}
        onClick={() => clearIgnore()}
      >
        重置数据
      </Button>
    </div>
  );
}

export default SettingLayout;
