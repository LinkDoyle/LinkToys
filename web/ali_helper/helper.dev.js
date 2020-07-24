// ==UserScript==
// @name         Alibaba Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.alibaba.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// ==/UserScript==

(function () {
  GM.xmlHttpRequest({
    method: "GET",
    url: `http://127.0.0.1:8000/dist/xlsx.full.min.js?ts=${+new Date()}`,
    onload: function (response) {
      let remoteScript = document.createElement("script");
      remoteScript.id = "tm-dev-script-xlsx";
      remoteScript.innerHTML = response.responseText;
      document.body.appendChild(remoteScript);
      console.log("xlsx.full.min.js loaded.");
    },
  });

  GM.xmlHttpRequest({
    method: "GET",
    url: `http://127.0.0.1:8000/helper.js?ts=${+new Date()}`,
    onload: function (response) {
      let remoteScript = document.createElement("script");
      remoteScript.id = "tm-dev-script";
      remoteScript.innerHTML = response.responseText;
      document.body.appendChild(remoteScript);
      console.log("helper.js loaded.");
    },
  });

  GM.xmlHttpRequest({
    method: "GET",
    url: `http://127.0.0.1:8000/helper.css?ts=${+new Date()}`,
    onload: function (response) {
      GM.addStyle(response.responseText);
      console.log("helper.css loaded.");
    },
  });
})();
