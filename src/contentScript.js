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


// [监听] 全局信息
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

// [监听] 职位详情
const observer2 = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type !== 'childList') return
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== 1 || node.nodeName !== 'DIV') return
      // 添加在请求头拉黑按钮
      if(node.className.includes('job-detail-op')) addBlockButton(node)
      // 在内容中高亮加班信息
      if(node.className.includes('job-detail-body')) hightLightInfo(node)
    });
  }
});

// 信息分发
function dataHandler(node){
  if(node.className.includes('job-list-container'))leftCardHandler(node)
  if(node.className.includes('job-detail-container'))detailHandler(node)
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

// 对招聘详情进行处理
function detailHandler(node){
  var targetNode = node.querySelector('.job-detail-box')
  observer2.observe(targetNode, { childList: true, subtree: true });
}

// 后加载卡片处理
function loadCardHandler(node){
    var targetNode = node.querySelector('.job-card-wrap').querySelector('.job-card-box')
    targetNode.style.backgroundColor = 'red';
}

// TODO 在按钮区域添加 "拉黑按钮"
function addBlockButton(node){
  const blockBtn = document.createElement('a');
  blockBtn.href = 'javascript:;';
  blockBtn.textContent = '拉黑';
  blockBtn.style.marginLeft = '15px';
  blockBtn.style.padding = '7px 20px';
  blockBtn.style.background = 'red';
  blockBtn.style.color = 'white';
  blockBtn.style.borderRadius = '8px';
  blockBtn.style.marginTop = 'auto';
  blockBtn.style.float = 'left';
  blockBtn.style.textDecoration = 'none'; // 去掉下划线（可选）
  blockBtn.style.cursor = 'pointer';      // 鼠标变成手型（可选）

  blockBtn.addEventListener('click', () => {
    // TODO 收集公司名称到后台
    alert('已拉黑该公司！');
  });
  node.appendChild(blockBtn);
}

// 在内容中高亮加班信息
function hightLightInfo(node){
  node.querySelector('.desc').childNodes.forEach(el => {
    if (el.nodeType !== 3) return
    
  })
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
