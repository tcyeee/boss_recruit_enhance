(function () {
  console.log("[injected] 脚本已注入");

  // 拦截 XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    console.log(`[XHR] 请求发起：${url}`);
    return originalOpen.call(this, method, url, ...rest);
  };

  // 拦截 fetch
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const url = args[0];
    console.log(`[fetch] 请求发起：${typeof url === "string" ? url : url?.url}`);
    return originalFetch.apply(this, args);
  };
})();