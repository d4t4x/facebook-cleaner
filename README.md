# Fuzzify.me

*A work in progress*

A browser extension that helps you understand how advertisers target you on Facebook. With one click, the tool automatically runs a housecleaning, denying advertisers access to all the categories Facebook is constantly generating about you. In the timeline to the right, you can keep track of what categories have been cleared out and what targeted ads you're seeing over time.

Built for both Chrome & Firefox.

## Installation Firefox

1. Clone this github repository or download it as a zip file and unzip: https://github.com/d4t4x/facebook-cleaner
2. Go to `about:debugging#addons` (type in address bar) and click `"Load Temporary Add-On"`. Then you'll want to pick the `manifest.json` file in the `build` folder inside the project folder.
3. If you have an ad blocker, you'll need to disable it while you browse Facebook.
4. Click the purple icon in the toolbar and you'll see the full visual timeline of all the ads & cleaning history. It will take a few Facebook sessions to collect enough data, so at first this will appear empty.

## Installation Chrome

1. Clone this github repository or download it as a zip file and unzip: https://github.com/d4t4x/facebook-cleaner
2. Go to `chrome://extensions/` (type in address bar) and click `"Load Unpacked"`. Then you'll want to pick the "build" folder inside the project folder.
3. If you have an ad blocker, you'll need to disable it while you browse Facebook.
4. Click the purple icon in the toolbar and you'll see the full visual timeline of all the ads & cleaning history. It will take a few Facebook sessions to collect enough data, so at first this will appear empty.

## Limitations

- does not work with Ad Blocker enabled on Facebook.com
- does not work in Private/Incognito window
- request for rationale of "Why am I seeing this ad" starts after a few seconds and then only gets called every 30 seconds to avoid getting blocked


