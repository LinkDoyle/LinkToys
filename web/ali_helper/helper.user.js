// ==UserScript==
// @name         Alibaba Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.alibaba.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

(function () {
  function createMoreDetailTool() {
    let field = document.querySelector(".posting-field-more-attrs");
    let addButton = document.querySelector(".posting-field-more-attrs button");

    let moreDetailTextAreaDiv = document.createElement("div");
    let moreDetailTextAreaHtmlString = `
      <textarea id="alihelper-moredetail-textarea"/>
    `;
    moreDetailTextAreaDiv.innerHTML += moreDetailTextAreaHtmlString;

    let butttonDiv = document.createElement("div");
    let buttonHtmlString = `
      <button
      id="alihelper-moredetail-button"
      type="button"
      >
      批量添加属性名称
      </button>
    `;
    butttonDiv.innerHTML += buttonHtmlString;

    field.append(moreDetailTextAreaDiv, butttonDiv);
    let textarea = document.querySelector("#alihelper-moredetail-textarea");
    let button = document.querySelector("#alihelper-moredetail-button");
    button.onclick = () => {
      let details = textarea.value.split(/\n+/);
      let detailNames = [];
      let detailValues = [];
      for (let detail of details) {
        let [, name, value] = /(\s*\S+)\s*(.*)/.exec(detail);
        detailNames.push(name);
        detailValues.push(value);
      }

      let currentDetailList = document.querySelectorAll(
        ".posting-field-more-attrs li"
      );
      if (details.length > currentDetailList.length) {
        let sizeToAdd = details.length - currentDetailList.length;
        for (let i = 0; i < sizeToAdd; ++i) {
          addButton.click();
        }
      }

      let currentDetailNameList = document.querySelectorAll(
        ".posting-field-more-attrs li > span:nth-child(1) > input"
      );
      for (let i = 0; i < currentDetailNameList.length; ++i) {
        currentDetailNameList[i].value = detailNames[i];
        currentDetailNameList[i].setAttribute("value", detailNames[i]);
        let event = new Event("change", { bubbles: true });
        event.simulated = true;
        currentDetailNameList[i].dispatchEvent(event);
      }

      let currentDetailValueList = document.querySelectorAll(
        ".posting-field-more-attrs li > span:nth-child(2) > input"
      );
      for (let i = 0; i < currentDetailValueList.length; ++i) {
        currentDetailValueList[i].value = detailValues[i];
        currentDetailValueList[i].setAttribute("value", detailValues[i]);
        let event = new Event("change", { bubbles: true });
        event.simulated = true;
        currentDetailValueList[i].dispatchEvent(event);
      }
    };
  }

  window.onload = function () {
    console.debug(`Ali Helper is running... ${new Date()}`);
    createMoreDetailTool();
  };
})();
