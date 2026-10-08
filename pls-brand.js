(function () {
  const script = document.currentScript;
  if (!script) return;
  const siteRoot = new URL('.', script.src);
  const logoUrl = new URL('PLS Logo标准文件/PLS晶状体卓越诊疗体系-logo-标准横版-标准色透明背景.png', siteRoot);
  const homeUrl = new URL('index.html', siteRoot);

  function addBrandBar() {
    if (!document.body || document.querySelector('.pls-site-brandbar')) return;
    const style = document.createElement('style');
    style.textContent = `.pls-site-brandbar{display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:64px;padding:9px max(22px,calc((100vw - 1180px)/2));background:#fff;border-bottom:1px solid #dbe5ef;box-shadow:0 2px 10px rgba(18,49,91,.06);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif;position:relative;z-index:50}.pls-site-brandbar img{display:block;width:190px;max-width:46vw;height:44px;object-fit:contain;object-position:left center}.pls-site-brandbar a{display:inline-flex;align-items:center;gap:7px;color:#123b70;text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap}.pls-site-brandbar a:hover{text-decoration:underline}@media(max-width:560px){.pls-site-brandbar{min-height:56px;padding:7px 14px}.pls-site-brandbar img{width:150px;height:38px}.pls-site-brandbar a span{display:none}}@media print{.pls-site-brandbar{display:none!important}}`;
    document.head.appendChild(style);
    const bar = document.createElement('div');
    bar.className = 'pls-site-brandbar';
    bar.setAttribute('aria-label', 'PLS品牌与网站导航');
    bar.innerHTML = `<img src="${logoUrl.href}" alt="PLS晶状体卓越诊疗体系"><a href="${homeUrl.href}" aria-label="返回眼科医院PLS能力建设数字工作站"><span>返回数字工作站</span><b aria-hidden="true">→</b></a>`;
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addBrandBar);
  else addBrandBar();
})();
