# Šalina — odjezdová tabule

Webová aplikace zobrazující real-time odjezdy MHD v Brně ze zastávky Venhudova.

## Co aplikace dělá

- Zobrazuje 2 nejbližší odjezdy **tramvaje 5** (oba směry)
- Zobrazuje 2 nejbližší odjezdy **trolejbusu 25 a 26** směr Mendlovo náměstí
- Data jsou real-time z IDS JMK (GPS poloha vozidel, aktualizace ~10s)
- Stránka se sama obnovuje každých 30 sekund

## Architektura

- `server.js` — Node.js/Express server, proxy na mapa.idsjmk.cz API
- `public/index.html` — frontend (HTML + CSS + JS, žádné závislosti)

## Zastávky a ID

| Zastávka | StopID | Linka | Nástupiště |
|---|---|---|---|
| Venhudova | 1731 | tramvaj 5 | `město` (centrum), `Štefánik.čtvrť` |
| Provazníkova | 1522 | trolejbus 25, 26 | `Pionýrská,Lesná` (Mendlovo náměstí) |

## Jak spustit

```bash
cd ~/vibecoding/projekty/tramvaj-odjezdy
node server.js
# otevři http://localhost:3000
```

## Jízdní řády (jrbrno.cz)

| Sekce | URL |
|---|---|
| Šalina směr centrum | `https://www.jrbrno.cz/L5S1Z266` |
| Šalina směr Štefánikova čtvrť | `https://www.jrbrno.cz/L5S2Z266` |
| Trolejbus 25 → Mendlovo | `https://www.jrbrno.cz/L25S1Z428` |
| Trolejbus 26 → Mendlovo | `https://www.jrbrno.cz/L26S1Z428` |

## Hosting

- **Railway:** `https://odjezdy.up.railway.app`
- GitHub repo: `ventsa-dev/salina-brno` (main branch = auto-deploy)
- Deploy: `git push` → Railway nasadí automaticky

## PWA

- `public/manifest.json` + `public/sw.js` + ikony v `public/icons/`
- Ikony se generují: `node generate-icons.js`
- SW cache verze: aktuálně `salina-v3`

## Aktuální stav

Aplikace je funkční a nasazená. Příště řešit:
- **Opravit mobile layout na telefonu** — lokálně funguje, na Railway se zobrazuje stará verze (SW cache problém). Zkusit: smazat appku z telefonu, otevřít znovu přes prohlížeč
- Automatické spuštění lokálního serveru při startu Macu
- Případně přidat další zastávky nebo linky
