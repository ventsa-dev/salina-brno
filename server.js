const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Zastávka tramvaj 5 — Venhudova
const TRAM_STOP_ID = 1731;
const TRAM_LINE = '5';
const PLATFORM_CENTRUM = 'město';
const PLATFORM_STEFANIKOVA = 'Štefánik.čtvrť';

// Zastávka trolejbus 25, 26 — Provazníkova
const TROLEJ_STOP_ID = 1522;
const TROLEJ_LINES = ['25', '26'];
const PLATFORM_MENDLOVO = 'Pionýrská,Lesná';

app.use(express.static(path.join(__dirname, 'public')));

const apiLimiter = rateLimit({
  windowMs: 10 * 1000,   // 10 sekund
  max: 5,                 // max 5 požadavků za okno
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

function parseMinutes(timeMark) {
  if (!timeMark) return null;
  let mins = 0;
  const hours = timeMark.match(/(\d+)h/);
  const minutes = timeMark.match(/(\d+)min/);
  if (hours) mins += parseInt(hours[1]) * 60;
  if (minutes) mins += parseInt(minutes[1]);
  return (hours || minutes) ? mins : null;
}

function departureTime(minutesFromNow, timeMark) {
  if (timeMark === '**' || minutesFromNow === 0) {
    return new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  }
  if (minutesFromNow === null) return null;
  const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
  return d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
}

function mapDeparture(dep) {
  const mins = parseMinutes(dep.TimeMark);
  return {
    line: dep.LineName,
    destination: dep.FinalStop,
    minutes: mins,
    clockTime: departureTime(mins, dep.TimeMark),
    timeMark: dep.TimeMark,
    lowFloor: dep.IsLowFloor,
  };
}

async function fetchStop(stopId) {
  const response = await fetch(`https://mapa.idsjmk.cz/api/Departures?stopid=${stopId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
  });
  if (!response.ok) throw new Error('Chyba při načítání dat z IDS JMK');
  return response.json();
}

app.get('/api/departures', async (req, res) => {
  try {
    const [tramData, trolejData] = await Promise.all([
      fetchStop(TRAM_STOP_ID),
      fetchStop(TROLEJ_STOP_ID),
    ]);

    // Tramvaj 5 — oba směry
    const tramByPlatform = {};
    for (const post of tramData.PostList || []) {
      const deps = (post.Departures || []).filter(d => d.LineName === TRAM_LINE);
      if (deps.length > 0) tramByPlatform[post.Name] = deps.map(mapDeparture);
    }

    // Trolejbus 25 a 26 — směr Mendlovo náměstí
    const trolejDeps = [];
    for (const post of trolejData.PostList || []) {
      if (post.Name !== PLATFORM_MENDLOVO) continue;
      for (const dep of post.Departures || []) {
        if (TROLEJ_LINES.includes(dep.LineName)) {
          trolejDeps.push(mapDeparture(dep));
        }
      }
    }
    trolejDeps.sort((a, b) => (a.minutes ?? 9999) - (b.minutes ?? 9999));

    res.json({
      centrum: (tramByPlatform[PLATFORM_CENTRUM] || []).slice(0, 2),
      stefanikova: (tramByPlatform[PLATFORM_STEFANIKOVA] || []).slice(0, 2),
      trolejbus: trolejDeps.slice(0, 2),
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Chyba:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
