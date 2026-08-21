# Asset Provenance and Credits

## Fan-Project & Non-Commercial Disclaimer

This application (**Spider-Man Life RPG Prototype**) is an independent, non-commercial fan project created solely for personal educational, demonstration, and portfolio purposes.

- **Trademarks & Copyrights**: Spider-Man and all related characters, allies, villains, Spider-Verse variants, logos, suit designs, gadget names, move titles, and imagery are trademarks and copyrights of **Marvel Entertainment, LLC**, **Disney**, **Sony Interactive Entertainment**, **Insomniac Games, Inc.**, **Sony Pictures Animation**, and **Second Dinner Studios, Inc.**
- **No Commercial Exploitation**: This project contains no commercial monetization, microtransactions, or proprietary asset extraction. No game code, binary files, 3D models, or audio samples from proprietary games have been ripped, scraped, or packaged.
- **Reference Baseline**: PlayStation and Insomniac Games official store pages, guides, update announcements, and support documentation serve as authoritative baselines for game release classification (`sm2018`, `miles2020`, `sm2`), hero assignment (`peter`, `miles`, `shared`), ability families, and verified vs inspired item badges.

---

## Centralized Media Asset Catalog & Provenance Overview

All promotional and database images used within `data/media.js` are managed via the high-availability media pipeline, supporting local generated fan portrait artwork (`assets/generated/portraits/`), remote WebP CDN links (`snap.fan`), official PlayStation promotional references, and dynamic inline SVG fallbacks across all entries.

| Asset Category | Total Entries | Primary Publisher / Asset Source | Media Treatment |
| :--- | :---: | :--- | :--- |
| **Spider-People / Spider-Verse** | 36 | Local Generated Fan Art + `snap.fan` CDN | Portrait-First (3:4 Ratio, Compact Image + Name Only) |
| **Spider-Allies (Pure non-Spider)** | 26 | Local Generated Fan Art + `snap.fan` CDN | Portrait-First (3:4 Ratio, Compact Image + Name Only) |
| **Suits Studio** | 37 | PlayStation Official + `snap.fan` CDN | Portrait-First (3:4 Ratio, Compact Image + Name Only) |
| **Skills & Moves Tree** | 48 | PlayStation Official + `snap.fan` CDN | Portrait-First (3:4 Ratio, Compact Image + Name Only) |
| **Villains Codex** | 30 | `MARVEL SNAP` CDN (`game-assets.snap.fan`) | Portrait-First (3:4 Ratio, Compact Image + Name Only) |
| **Insomniac Gadgets** | 16 | `MARVEL SNAP` CDN (`game-assets.snap.fan`) | Cinematic Landscape (16:9 Frame) |
| **Total Media Catalog** | **175+** | **PlayStation Official + Generated Fan Art + Snap CDN** | **Unified Image-First Renderer** |

---

## PlayStation / Insomniac Official Baseline References

1. **Marvel's Spider-Man Remastered**: `https://www.playstation.com/en-us/games/marvels-spider-man-remastered/`
2. **Remastered Features & Pre-purchase**: `https://blog.playstation.com/2022/07/20/marvels-spider-man-remastered-pc-features-revealed/`
3. **Marvel's Spider-Man: Miles Morales**: `https://www.playstation.com/en-us/games/marvels-spider-man-miles-morales/`
4. **Marvel's Spider-Man 2**: `https://www.playstation.com/en-us/games/marvels-spider-man-2/`
5. **Marvel's Spider-Man 2 Support**: `https://www.playstation.com/en-us/support/games/marvels-spider-man-2-support/`
6. **Marvel's Spider-Man 2 Skill Guide**: `https://www.playstation.com/fr-fr/games/marvels-spider-man-2/whats-new-in-marvels-spider-man-2/`
7. **Insomniac Release Updates**: `https://blog.playstation.com/2024/06/11/marvels-spider-man-2-update-includes-suit-collab-and-fan-favorites-available-june-18/`
8. **Insomniac Release Notes**: `https://support.insomniac.games/hc/en-us/articles/53862549566227-Release-Notes-v1-005-000`

---

## Technical Architecture & Provenance Pipeline

1. **Centralized Media Catalog (`data/media.js`)**: All image entries (`src`, `sourceUrl`, `sourceName`, `publisherChip`, `mediaType`, `objectPosition`, `fallbackSvg`) are managed via `MediaHelper.renderMediaCardHtml()`.
2. **Multi-Tier Fallback Pipeline**: Local path -> Remote CDN -> Inline SVG fallback.
3. **Performance & Accessibility**: Every rendered `<img>` tag uses `loading="lazy"`. Compact cards display image + visible name only. Large card viewer displays full provenance details, verified/inspired badge, game source, playable hero, and direct official reference links.
