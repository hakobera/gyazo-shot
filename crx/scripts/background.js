var bg = null;

(function () {
  function _getConfig(key, defaultValue) {
    var value = localStorage[key];
    return value ? value : defaultValue;
  }

  function _setConfig(key, value) {
    localStorage[key] = value;
    return value;
  }

  function convertDataURIToBlob(dataURI, mimeType) {
    if (!dataURI) {
      return new Uint8Array(0);
    }

    var BASE64_MARKER = ';base64,',
        base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length,
        base64 = dataURI.substring(base64Index),
        raw = window.atob(base64),
        uInt8Array = new Uint8Array(raw.length);

    for (var i = 0, length = uInt8Array.length; i < length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: mimeType });
  }

  function copyToClipboard(str) {
    document.oncopy = function(event) {
      event.clipboardData.setData('text/plain', str);
      event.preventDefault();
    };
    document.execCommand("Copy", false, null);
  }

  function send(url, gyazoId, blob, basicId, basicPw) {
    var xhr = new XMLHttpRequest(),
        data = new FormData();

    data.append("id", gyazoId);
    data.append("imagedata", blob);

    xhr.open('POST', url, true, basicId, basicPw);
    xhr.onload = function () {
      var body = this.response;
      if (this.status == 200) {
        console.log(body);
        copyToClipboard(body);
        window.open(body);
      } else {
        alert('Error ' + body);
      }
    };

    xhr.onerror = function (e) {
      alert("Error Status" + e.target.status);
    };

    xhr.send(data);
  }

  var Background = function () {
    this.assignEventHandlers();
  };

  Background.prototype.assignEventHandlers = function () {
    var self = this;

    chrome.browserAction.onClicked.addListener(function (tab) {
      var opts = { format: 'png', quality: 75 };
      chrome.tabs.captureVisibleTab(null, opts, function (dataUrl) {
        var blob = convertDataURIToBlob(dataUrl, 'image/png');
        send(self.getServerUrl(), self.getUserId(), blob, self.getBasicId(), self.getBasicPw());
      });
    });
  };

  Background.prototype.getServerUrl = function () {
    return _getConfig('serverUrl', 'http://gyazo.com/upload.cgi');
  };

  Background.prototype.setServerUrl = function (value) {
    return _setConfig('serverUrl', value);
  };

  Background.prototype.getUserId = function () {
    return _getConfig('userId', '');
  };

  Background.prototype.setUserId = function (value) {
    return _setConfig('userId', value);
  };

  Background.prototype.getBasicId = function () {
    return _getConfig('basicId', '');
  };

  Background.prototype.setBasicId = function (value) {
    return _setConfig('basicId', value);
  };

  Background.prototype.getBasicPw = function () {
    return _getConfig('basicPw', '');
  };

  Background.prototype.setBasicPw = function (value) {
    return _setConfig('basicPw', value);
  };

  bg = new Background();
})();
