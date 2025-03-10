export class SettingData {
  isOpen: boolean = false;
  serverURL: string = "http://192.168.1.230:8080";
  interval: number = 1;
}

export const userSetting = new SettingData();
