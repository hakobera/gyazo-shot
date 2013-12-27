(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function trim (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }

  function assignEventHandlers() {
    var form = $('optionsForm');
    console.log(form);
    form.onsubmit = function () {
      chrome.runtime.getBackgroundPage(function (page) {
        page.bg.setServerUrl(trim($('serverUrl').value));
        page.bg.setUserId(trim($('userId').value));
      });
      return false;
    };
  }

  function setLabel(key) {
    var label = document.getElementById(key);
    label.innerText = chrome.i18n.getMessage(key);
  }

  function setLabels() {
    [
      'server_url_label',
      'user_id_label',
      'save_button_label'
    ]
    .forEach(function (label) {
      setLabel(label);
    });
  }

  function loadValue(key, value) {
    var input = $(key);
    input.value = value;
  }

  function loadValues() {
    chrome.runtime.getBackgroundPage(function (page) {
      loadValue('serverUrl', page.bg.getServerUrl());
      loadValue('userId', page.bg.getUserId());
    });
  }

  function onLoad() {
    assignEventHandlers();
    setLabels();
    loadValues();
  }

  document.addEventListener('DOMContentLoaded', onLoad);
})();
