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

## Aktuální stav

Aplikace je funkční. Příště řešit:
- Automatické spuštění serveru při startu Macu
- Případně přidat další zastávky nebo linky
