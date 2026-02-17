#!/usr/bin/env bash
set -euo pipefail

EXPO_APP_DIR="${EXPO_APP_DIR:-/Users/michele/Desktop/my-expo-app}"
EXPORT_DIR="${EXPORT_DIR:-$EXPO_APP_DIR/dist}"
TARGET_PUBLIC_DIR="${TARGET_PUBLIC_DIR:-$(cd "$(dirname "$0")/.." && pwd)/public}"

echo "Exporting Expo web build from: $EXPO_APP_DIR"
pushd "$EXPO_APP_DIR" >/dev/null
if command -v npx >/dev/null 2>&1; then
  npx expo export -p web --output-dir "$EXPORT_DIR"
elif [ -x "./node_modules/.bin/expo" ]; then
  ./node_modules/.bin/expo export -p web --output-dir "$EXPORT_DIR"
else
  echo "Error: npx not found and ./node_modules/.bin/expo is missing."
  echo "Install dependencies in $EXPO_APP_DIR (npm install) or add npx to PATH."
  exit 127
fi
popd >/dev/null

echo "Syncing assets to: $TARGET_PUBLIC_DIR"
rm -rf "$TARGET_PUBLIC_DIR/_expo" "$TARGET_PUBLIC_DIR/assets"
cp -R "$EXPORT_DIR/_expo" "$TARGET_PUBLIC_DIR/_expo"
cp -R "$EXPORT_DIR/assets" "$TARGET_PUBLIC_DIR/assets"
cp "$EXPORT_DIR/index.html" "$TARGET_PUBLIC_DIR/app-index.html"

if [ -f "$EXPORT_DIR/favicon.ico" ]; then
  cp "$EXPORT_DIR/favicon.ico" "$TARGET_PUBLIC_DIR/favicon.ico"
fi

if [ -f "$TARGET_PUBLIC_DIR/app-index.html" ]; then
  python3 - <<'PY'
from pathlib import Path

path = Path("DailyCheck.ch/public/app-index.html")
if not path.exists():
    raise SystemExit(0)

html = path.read_text(encoding="utf-8")
inject = """
<link rel="manifest" href="/manifest.webmanifest"/>
<meta name="theme-color" content="#081A2C"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
<link rel="apple-touch-icon" href="/image/logo.png"/>
"""

if "manifest.webmanifest" not in html:
    html = html.replace("</head>", inject + "</head>")
    path.write_text(html, encoding="utf-8")
PY
fi

echo "PWA export synced. Deploy DailyCheck.ch for app.dailycheck.ch."
