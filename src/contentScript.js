'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(`Page title is: '${pageTitle}' - evaluated by 'contentScript.js' `);


const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    for (const node of mutation.addedNodes) {
      var isElement = node.nodeType === 1 && node instanceof HTMLElement
      var isDiv = node.nodeName === 'DIV'
      var hasClass = node.className && node.className.length > 0
      if(isElement && isDiv && hasClass){
        var isTarget = node.className.includes('job-list-container') || node.className.includes('job-detail-container') || node.className.includes('card-area')
        // 找到了目标容器,进一步处理
        if(isTarget) dataHandler(node)
      }
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });

function dataHandler(node){
  if(node.className.includes('job-list-container'))leftCardHandler(node)
  if(node.className.includes('job-detail-container'))rightCardHandler(node)
  if(node.className.includes('card-area'))loadCardHandler(node)
}

// 左侧卡片处理
function leftCardHandler(node){
  var nodeList = node.querySelector('.rec-job-list')
  nodeList.childNodes.forEach(el => {
    if(el.nodeType !== 1) return
    var targetNode = el.querySelector('.job-card-wrap').querySelector('.job-card-box')
    targetNode.style.backgroundColor = 'red';
  });
}

// 右侧详情处理
function rightCardHandler(node){
  // 处理右侧详情
  // 1. 获取数据
  // 2. 发送数据到后台
  // 3. 接收后台返回的数据
}

// 后加载卡片处理
function loadCardHandler(node){
    var targetNode = node.querySelector('.job-card-wrap').querySelector('.job-card-box')
    targetNode.style.backgroundColor = 'red';
}



// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  response => {
    console.log(response.message);
  }
);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') console.log(`Current count is ${request.payload.count}`);

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
