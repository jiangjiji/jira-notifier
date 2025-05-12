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
        <Form
          form={form}
          className={cssStyle.form}
          initialValues={settingData}
        >
          <Form.Item
            name="serverURL"
            label={i18n.t("server")}
            rules={[{ required: true, message: i18n.t("serverRequired") }]}
          >
            <Input
              onChange={console.log}
              placeholder={i18n.t("serverPlaceholder")}
            />
          </Form.Item>
          <Form.Item
            name="isOpen"
            label={i18n.t("openCheck")}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="interval" label={i18n.t("interval")}>
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
          <Form.Item name="notifyType" label={i18n.t("notifyType")}>
            <Radio.Group>
              <Radio.Button value={NotificationType.None}>
                {i18n.t("notifyTypeNone")}
              </Radio.Button>
              <Radio.Button value={NotificationType.InterBrowser}>
                {i18n.t("notifyTypeBrowser")}
              </Radio.Button>
              <Radio.Button value={NotificationType.System}>
                {i18n.t("notifyTypeSystem")}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="isAutoFocused"
            label={i18n.t("gotoJira")}
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
        {i18n.t("reset")}
      </Button>
    </div>
  );
}

export default SettingLayout;
