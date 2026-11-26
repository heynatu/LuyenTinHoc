// Đặt theme trước khi trang hiển thị để không nháy màu. Nạp bằng <script src> (không nội tuyến, hợp CSP).
(function () {
  var pref = 'system';
  try {
    pref = window.localStorage.getItem('tdt:v1:theme') || 'system';
  } catch {
    pref = 'system';
  }
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function apply() {
    var dark = pref === 'dark' || (pref === 'system' && media && media.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme-pref', pref);
  }
  apply();
  if (media && media.addEventListener) {
    media.addEventListener('change', function () {
      if (document.documentElement.getAttribute('data-theme-pref') === 'system') {
        pref = 'system';
        apply();
      }
    });
  }
})();
