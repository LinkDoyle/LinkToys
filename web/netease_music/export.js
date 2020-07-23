(() => {
  // 获取播放列表里的歌名
  let gIframe = document.getElementById("g_iframe");
  let titleList = gIframe.contentWindow.document.querySelectorAll("span.txt");
  let titleListStr = Array.from(titleList)
    .map((v) => v.textContent)
    .join("\n");
  console.debug(titleListStr);
})();
