/* Netflix Household Bypass — Content Script
   Handles DOM-level bypass: hides restriction overlays,
   resumes paused video, and observes for new modal injection. */

(function () {
    'use strict';

    var api = (typeof browser !== 'undefined') ? browser : chrome;
    var active = true;
    var watcher = null;

    /* CSS selectors for Netflix's household / location modals.
       These are combined class strings Netflix applies to their
       restriction overlay components. */
    var OVERLAY_SELECTORS = [
        '.nf-modal.interstitial-full-screen',
        '.nf-modal.uma-modal.two-section-uma',
        '.nf-modal.extended-diacritics-language.interstitial-full-screen',
        '.css-1nym653.modal-enter-done'
    ];

    /* Class substrings used in fuzzy matching for MutationObserver */
    var OVERLAY_CLASS_PARTS = [
        'layout-item_styles__zc08zp30 default-ltr-cache-7vbe6a ermvlvv0',
        'default-ltr-cache-1sfbp89 e1qcljkj0',
        'default-Itr-iqcdef-cache-ohh5jx e53rikt0',
        'css-1nym653 modal-enter-done',
        'nf-modal interstitial-full-screen',
        'nf-modal uma-modal two-section-uma',
        'nf-modal extended-diacritics-language interstitial-full-screen'
    ];

    function purgeOverlays() {
        OVERLAY_SELECTORS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) { el.remove(); });
        });
        OVERLAY_CLASS_PARTS.forEach(function (cls) {
            document.querySelectorAll('[class*="' + cls + '"]').forEach(function (el) { el.remove(); });
        });
    }

    function resumePlayback() {
        var vid = document.querySelector('video');
        if (vid && vid.paused) {
            vid.play().catch(function () { /* autoplay policy */ });
        }
    }

    function enforce() {
        if (!active) return;
        purgeOverlays();
        resumePlayback();
    }

    function startWatcher() {
        if (watcher) return;
        var target = document.body || document.documentElement;
        watcher = new MutationObserver(function (records) {
            for (var i = 0; i < records.length; i++) {
                var added = records[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    var node = added[j];
                    if (node.nodeType !== 1) continue;
                    var cls = node.className;
                    if (typeof cls !== 'string') continue;
                    var hit = OVERLAY_CLASS_PARTS.some(function (p) { return cls.indexOf(p) !== -1; });
                    if (hit) { enforce(); return; }
                }
            }
        });
        watcher.observe(target, { childList: true, subtree: true });
    }

    function stopWatcher() {
        if (watcher) { watcher.disconnect(); watcher = null; }
    }

    function boot() {
        if (!active) { stopWatcher(); return; }
        enforce();
        startWatcher();
    }

    /* Read persisted state */
    api.storage.local.get(['bypassEnabled'], function (cfg) {
        active = cfg.bypassEnabled !== false;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', boot);
        } else {
            boot();
        }
    });

    /* React to popup toggle */
    api.runtime.onMessage.addListener(function (msg) {
        if (msg.type === 'toggle') {
            active = !!msg.enabled;
            boot();
        }
    });
})();
