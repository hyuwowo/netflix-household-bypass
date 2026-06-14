<p align="center">
  <img src="icons/banner.png" alt="Netflix Household Bypass" width="200" />
</p>

<h1 align="center">Netflix Household Bypass</h1>

<p align="center">
  <strong>Bypass Netflix household verification & location sharing restrictions.</strong><br/>
  Stream from any network, any location — using Netflix's own native player.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Free%20%26%20Non--Commercial-blue.svg" alt="Free License" /></a>
  <img src="https://img.shields.io/badge/Chrome-Manifest%20V3-brightgreen.svg" alt="Chrome MV3" />
  <img src="https://img.shields.io/badge/Firefox-MV2%20Compatible-orange.svg" alt="Firefox" />
  <img src="https://img.shields.io/badge/Size-~15KB-blueviolet.svg" alt="Size" />
</p>

---

## ❓ What Is This?

Netflix enforces a **household verification** system that forces all account members to stream from the same home network. If you travel, move, or use a different Wi-Fi, Netflix shows a **"Manage Netflix Household"** screen and blocks playback.

**Netflix Household Bypass** is a lightweight browser extension that intercepts Netflix's household & location verification at the **network (GraphQL API) level** — before it ever reaches your screen.

> No custom players. No heavy scripts. No bloat. Just bypass.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌐 **GraphQL API Interception** | Filters household verification queries & responses on `web.prod.cloud.netflix.com/graphql` |
| 🎨 **CSS Early Shield** | Instantly hides restriction modals before they render |
| 🔍 **DOM Observer** | Detects dynamically injected block screens and removes them in real-time |
| ▶️ **Auto-Resume** | Automatically plays video if Netflix pauses it during a location check |
| 🖥️ **100% Native Player** | Netflix's original player — subtitles, audio, quality, keyboard shortcuts all work |
| ⚡ **Always On** | No buttons to press. Install and forget. |

---

## 🏆 Why This Over Other Tools?

### vs. Custom Player-Based Extensions

| | **Netflix Household Bypass** | **Other Tools** |
|---|---|---|
| Player | ✅ Netflix native | ❌ Custom HTML5 overlay |
| Subtitles | ✅ All formats | ⚠️ Limited / broken |
| Audio Tracks | ✅ Full multi-language | ⚠️ Often missing |
| Video Quality | ✅ Full HD / 4K (DRM native) | ⚠️ May be limited |
| Keyboard Shortcuts | ✅ All Netflix shortcuts | ❌ Custom controls |
| Extension Size | ✅ ~15 KB | ❌ 200+ KB |
| Manifest Version | ✅ MV3 (Chromium) | ⚠️ Often legacy MV2 |
| CPU Overhead | ✅ Near zero | ❌ Heavy DOM manipulation |

### Key Technical Advantages

1. **Network-Level Interception** — Patches `fetch()` and `XMLHttpRequest` to strip household data before Netflix's frontend acts on it.

2. **Zero UI Injection** — Injects nothing visible. Your Netflix experience is 100% stock.

3. **Modern & Future-Proof** — Manifest V3 for Chromium, standard Web APIs only.

---

## 📥 Easy Installation Guide

This extension is designed to be installed manually in your browser. Follow these simple steps:

### 1. Download the Extension
* Go to the **[Releases](https://github.com/hyuwowo/netflix-household-bypass/releases)** page of this repository.
* Under the latest version, click and download **`netflix-household-bypass.zip`** (or click the green **Code** button at the top of this page and choose **Download ZIP**).
* **Extract/Unzip** the downloaded `.zip` file into a folder on your computer.

---

### 2. Load it into Your Browser

#### 🌐 Google Chrome / Microsoft Edge / Brave / Opera
1. Open your browser and go to: `chrome://extensions/` (or `edge://extensions/` for Edge).
2. Turn on **Developer mode** using the toggle switch in the top-right corner.
3. Click the **"Load unpacked"** (Muat ekstensi yang belum dikemas) button in the top-left corner.
4. Select the extracted `netflix-household-bypass` folder (the directory containing `manifest.json`).
5. **Done!** The extension is now active. You can pin the icon to your toolbar.

#### 🦊 Mozilla Firefox
1. Open Firefox and go to: `about:debugging#/runtime/this-firefox`
2. Click the **"Load Temporary Add-on..."** button.
3. Open the extracted folder and select **`manifest-firefox.json`**.
4. **Done!** The extension is active for this session.

---

## 🔧 How It Works

```
Netflix App                    Extension
    │                              │
    ├─── fetch(/graphql) ──────►  interceptor.js
    │                              │
    │    ┌─ household data?        │
    │    │  YES → return empty {}  │
    │    │  NO  → pass through     │
    │    └─────────────────────────┘
    │                              │
    ├─── DOM mutation ──────────► content.js
    │                              │
    │    ┌─ restriction modal?     │
    │    │  YES → remove + resume  │
    │    │  NO  → ignore           │
    │    └─────────────────────────┘
    │                              │
    └─── Normal playback continues
```

### File Structure

```
netflix-household-bypass/
├── manifest.json          # Chrome MV3
├── manifest-firefox.json  # Firefox MV2
├── loader.js              # Injects interceptor into page context
├── interceptor.js         # Patches fetch/XHR for GraphQL filtering
├── content.js             # DOM observer for overlay removal
├── styles.css             # Early CSS to hide restriction modals
├── popup.html / css / js  # Extension popup UI
├── icons/                 # Extension icons (16–128px)
└── LICENSE                # Free & Non-Commercial
```

---

## ⚠️ Disclaimer

> **This software is provided for educational and research purposes only.**
>
> Using this extension may violate [Netflix's Terms of Use](https://help.netflix.com/legal/termsofuse). The developers are **not responsible** for any account restrictions, suspensions, or terminations. **Use at your own risk.**
>
> Not affiliated with Netflix, Inc.

---

## 📄 License

[Free & Non-Commercial](LICENSE) — This software is **100% free**. Selling it is strictly prohibited.

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b fix/your-fix`)
3. Commit changes
4. Open a Pull Request

---

## 🔑 Keywords

`netflix` `household` `bypass` `extension` `chrome extension` `firefox addon` `netflix household bypass` `netflix location bypass` `netflix sharing restrictions` `netflix household verification` `graphql interceptor` `manifest v3` `browser extension` `streaming` `netflix bypass 2025` `netflix bypass 2026`
