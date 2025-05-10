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

// Inject script into the web page
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(script);


// window.addEventListener('message', (event) => {
//   if (event.data.type === 'FETCH_INTERCEPT') {
//     console.log('拦截到网页 fetch 数据:', event.data.data);
//   }
// });

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
