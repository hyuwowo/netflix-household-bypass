/* Netflix Household Bypass — Popup
   No toggle needed, bypass is always active. */

(function () {
    'use strict';
    var api = (typeof browser !== 'undefined') ? browser : chrome;

    // Ensure bypass is always enabled on popup open
    api.storage.local.set({ bypassEnabled: true });
})();
