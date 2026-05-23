# DESIGN

## Color

OKLCH-tuned slate palette w/ AQI-tier accents. Low chroma on neutrals (tinted toward cool blue, ~0.01 chroma). Saturated AQI colors reserved for category meaning only — never decorative.

### Strategy
**Restrained** for chrome (navbar, footer, body bg, card surfaces, text). **Committed** locally inside the AQI gauge: when category is "Dañina", "Muy dañina", or "Peligrosa", that single component's halo + glow takes the surface so it reads instantly without color-coding the whole page.

### Tokens (current)
```css
--bg-base: radial-gradient(ellipse at top, #0f172a 0%, #0b1120 60%, #07090f 100%);
--color-text: #f1f5f9;        /* slate-100 */
--color-muted: #94a3b8;       /* slate-400 */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.10);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.40);

/* AQI tiers — meaning-bearing only */
--aqi-good:           #00E400;
--aqi-moderate:       #FFFF00;
--aqi-sensitive:      #FF7E00;
--aqi-unhealthy:      #FF0000;
--aqi-very-unhealthy: #8F3F97;
--aqi-hazardous:      #7E0023;
```

### Rules
- Never `#000` / `#fff`. Page bg uses tinted near-black gradient.
- Tier colors appear on: AQI gauge arcs, gauge halo, prediction-result halo, Badge, StatusDot. Nowhere else.
- MetricCard left-edge accent uses sensor-specific chroma (orange PM2.5, violet PM10, red temp, sky humidity, etc.). These are *identity* colors per sensor, not severity colors.
- Critical-tier vignette (`> 150`) is allowed only on the AQI gauge container, not the page.

## Typography

**Inter Variable** loaded via `@fontsource-variable/inter`. Single family, weight + size hierarchy.

### Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Page title | `text-2xl` (24px) | 700 | Device name on Dashboard |
| Section heading | `text-lg` (18px) | 600 | "Histórico", "Información del modelo" |
| Card label uppercase | `text-xs` (12px) | 500 | `uppercase tracking-widest` for eyebrow text |
| Metric value | `text-3xl` (30px) | 700 | `tabular-nums` always |
| AQI gauge value | `text-5xl` (48px) | 700 | `tabular-nums` |
| Body | `text-sm` (14px) | 400 | Spanish accents render correctly |
| Muted/meta | `text-xs` (12px) | 400 | timestamps, units |

Ratio between adjacent steps ≥ 1.25. Numerics always `font-variant-numeric: tabular-nums` (`.tabular-nums` utility) so digits don't shift between updates.

## Spacing & Rhythm

Based on Tailwind 4-unit scale. Card interior padding uses 5 (20px) for metric cards, 6 (24px) for gauge + prediction. Vertical section gaps use `space-y-6` (24px) on pages. Grid gaps `gap-4` (16px) between metric cards, `gap-6` (24px) between major sections.

Rule: vary breathing room. Metric grid is dense; gauge area is roomy; chart has wide margins. Same padding everywhere is the bored pattern — avoid.

## Elevation

Single elevation level (cards). No nested depth. All cards share the GlassCard treatment:
- `bg-white/5`
- `backdrop-blur-xl` (24px)
- `border border-white/10`
- `shadow-[0_8px_32px_rgba(0,0,0,0.40)]`
- Optional left accent: 3px sensor-color border for MetricCard only.

No second tier of elevation. No nested cards. Tooltips/popovers can use `bg-slate-900/90` with the same border treatment.

## Components

### GlassCard
Universal surface. All cards extend it.

### MetricCard
Sensor-color left accent (3px), large icon top-left, trend arrow top-right, animated number + unit, label below. Hover: `y: -2 scale: 1.01` spring. Skeleton state: pulsing bars matching final layout.

### AQIGauge
Semicircular SVG, 6 arc segments colored by tier, animated needle (spring, stiffness 60 / damping 14), animated number in center, Badge below. Ambient halo behind: radial gradient in current tier color. AQI > 150 adds inset glow.

### SensorChart
Recharts LineChart. Custom dark tooltip. Time-axis formatted by range. Y-axis minimal. Loading state = `LoadingSpinner lg` centered.

### Predictions UI
PredictionResult mirrors AQIGauge halo treatment but in card form. ManualInputForm uses `bg-slate-800/60` inputs with `border-white/10`, focus ring blue-500. ModelInfoPanel: horizontal Recharts BarChart with blue-shade gradient.

### StatusDot
3 states: online (green w/ ping), stale (yellow), offline (red, no ping). ARIA label always set.

### Layout
Sticky glass navbar (`bg-slate-950/60 backdrop-blur-xl`), max-w-7xl content, footer with data-source attribution. Mobile: hamburger menu, vertical link stack.

## Motion

Framer Motion. Easing: spring or `easeOut`. No bounce, no elastic. No animated CSS layout properties.

| Surface | Motion |
|---|---|
| Route change | 200ms fade + 8px y-slide |
| Card mount | stagger 40ms, fade-up |
| MetricCard hover | spring `y: -2 scale: 1.01` |
| AnimatedNumber | 320ms ease-out cubic, prev → next |
| AQIGauge needle | spring stiffness 60 damping 14 |
| StatusDot online | dual `animate-ping` + steady core |

`prefers-reduced-motion: reduce` collapses all motion to instant.

## Iconography

Lucide React only. Sensor icons: `wind cloud thermometer droplets volume-2 leaf flame battery`. UI icons: `Wind Menu X AlertCircle RefreshCw ArrowUpRight ArrowDownRight Minus Bot Sliders AlertTriangle`. Stroke width default (1.5). Size 5–7 per context.

## Copy Patterns

- All Spanish.
- "N/D" for missing values, never "—" alone (which can be confused with subtraction in data).
- Time relative: `formatDistanceToNow(..., { locale: es, addSuffix: true })` → "hace 2 minutos".
- Date absolute: `format(..., "d 'de' MMMM, HH:mm", { locale: es })`.
- Errors: factual sentence + "Reintentar" CTA. Never "Oops" / "Algo salió mal" without context.
- Health recommendations: imperative, second-person formal ("Use mascarilla", "Evite actividades"). No conditionals, no hedging.

## Banned Locally

Beyond impeccable's universal bans:
- No emoji in production UI (PRODUCT.md tone rule).
- No exclamation marks anywhere visible.
- No skeuomorphic gauges (steampunk dials, analog meters with shadows). The AQIGauge is intentionally flat-modern.
- No weather-app illustrations (sun/cloud SVGs as decoration).
- No "thumbs up / thumbs down" feedback affordances.
- No notifications opt-in modals on first load.
