/* Netflix Household Bypass — Loader
   Injects the interceptor script into the page context
   before Netflix's own scripts can initialise fetch/XHR. */

(function () {
    'use strict';

    var api = (typeof browser !== 'undefined') ? browser : chrome;

    api.storage.local.get('bypassEnabled', function (cfg) {
        if (cfg.bypassEnabled === false) return;

        var el = document.createElement('script');
        el.src = api.runtime.getURL('interceptor.js');
        el.onload = function () { el.remove(); };
        (document.head || document.documentElement).appendChild(el);
    });
})();
