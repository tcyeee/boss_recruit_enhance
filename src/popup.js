'use strict';

import './popup.css';

(function() {

    const defaultSetting = {
    illegalCompanyShowType: 'none',
    shareIllegalCompanyData: false,
    heightLightIllegalInfoInContext: false
  };

  function loadSettings() {
    chrome.storage.local.get(defaultSetting, (data) => {
      document.querySelector(`input[name="illegalCompanyShowType"][value="${data.illegalCompanyShowType}"]`).checked = true;
      document.getElementById('shareIllegalCompanyData').checked = data.shareIllegalCompanyData;
      document.getElementById('heightLightIllegalInfoInContext').checked = data.heightLightIllegalInfoInContext;
    });
  }

  function bindEvents() {
    const radios = document.querySelectorAll('input[name="illegalCompanyShowType"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        chrome.storage.local.set({
          illegalCompanyShowType: radio.value
        });
      });
    });

    document.getElementById('shareIllegalCompanyData').addEventListener('change', (e) => {
      chrome.storage.local.set({
        shareIllegalCompanyData: e.target.checked
      });
    });

    document.getElementById('heightLightIllegalInfoInContext').addEventListener('change', (e) => {
      chrome.storage.local.set({
        heightLightIllegalInfoInContext: e.target.checked
      });
      send("SETTING",{heightLightIllegalInfoInContext: e.target.checked})
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    bindEvents();
  });





   // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const counterStorage = {
    get: cb => {
      chrome.storage.sync.get(['count'], result => {
        cb(result.count);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };



  function updateCounter({ type }) {
    counterStorage.get(count => {
      let newCount;
      if (type === 'INCREMENT') newCount = count + 1;
      if (type === 'DECREMENT') newCount = count - 1;

      counterStorage.set(newCount, () => {
        document.getElementById('counter').innerHTML = newCount;
        send('COUNT',{count: newCount})
      });
    });
  }

  // 发送消息
  function send(type, payload) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];
      chrome.tabs.sendMessage(tab.id,
        {
          type: type,
          payload: payload,
        },
        response => {
          console.log('Current count value passed to contentScript file');
        }
      );
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);

  function restoreCounter() {
    counterStorage.get(count => {
      if (typeof count === 'undefined') {
        counterStorage.set(0, () => setupCounter(0));
      } else {
        setupCounter(count);
      }
    });
  }

  function setupCounter(initialValue = 0) {
    document.getElementById('counter').innerHTML = initialValue;

    document.getElementById('incrementBtn').addEventListener('click', () => {
      updateCounter({type: 'INCREMENT'});
    });

    document.getElementById('decrementBtn').addEventListener('click', () => {
      updateCounter({type: 'DECREMENT'});
    });
  }

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    response => {
      console.log(response.message);
    }
  );

})();
