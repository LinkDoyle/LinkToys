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
  /**
   * @param {String} HTML representing a single element
   * @return {Element}
   */
  function htmlToElement(html) {
    var template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }

  /**
   * @param {String} HTML representing any number of sibling elements
   * @return {NodeList}
   */
  function htmlToElements(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
  }

  function fireReactElementChange(element, lastValue) {
    let event = new Event("change", { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    // https://github.com/facebook/react/issues/11488#issuecomment-347775628
    let tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
  }

  function updateProperty() {
    let propertyInputElements = document.querySelectorAll(
      "#struct-icbuCatProp div.sell-catProp-struct > div.content input"
    );
    let textarea = document.querySelector("#alihelper-property-textarea");

    let values = textarea.value.trim().split(/\n+/);
    let length = Math.min(propertyInputElements.length, values.length);
    for (let i = 0; i < length; i++) {
      let lastValue = propertyInputElements[i].value;
      propertyInputElements[i].value = values[i];
      propertyInputElements[i].setAttribute("value", values[i]);
      fireReactElementChange(propertyInputElements[i], lastValue);
    }
  }

  const DEFAULT_PROPERTIES = `Kitchen Toys Set
Plastic
ABS
China
Jingyao
AABBCC`;

  function createPropertyTool() {
    let propertyArea = document.getElementById("struct-icbuCatProp");
    let div = htmlToElement(`
  <div class="next-row oly-row-container">
    <div class="next-col next-col-4 oly-col-container">
      <label style="color: green;" class="oly-label-container left"
        >AH-批量商品属性</label
      >
    </div>
    <div class="next-col next-col-20 oly-col-container">
      <textarea id="alihelper-property-textarea" rows="5"/>
    </div>
  </div>
`);
    propertyArea.after(div);
    let textarea = document.querySelector("#alihelper-property-textarea");
    textarea.addEventListener("keyup", () => updateProperty());
    textarea.value = DEFAULT_PROPERTIES;
    updateProperty();
  }

  const DEFAULT_CUSTOM_PROPERTIES = `QTY/CTN
Function
Color
Packing
MOQ
Name
Logo
Age
OEM   ODM`;

  function updateCustomProperty() {
    let addButton = document.querySelector(".posting-field-more-attrs button");
    let textarea = document.querySelector(
      "#alihelper-custom-property-textarea"
    );

    let details = textarea.value.trim().split(/\n+/);
    let detailNames = [];
    let detailValues = [];
    for (let detail of details) {
      let match = /(\s*\S+)\s*(.*)/.exec(detail);
      if (match) {
        let [, name, value] = match;
        detailNames.push(name);
        detailValues.push(value);
      }
    }

    let currentDetailList = document.querySelectorAll(
      ".posting-field-more-attrs li"
    );
    if (details.length > currentDetailList.length) {
      let sizeToAdd = details.length - currentDetailList.length;
      for (let i = 0; i < sizeToAdd; ++i) {
        addButton.click();
      }
    } else if (
      details.length > 1 &&
      details.length < currentDetailList.length
    ) {
      let sizeToRemove = currentDetailList.length - details.length;
      for (let i = 0; i < sizeToRemove; ++i) {
        let removeButton = document.querySelector(
          ".posting-field-more-attrs li.item:last-child > button:nth-child(5)"
        );
        removeButton.click();
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
      let lastValue = currentDetailValueList[i].value;
      currentDetailValueList[i].value = detailValues[i];
      currentDetailValueList[i].setAttribute("value", detailValues[i]);
      fireReactElementChange(currentDetailValueList[i], lastValue);
    }
  }

  function createCustomPropertyTool() {
    let customMoreProperty = document.getElementById(
      "struct-customMoreProperty"
    );
    let div = htmlToElement(`
<div class="next-row oly-row-container">
  <div class="next-col next-col-4 oly-col-container">
    <label style="color: green;" class="oly-label-container left"
      >AH-批量自定义属性</label
    >
  </div>
  <div class="next-col next-col-20 oly-col-container">
    <textarea id="alihelper-custom-property-textarea" rows="8"/>
  </div>
</div>
`);
    customMoreProperty.after(div);
    let textarea = document.querySelector(
      "#alihelper-custom-property-textarea"
    );
    textarea.addEventListener("keyup", () => updateCustomProperty());
    textarea.value = DEFAULT_CUSTOM_PROPERTIES;
    updateCustomProperty();
  }

  window.onload = function () {
    console.debug(`Alibaba Helper is running... ${new Date()}`);
    createPropertyTool();
    createCustomPropertyTool();
  };
})();
