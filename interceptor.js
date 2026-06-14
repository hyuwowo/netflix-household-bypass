/* Netflix Household Bypass — Network Interceptor
   Patches window.fetch and XMLHttpRequest to filter
   household-verification traffic on Netflix's GraphQL endpoint. */

(function () {
    'use strict';

    if (window.__hhBypassInterceptorReady) return;
    window.__hhBypassInterceptorReady = true;

    var GQL_PATH = 'web.prod.cloud.netflix.com/graphql';

    /* Tokens that uniquely identify household / location-gate traffic.
       These never appear in normal browse, search or playback payloads. */
    var GATE_TOKENS = [
        'household',
        'in-home',
        'inhome',
        'setlocationcontext',
        'householdstatus',
        'updatememberstate',
        'memberstatus'
    ];

    function isGatePayload(raw) {
        if (typeof raw !== 'string' || raw.length === 0) return false;
        var lc = raw.toLowerCase();
        return GATE_TOKENS.some(function (t) { return lc.indexOf(t) !== -1; });
    }

    function isGraphQL(url) {
        return typeof url === 'string' && url.indexOf(GQL_PATH) !== -1;
    }

    function resolveUrl(input) {
        if (typeof input === 'string') return input;
        if (input && typeof input.url === 'string') return input.url;
        if (input && typeof input.href === 'string') return input.href;
        return '';
    }

    var EMPTY_OK = new Response('{"data":{}}', {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
    });

    /* ---- Patch fetch ---- */
    var nativeFetch = window.fetch;
    window.fetch = function (resource, opts) {
        var url = resolveUrl(resource);

        if (isGraphQL(url)) {
            var body = (opts && opts.body) ? opts.body : '';
            if (typeof body === 'string' && isGatePayload(body)) {
                console.debug('[HHBypass] Dropped outgoing gate request');
                return Promise.resolve(EMPTY_OK.clone());
            }

            return nativeFetch.apply(this, arguments).then(function (resp) {
                var copy = resp.clone();
                return copy.text().then(function (txt) {
                    if (isGatePayload(txt)) {
                        console.debug('[HHBypass] Sanitised gate response');
                        return new Response('{"data":{}}', {
                            status: 200,
                            statusText: 'OK',
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                    return resp;
                }).catch(function () { return resp; });
            });
        }

        return nativeFetch.apply(this, arguments);
    };

    /* ---- Patch XMLHttpRequest ---- */
    var xhrOpen = XMLHttpRequest.prototype.open;
    var xhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this.__hhUrl = typeof url === 'string' ? url : '';
        return xhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (payload) {
        if (isGraphQL(this.__hhUrl)) {
            var bodyStr = typeof payload === 'string' ? payload : '';

            if (isGatePayload(bodyStr)) {
                console.debug('[HHBypass] Dropped outgoing gate XHR');
                return; // silently drop
            }

            var ref = this;
            this.addEventListener('load', function onLoad() {
                try {
                    if (isGatePayload(ref.responseText || '')) {
                        console.debug('[HHBypass] Sanitised gate XHR response');
                        Object.defineProperty(ref, 'responseText', {
                            value: '{"data":{}}',
                            writable: true,
                            configurable: true
                        });
                        Object.defineProperty(ref, 'response', {
                            value: '{"data":{}}',
                            writable: true,
                            configurable: true
                        });
                    }
                } catch (_) { /* ignore */ }
            }, { once: true, capture: true });
        }

        return xhrSend.apply(this, arguments);
    };

    console.debug('[HHBypass] Interceptor loaded (' + document.readyState + ')');
})();
