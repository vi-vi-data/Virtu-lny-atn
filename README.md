# Virtuálny šatník s AI odporúčaním outfitov

Štýlová full-stack webová aplikácia s React frontendom, Node.js backendom, PostgreSQL databázou a AI odporúčaním outfitov.

## Čo je hotové
- registrácia a prihlásenie cez JWT
- virtuálny šatník s ukladaním oblečenia
- nahrávanie obrázkov
- AI odporúčanie outfitu
- uložené outfity
- obľúbené kombinácie
- kalendár outfitov
- jemný Pinterest-like UI v ružovo-fialových farbách
- Docker Compose pre frontend, backend aj databázu

## Spustenie jedným príkazom
V koreňovom priečinku projektu spusti:

```bash
docker compose up --build
```

Potom otvor:
- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health

## Dôležité
Databáza sa inicializuje automaticky z `backend/schema.sql`, takže netreba ručne importovať tabuľky.

## AI režimy
Aplikácia funguje aj bez AI kľúča.
- bez `GEMINI_API_KEY` používa inteligentný fallback algoritmus
- s `GEMINI_API_KEY` používa Gemini API

Ak chceš zapnúť Gemini, doplň kľúč v `docker-compose.yml` pri službe `backend`.

## Demo flow
1. Zaregistruj sa.
2. Pridaj si oblečenie do šatníka.
3. Otvor AI stylistu.
4. Zadaj príležitosť, počasie, štýl a sezónu.
5. Ulož odporúčaný outfit, pridaj ho medzi obľúbené alebo do kalendára.
