# PRODUCT

## Register
product — a monitoring dashboard. Design serves the data; the product IS the data, not a marketing surface.

## Product Purpose
AirWatch BQ surfaces real-time air-quality readings from a Smart Citizen Kit sensor in Barranquilla, Colombia, and pairs them with an XGBoost AQI prediction. The user opens the app to answer one question fast: *is the air safe right now, and what should I do about it?*

## Users
Primary: residents and parents in Barranquilla checking ambient PM2.5/PM10 before going outside, dropping kids at school, exercising, or opening windows. Spanish-speaking. Mixed technical literacy. Mobile-first usage on uncertain mobile networks; secondary desktop usage by environmental researchers and Smart Citizen Kit hobbyists.

Secondary: civic/health stakeholders who want a credible, neutral signal — not a marketing surface, not a corporate dashboard.

## Voice & Tone
- Spanish, clear, neutral, factual.
- Health-information register: confident, never alarmist, never patronizing.
- Numbers and units carry meaning — never decorative.
- No emoji, no exclamation marks. The data does the talking.

## Strategic Principles
1. **Truth before polish.** A wrong reading hidden behind a beautiful gauge is malpractice. Loading, stale, and offline states must be as legible as success.
2. **One glance to safety.** The AQI category and recommended action must be readable in <2 seconds without scrolling.
3. **Calm under bad news.** When AQI is "Peligrosa", the UI should *inform*, not panic. Color and typography do the work — no flashing, no shaking.
4. **Respect attention.** No animations that delay information. Motion only where it teaches change (value transitions, needle movement).
5. **Mobile-first reality.** Designed for a phone in bright Colombian midday sun, on flaky 4G, held with one hand.

## Anti-References
We are NOT:
- A generic SaaS observability dashboard (Datadog/Grafana). Those are for engineers staring at incidents; we serve a parent at a bus stop.
- A government portal (Ministerio de Salud aesthetic — beige, dense tables, broken on mobile). Our credibility comes from speed and clarity, not letterhead.
- A "smart home" gadget app (Nest/Apple-Health gradient bubbles). Friendly is fine; toy-like is not. Health data deserves gravity.
- A weather app with cute illustrations (Carrot, Yahoo Weather). The subject matter is human respiration, not whether to bring an umbrella.

## Aesthetic Direction
Quietly sophisticated, instrument-grade, Latin-American urban evening. Dark surface that recedes; data that reads first. Glass and motion are tools, not the message — used where they aid scanning (gauge halo telegraphs danger tier; animated number telegraphs change), nowhere else.

## Constraints
- Spanish copy throughout (date-fns/es locale).
- Dark theme is required (the scene: someone at home, evening, lights off, checking before opening windows; or outside in glare where dark UI cuts reflection).
- Single-device single-region for v1; UI must not pretend to support more (no fake device picker, no fake map).
- Mocked backend in v1 (MSW); UI must work identically when real backend is wired.
