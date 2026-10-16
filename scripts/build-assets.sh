#!/usr/bin/env bash
# Gera os ativos visuais estáticos a partir de assets-src/ (requer ImageMagick 6+).
# Os arquivos gerados são versionados; rode novamente só quando a foto ou a paleta mudar.
#   npm run assets
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets-src"
OUT="$ROOT/public/img"
INK='#3A27A6'
PAPER='#F6F6F1'

mkdir -p "$OUT"

# Foto em meio-tom: retícula ordenada em 2 cores (tinta violeta sobre papel),
# ampliada sem suavização para manter os pontos nítidos. -strip remove EXIF/GPS.
convert "$SRC/samuel.jpg" -colorspace Gray -gamma 1.5 -level 0%,85% \
  -resize 340x -ordered-dither h4x4o -filter point -resize 300% \
  +level-colors "$INK","$PAPER" -strip -colors 2 PNG8:"$OUT/samuel-halftone.png"

# Granulado de papel: ruído claro e suave para multiplicar sobre o papel.
convert -size 256x256 xc:gray50 -seed 7 +noise Gaussian -colorspace Gray \
  -blur 0x0.6 -auto-level +level 90%,100% -strip -quality 70 "$OUT/paper-grain.webp"

# Granulado de tinta: máscara alfa com falhas, usada nas impressões de carimbo.
convert -size 256x256 xc: -seed 11 +noise Random -colorspace Gray -blur 0x1.1 \
  -auto-level -threshold 41% -alpha copy -fill black -colorize 100 -strip \
  PNG32:"$OUT/ink-grain.png"

ls -la "$OUT"
