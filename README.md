# Tjat – webbapp

Anti-prokrastineringsapp: spela in ditt eget tjat, ställ in tiden och bli påmind med din egen röst. Backend finns i [nagster-api](https://github.com/josefanderberg/nagster-api).

## Krav

- [.NET SDK 10](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 22](https://nodejs.org) (eller 20.19+)

## Starta

**1. Backend** – i en terminal:

```bash
git clone https://github.com/josefanderberg/nagster-api.git
cd nagster-api
dotnet run
```

API:et startar på `http://localhost:5080`. Databasen skapas automatiskt.

**2. Frontend** – i en ny terminal:

```bash
git clone https://github.com/josefanderberg/nagster-web.git
cd nagster-web
npm install
npm run dev
```

Öppna `http://localhost:5173`.

## Så används den

- Dra i ringen för att välja tid – medurs för minuter, moturs för sekunder
- Skriv en titel med pennan eller spela in ett tjat med mikrofonen. Inspelningen laddas upp som ljudfil och visas i listan
- Tryck **Starta**. När tiden gått ut spelas tjatet upp, och **Snooza** eller **Klart** uppdaterar uppgiften

## Tekniska val

- **Vite + React** – snabb utvecklingsmiljö och standard för nya React-projekt
- **fetch** i stället för axios – räcker för appens anrop, ett beroende mindre
- **MediaRecorder** för inspelning och **playbackRate** för det eskalerande tjatet – inbyggt i webbläsaren, inga extra bibliotek
- **Ringens uträkningar i `timerRing.js`, utan React** – ren logik som går att läsa och testa fristående
