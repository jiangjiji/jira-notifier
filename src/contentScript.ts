// 修改网页标题
document.title = "这是被插件修改后的标题";

// 向后台脚本发送消息
chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  console.log("从后台脚本获取的数据:", response.data);
});
