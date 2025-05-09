'use strict';

import './popup.css';

(function() {

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: '=== Hello, my name is Pop. I am from Popup.',
      },
    },
    response => {
      console.log(response.message);
    }
  );

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
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    bindEvents();
  });
})();
