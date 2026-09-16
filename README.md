# Nagster – webbapp

Nagster är en anti-prokrastineringsapp: du spelar in din egen röst för en uppgift ("Skriv klart koden!") och när du snoozar spelas rösten upp igen – snabbare, gällare och mer påstridig för varje snooze.

Detta repo är webbapplikationen (React). Backend finns i [nagster-api](https://github.com/josefanderberg/nagster-api). Senare i kursen tillkommer en mobilapp i React Native som pratar med samma backend.

## Förutsättningar

- [Node.js](https://nodejs.org) 20 eller senare
- [.NET SDK](https://dotnet.microsoft.com/download) 8 eller senare (för backend)

## 1. Starta backend först

```bash
git clone https://github.com/josefanderberg/nagster-api.git
cd nagster-api
dotnet run
```

API:et startar på `http://localhost:5080`. SQLite-databasen skapas automatiskt vid första starten – ingen installation eller konfiguration behövs.

## 2. Starta webbappen

I en ny terminal:

```bash
git clone https://github.com/josefanderberg/nagster-web.git
cd nagster-web
npm install
npm run dev
```

Öppna `http://localhost:5173` i webbläsaren.

## Funktioner

- Lista, skapa och uppdatera uppgifter via API:et (GET, POST, PUT)
- Ladda upp en fil (ljud eller bild) till en uppgift – bild visas som miniatyr och ljud som spelare i listan
- Spela in din röst direkt i webbläsaren och koppla den till en uppgift
- Snooze: varje snooze höjer uppspelningshastigheten så rösten blir alltmer panikslagen
- Responsiv design – fungerar på både mobil- och desktopstorlek
- Felhantering: svarar inte API:et visas ett felmeddelande i stället för en krasch

## Tekniska val

- **Vite** som byggverktyg: snabb dev-server med HMR och standardvalet för nya React-projekt.
- **fetch** i stället för axios: inbyggt i webbläsaren och räcker för appens anrop – ett beroende mindre att installera.
- **MediaRecorder API** för röstinspelning: inbyggt i webbläsaren, inget externt bibliotek behövs.
- **playbackRate med preservesPitch avstängt** för eskaleringen: rösten blir snabbare och gällare helt i klienten, utan ljudbearbetning på servern.
- **Inget state-bibliotek** (Redux o.dyl.): `useState` räcker gott för en app i den här storleken.
