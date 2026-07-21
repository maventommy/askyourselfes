// Post-export: inject PWA + iOS + notch-viewport tags into the built dist/index.html.
// Run after `expo export -p web`. Idempotent.
import { readFile, writeFile } from 'node:fs/promises';

const file = process.argv[2] ?? 'dist/index.html';
let html = await readFile(file, 'utf8');

const safeAreaCss =
  '<style>@supports(padding:max(0px)){body{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);}}</style>';

const tags = [
  '<link rel="manifest" href="/manifest.json">',
  '<meta name="theme-color" content="#0d0c0a">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
  '<meta name="apple-mobile-web-app-title" content="Ask Yourselves">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
  safeAreaCss,
].join('\n    ');

// Allow fullscreen + notch handling (replace or add the viewport meta).
if (/<meta name="viewport"[^>]*>/i.test(html)) {
  html = html.replace(
    /<meta name="viewport"[^>]*>/i,
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">',
  );
} else {
  html = html.replace('</head>', '    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">\n  </head>');
}

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', `    ${tags}\n  </head>`);
}

await writeFile(file, html);
console.log('injected PWA tags into', file);
