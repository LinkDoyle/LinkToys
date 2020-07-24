(function () {
  "use strict";

  function createHelperButtonZH() {
    let helperDiv = document.createElement("div");
    helperDiv.className = "list";
    helperDiv.innerHTML = `<a class="normal" data-spm-click="gostr=/sc.supplier.newsign;locaid=3;btn=online_consultation">
                              <div class="wrap">
                                <div class="content content1">
                                    <img src="https://img.alicdn.com/tfs/TB1r2h1yXzqK1RjSZFCXXbbxVXa-26-26.png" alt="ALI助手">
                                    <span>ALI助手</span>
                                </div>
                                <div class="content content2">
                                    <div>
                                        <span>ALI助手</span>
                                        <img src="https://img.alicdn.com/tfs/TB1r2h1yXzqK1RjSZFCXXbbxVXa-26-26.png" alt="icon">
                                    </div>
                                </div>
                                </div>
                            </a>
                            `;
    return helperDiv;
  }

  function createHelperButtonEN() {
    let helperDiv = document.createElement("div");
    helperDiv.className = "list";
    helperDiv.innerHTML = `<a class="normal" data-spm-click="gostr=/sc.supplier.newsign;locaid=3;btn=online_consultation">
                              <div class="wrap">
                                <div class="content content1">
                                    <img src="https://img.alicdn.com/tfs/TB1r2h1yXzqK1RjSZFCXXbbxVXa-26-26.png" alt="ALI助手">
                                    <span>ALI助手</span>
                                </div>
                                <div class="content content2">
                                    <div>
                                        <span>ALI助手</span>
                                        <img src="https://img.alicdn.com/tfs/TB1r2h1yXzqK1RjSZFCXXbbxVXa-26-26.png" alt="icon">
                                    </div>
                                </div>
                                </div>
                            </a>
                            `;
    return helperDiv;
  }

  function showModalDialog() {
    let div = document.createElement("div");
    div.className = "alihelper-modal-wrapper";
    div.innerHTML = `
<div className="alihelper-modal">
  <div className="alihelper-modal-title">这是modal标题</div>
  <div className="alihelper-modal-content">这是modal内容</div>
  <div className="alihelper-modal-operator">
    <button className="alihelper-modal-action-close">取消</button>
    <button className="alihelper-modal-action-confirm">确认</button>
  </div>
</div>
<div className="alihelper-mask"></div>`;
    return div;
  }

  function closeModalDialog() {}

  function createProductHelperButton() {
    let div = document.createElement("div");
    div.className = "com-struct";
    div.innerHTML = `
<button
  id="alihelp-import-button"
  type="button"
  class="next-btn next-btn-secondary next-btn-medium ol-next-button block"
>
  智能填充
  <input
    id="alihelp-file-input"
    type="file"
    accept=".csv, .xls, .xlsx"
    multiple=""
    style="display: none;"
  />
</button>`;
    return div;
  }

  function readWorkbook(workbook) {
    console.debug(workbook);
    console.debug("SheetNames:", workbook.SheetNames);
    let sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      console.debug("空的sheet");
      return;
    }
    let sheet = workbook.Sheets[sheetName];
    console.debug(sheet);

    let ref = sheet["!ref"] ?? "A1:A1";
    let range = XLSX.utils.decode_range(ref);
    console.debug("range:", columns);

    let columns = [];
    for (let c = 0; c <= range.e.c; ++c) {
      let cell_address = { c: C, r: R };
      let cell_ref = XLSX.utils.encode_cell(cell_address);
      let cell = sheet[cell_ref];
      columns.push(cell.v);
    }
    console.debug("columns:", columns);
    // let ref = sheet["!ref"] ?? "A1:A1";
    // let range = XLSX.utils.decode_range(ref);
    // for (let R = range.s.r; R <= range.e.r; ++R) {
    //   for (let C = range.s.c; C <= range.e.c; ++C) {
    //     let cell_address = { c: C, r: R };
    //     let cell_ref = XLSX.utils.encode_cell(cell_address);
    //     let cell = sheet[cell_ref];
    //     console.debug(cell.v);
    //   }
    //   console.debug();
    // }

    return sheet;
  }

  function fillTable(sheet) {
    console.debug("fillTable");

    let productTitle = document.getElementById("productTitle");

    let productKeywordAddButton = document.querySelector(
      ".posting-field-keywords > button"
    );
    let productKeywordList = document.querySelectorAll(
      ".posting-field-keywords > ul > li"
    );

    productTitle.value = "Product name";

    let keywordLength = 2;
    if (keywordLength > 3) {
      alert("关键词数量不能超过3！！！");
    } else {
      while (productKeywordList.length < keywordLength) {
        productKeywordAddButton.click();
        productKeywordList = document.querySelectorAll(
          ".posting-field-keywords > ul > li"
        );
      }
    }

    for (let productKeyword of productKeywordList) {
      console.debug(productKeyword);
      let productKeywordInput = productKeyword.querySelector(
        "div > span > input"
      );
      productKeywordInput.value = "toy";
    }
  }

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
        currentDetailNameList[i].value = details[i];
      }
    };
  }

  window.onload = () => {
    let currentUrl = window.location.href;
    if (currentUrl.startsWith("https://post.alibaba.com/product/publish.htm")) {
      let nav = document.getElementById("struct-nav");
      let lastChild = nav.lastChild;
      let helperDiv = createProductHelperButton();
      nav.insertBefore(helperDiv, lastChild);

      let button = document.getElementById("alihelp-import-button");
      let fileInput = document.getElementById("alihelp-file-input");

      button.onclick = () => {
        fileInput.click();
      };
      fileInput.addEventListener(
        "change",
        function (e) {
          console.debug(e);
          let files = e.target.files,
            f = files[0];
          let reader = new FileReader();
          reader.onload = function (e) {
            let data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = readWorkbook(workbook);
            fillTable(sheet);
          };
          reader.readAsArrayBuffer(f);
        },
        false
      );
    } else {
      let floatMenu = document.querySelector(".floatMenu");
      let firstList = floatMenu.firstChild;
      let helperDiv = createHelperButtonEN();
      floatMenu.insertBefore(helperDiv, firstList);
    }

    createMoreDetailTool();
  };

  console.debug(`Ali Helper is running... ${new Date()}`);
})();
