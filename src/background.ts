// 监听标签页创建事件
chrome.tabs.onCreated.addListener((tab) => {
  console.log("新标签页创建:", tab);
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("来源:", sender);

  if (message.action === "getData") {
    // 处理消息并返回响应
    sendResponse({ data: "这是从后台脚本获取的数据" });
    return true; // 保持消息通道打开以便异步响应
  }
});
