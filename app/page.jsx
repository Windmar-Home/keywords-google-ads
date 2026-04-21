"use client";
import React, { useState, useEffect } from "react";

// ============================================================
// DATOS — actualizables semanalmente vía prompt a Claude
// ============================================================
const DATA = {
  lastUpdate: "21 abr 2026",
  period: "22 ene – 21 abr 2026",
  totalTerms: 15795,
  executiveSummary: {
    totalWinners: 74,
    totalWaste: 198,
    wasteAmount: 1568,
    potentialRecovery: 392,
    potentialConversions: "4-8",
    currentCostPerConv: 101.46,
    projectedCostPerConv: 72,
    currentConvRate: 1.48,
    projectedConvRate: 2.8,
  },
  campaigns: {
    BRAND: {
      id: "BRAND",
      name: "WH PR - Search - BRAND",
      status: "ok",
      keywords: 10,
      alerts: 1,
      suggestions: 2,
      qs: 8.2,
      lowQsKeywords: 0,
      winnersCount: 4,
      reviewCount: 8,
      wasteCount: 6,
      wasteAmount: 65,
      impressions: 95527,
      clicks: 5295,
      ctr: 5.54,
      cpc: 0.90,
      cost: 4772.52,
      conversions: 65,
      convRate: 1.23,
      costPerConv: 73.42,
      wasteTerms: [
        { term: "windmar home sellado de techo", clicks: 14, cost: 24.76, cat: "irrelevante", action: "negativa", detail: "Busqueda de techo en campana de solar. Agrega como negativa en BRAND para redirigir a ROOFING." },
        { term: "windmar roofing", clicks: 34, cost: 49.27, cat: "fuera_de_area", action: "revisar_landing", detail: "34 clics de usuarios buscando techos - buen intent pero landing de solar no aplica. Considera crear landing especifica de roofing." },
        { term: "windmar solar puerto rico", clicks: 19, cost: 37.22, cat: "kw_sin_conv", action: "revisar_landing", detail: "19 clics sin conversion. Termino relevante sin convertir - posible problema de landing. Probar concordancia exacta." },
        { term: "windmarhome", clicks: 20, cost: 27.99, cat: "kw_sin_conv", action: "revisar_landing", detail: "Variante sin espacio. 20 clics sin conversion. Verificar URL final activa." },
      ],
      winners: [
        { term: "windmar home", conv: 6, cpc: 1.43, match: "exacta", detail: "Principal termino de marca: 501 clics, 6 conv., $119.42 costo/conv." },
        { term: "windmar", conv: 2, cpc: 1.28, match: "exacta", detail: "2 conversiones a $1.28 CPC. Variante corta con buen rendimiento." },
        { term: "windmar puerto rico", conv: 3, cpc: 1.44, match: "exacta", detail: "3 conversiones, $38.85 costo/conv. Uno de los mejores terminos branded." },
        { term: "windmar solar", conv: 1, cpc: 1.78, match: "exacta", detail: "1 conversion. Variante solar de marca, potencial para exacta adicional." },
      ],
    },
    GENERIC: {
      id: "GENERIC",
      name: "WH PR - Search - GENERIC",
      status: "critical",
      keywords: 47,
      alerts: 20,
      suggestions: 22,
      qs: 6.2,
      lowQsKeywords: 18,
      winnersCount: 5,
      reviewCount: 85,
      wasteCount: 140,
      wasteAmount: 1436,
      impressions: 486927,
      clicks: 10307,
      ctr: 2.12,
      cpc: 1.11,
      cost: 11488,
      conversions: 47,
      convRate: 0.46,
      costPerConv: 244.43,
      wasteTerms: [
        { term: "luma (todas las variantes)", clicks: 147, cost: 543, cat: "competencia", action: "negativa", detail: "11 variantes detectadas: luma, miluma, lumapr, luma energy, www luma pr com, mi luma pr, entre otras. Son busquedas de la electrica publica de PR, no intent de compra. A un ritmo mensual equivale a ~$180/mes quemados solo en LUMA." },
        { term: "placas solares puerto rico", clicks: 53, cost: 184, cat: "kw_sin_conv", action: "pausar", detail: "Tres concordancias distintas (amplia, frase, exacta) acumularon $184 en 90 dias con cero conversiones. La variante con preposicion ('placas solares en puerto rico') si convierte. Pausar las tres y mantener solo la que convierte." },
        { term: "generador solar 3000w", clicks: 48, cost: 43, cat: "irrelevante", action: "negativa", detail: "Busquedas de generadores solares portatiles que no corresponden al servicio de instalacion residencial." },
        { term: "sunnova puerto rico", clicks: 23, cost: 49, cat: "competencia", action: "negativa", detail: "Busquedas de marca del principal competidor. Agregar como negativa." },
        { term: "wilmar solar", clicks: 13, cost: 48, cat: "marca_mal_escrita", action: "negativa", detail: "Variacion mal escrita de Windmar Solar - 13 clics, $47.98 gastados, 0 conversiones." },
        { term: "nuevaenergia pr gov", clicks: 4, cost: 31, cat: "informativo", action: "negativa", detail: "Portal oficial del gobierno de PR sobre incentivos. Los usuarios buscan informacion oficial, no comprando." },
        { term: "sunstrong management", clicks: 11, cost: 29, cat: "competencia", action: "negativa", detail: "Competidor - busqueda de marca ajena." },
        { term: "compañias de electricidad pr", clicks: 4, cost: 25, cat: "informativo", action: "negativa", detail: "Busqueda informativa, no transaccional." },
      ],
      winners: [
        { term: "placas solares", conv: 2, cpc: 3.84, match: "exacta", detail: "52 clics, 2 conv a $99.72 costo/conv. Principal keyword generica." },
        { term: "placas solares en puerto rico", conv: 1, cpc: 22.05, match: "exacta (variante cercana)", detail: "1 conv de alto valor a $88.22. CPC alto pero convierte - validar landing." },
        { term: "solar panel companies", conv: 1, cpc: 57.78, match: "amplia", detail: "1 conv a $57.78 - termino en ingles con intent directo de compra." },
        { term: "instalacion paneles solares", conv: 2, cpc: 8.20, match: "exacta", detail: "2 conversiones con costo promedio de $11. Termino consistente con intent directo." },
        { term: "solar panels puerto rico", conv: 3, cpc: 9.50, match: "exacta", detail: "3 conversiones sumando variantes. Termino core para estrategia en ingles." },
      ],
    },
    ROOFING: {
      id: "ROOFING",
      name: "WH_PR_ROOFING-GENERAL_SEARCH",
      status: "ok",
      keywords: 46,
      alerts: 5,
      suggestions: 7,
      qs: 6.8,
      lowQsKeywords: 8,
      winnersCount: 7,
      reviewCount: 38,
      wasteCount: 52,
      wasteAmount: 67,
      impressions: 116256,
      clicks: 2994,
      ctr: 2.58,
      cpc: 1.11,
      cost: 3335.85,
      conversions: 88.67,
      convRate: 2.96,
      costPerConv: 37.62,
      wasteTerms: [
        { term: "roofing company near me", clicks: 18, cost: 15.98, cat: "fuera_de_area", action: "ajuste_geo", detail: "18 clics en terminos 'near me' posiblemente fuera de PR. Revisar geo-targeting." },
        { term: "roofing company cerca de mi", clicks: 3, cost: 15.03, cat: "fuera_de_area", action: "ajuste_geo", detail: "3 clics sin conversion. Variante en espanol del mismo problema geografico." },
      ],
      winners: [
        { term: "selladores de techo", conv: 5, cpc: 3.37, match: "exacta", detail: "61 clics, 5 conv a $41.07 costo/conv. Mejor performer de la campana." },
        { term: "sellado de techo", conv: 3, cpc: 2.52, match: "exacta", detail: "42 clics, 3 conv a $35.24. Excelente ROI - keyword core." },
        { term: "sellado de techo puerto rico", conv: 2, cpc: 4.47, match: "exacta", detail: "21 clics, 2 conv a $46.97. Variante local con buen rendimiento." },
        { term: "roofing contractor cerca de mi", conv: 3, cpc: 1.85, match: "frase", detail: "29 clics, 3 conv a $17.93 - mejor CPA de la campana." },
        { term: "tratamiento de techo", conv: 1, cpc: 4.66, match: "exacta", detail: "9 clics, 1 conv a $41.98. Termino tecnico con buena intencion de compra." },
        { term: "selladores de techo puerto rico", conv: 2, cpc: 3.40, match: "exacta", detail: "12 clics, 2 conv a $20.40. Variante local con CPA excelente." },
        { term: "estimados de techos", conv: 1, cpc: 7.86, match: "amplia", detail: "3 clics, 1 conv a $23.58. Alto valor por conversion." },
      ],
    },
  },
  adQuality: {
    verificationStatus: "in_progress",
    verificationAffected: 3,
    assetsRejected: 5,
    assetsPending: 8,
    rsaStrength: { excellent: 0, good: 6, average: 1, poor: 0 },
    landingPageIssues: [
      { page: "/solar-residencial", issue: "Velocidad movil baja (LCP 3.8s)", severity: "alta" },
      { page: "/incentivos", issue: "Falta consistencia con copy del anuncio", severity: "media" },
      { page: "/instalacion", issue: "CTA no visible sin scroll en movil", severity: "media" },
    ],
  },
  competitors: [
    { name: "Windmar Home", isUs: true, imprShare: 25, topPage: 82, orgTraffic: "12.4K", threat: "—", notes: "25.10% impression share, 81.82% top-of-page rate segun Auction Insights Apr 2026." },
    { name: "powersolarpr.com", isUs: false, imprShare: 20, topPage: 83, orgTraffic: "", threat: "alta", notes: "19.80% IS - competidor mas agresivo en GENERIC. 43.05% overlap rate. Mayor amenaza actual." },
    { name: "ecoflowpr.com", isUs: false, imprShare: 12, topPage: 88, orgTraffic: "", threat: "alta", notes: "11.57% IS con 88.06% top-of-page rate. Posicion agresiva aunque IS menor." },
    { name: "planetsolarpr.net", isUs: false, imprShare: 9, topPage: 84, orgTraffic: "", threat: "media", notes: "< 10% IS pero 84.25% top-of-page rate - bien posicionados en parte alta." },
    { name: "juapienergy.com", isUs: false, imprShare: 8, topPage: 79, orgTraffic: "", threat: "media", notes: "< 10% IS, 38.07% outranking share. Competidor emergente." },
    { name: "prosolarpuertorico.com", isUs: false, imprShare: 7, topPage: 70, orgTraffic: "", threat: "media", notes: "< 10% IS pero 51.38% outranking share - nos supera en posicion con frecuencia." },
    { name: "universalsolarpro.com", isUs: false, imprShare: 6, topPage: 89, orgTraffic: "", threat: "media", notes: "< 10% IS pero 89.25% top-of-page rate (mayor que nosotros). Alta visibilidad premium." },
    { name: "mundosolarenergy.com", isUs: false, imprShare: 5, topPage: 74, orgTraffic: "", threat: "baja", notes: "< 10% IS, 38.39% outranking share." },
    { name: "hybridenergypr.com", isUs: false, imprShare: 4, topPage: 72, orgTraffic: "", threat: "baja", notes: "< 10% IS, 29.90% outranking share." },
    { name: "bestpowerhome.com", isUs: false, imprShare: 4, topPage: 70, orgTraffic: "", threat: "baja", notes: "< 10% IS, 30.65% outranking share." },
    { name: "mescorp-pr.com", isUs: false, imprShare: 3, topPage: 58, orgTraffic: "", threat: "baja", notes: "< 10% IS pero 39.10% outranking share. Monitorear crecimiento." },
  ],
  weeklyActions: [
    { id: "w1", priority: "critico", title: "Agregar negativas familia LUMA a nivel campana GENERIC", impact: "Recupera ~$180/mes", campaign: "GENERIC", detail: "La familia de keywords LUMA esta consumiendo ~$180/mes sin generar conversiones. Agregar como negativas de frase: [luma], [miluma], [lumapr], \"luma pr\", \"luma energy\", \"www luma\", \"lumapr com\", \"mi luma\", \"nuevaenergia\"." },
    { id: "w2", priority: "critico", title: "Pausar las 3 variantes de 'placas solares puerto rico' sin conv.", impact: "Recupera ~$61/mes", campaign: "GENERIC", detail: "Tres concordancias acumularon $184 sin conversiones. Mantener solo [placas solares en puerto rico]. Pausar en Palabras Clave filtrando por 'placas solares puerto rico' sin la preposicion 'en'." },
    { id: "w3", priority: "alta", title: "Activar CPA objetivo en campana ROOFING", impact: "Optimiza 88 conv/trim - proyecta +20% eficiencia", campaign: "ROOFING", detail: "ROOFING usa 'Maximizar conversiones' sin CPA objetivo. Con 88.67 conv a $37.62 CPA, fijar CPA objetivo de $45 permitira a Smart Bidding optimizar sin exceder ROI." },
    { id: "w4", priority: "alta", title: "Negativas: wilmar solar, sunnova, sunstrong, generador solar", impact: "Recupera ~$170/mes", campaign: "GENERIC", detail: "Agregar como negativas: \"generador solar\", \"solar generator\", \"generator\", \"sunnova\", \"sunstrong\", \"anker solix\", \"wilmar solar\"." },
    { id: "w5", priority: "alta", title: "Completar verificacion del anunciante en Google Ads", impact: "Desbloquea hasta 13 assets pendientes/rechazados", campaign: "ALL", detail: "Documentos enviados el 16 abr 2026, verificacion en progreso. Seguimiento en ads.google.com/aw/policy/account." },
    { id: "w6", priority: "media", title: "Agregar 5 keywords ganadoras en concordancia exacta a GENERIC", impact: "+4-8 conv/mes estimadas", campaign: "GENERIC", detail: "Agregar en exacta: [placas solares], [placas solares en puerto rico], [solar panel companies], [instalacion paneles solares], [solar panels puerto rico]." },
    { id: "w7", priority: "media", title: "Revisar geo-targeting ROOFING: excluir trafico fuera de PR", impact: "Elimina ~$31/mes en clics fuera de area", campaign: "ROOFING", detail: "Terminos 'near me' y 'cerca de mi' ($31, 21 clics) posiblemente fuera de PR. Ir a Campanas > Configuracion > Ubicaciones > Excluir area fuera de PR." },
    { id: "w8", priority: "baja", title: "Mejorar cobertura BRAND: agregar keywords roofing a campana correcta", impact: "Redirige ~$49 malgastados", campaign: "BRAND", detail: "BRAND esta capturando 'windmar roofing' (34 clics, $49) pero la landing es de solar. Mover esa keyword a ROOFING o crear landing especifica." },
  ],
  history: [
    { week: "Sem 17", winnersAdded: 4, negativesAdded: 0, wasteRecovered: 0, avgQs: 7.1, notes: "Actualizacion sem 17. 90 dias (22 ene-21 abr 2026). ROOFING lidera: 88.67 conv, $37.62 CPA. GENERIC critico: $244 CPA. BRAND estable: 65 conv, $73. Competidores: powersolarpr.com y ecoflowpr.com son mayores amenazas." },
    { week: "Sem 16", winnersAdded: 0, negativesAdded: 0, wasteRecovered: 0, avgQs: 6.8, notes: "Baseline · identificados terminos LUMA como principal problema." },
    { week: "Sem 15", winnersAdded: 0, negativesAdded: 0, wasteRecovered: 0, avgQs: 6.7, notes: "Pico de gasto en terminos irrelevantes · sin optimizaciones aplicadas." },
    { week: "Sem 14", winnersAdded: 0, negativesAdded: 0, wasteRecovered: 0, avgQs: 6.9, notes: "Inicio del analisis de search terms report." },
  ],
};

// ============================================================
// TOKENS
// ============================================================
const C = {
  bg: "#0F0F10",
  sidebar: "#0A0A0B",
  surface: "#18181B",
  surfaceHover: "#1F1F23",
  surfaceElevated: "#212126",
  border: "rgba(255, 255, 255, 0.06)",
  borderStrong: "rgba(255, 255, 255, 0.1)",
  text: "#FAFAFA",
  textMuted: "#A1A1AA",
  textFaint: "#52525B",
  accent: "#FF6B2C",
  accentDim: "#FF6B2C20",
  accentSoft: "#FF6B2C10",
  green: "#4ADE80",
  red: "#F87171",
  amber: "#FBBF24",
  blue: "#60A5FA",
  purple: "#C084FC",
};

const statusColor = { ok: C.green, warning: C.amber, critical: C.red };
const priorityColor = { crítico: C.red, alta: C.green, media: C.amber, baja: C.blue };

// ============================================================
// ICONOS
// ============================================================
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    campaigns: <><path d="M4 19V5l8 5 8-5v14" /><path d="M4 5h16" /></>,
    keywords: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>,
    terms: <><path d="M4 6h16M4 12h16M4 18h10" /></>,
    competencia: <><path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" /></>,
    plan: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    historico: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>,
    chevron: <><path d="M9 18l6-6-6-6" /></>,
    chevronDown: <><path d="M6 9l6 6 6-6" /></>,
    up: <><path d="M7 14l5-5 5 5" /></>,
    down: <><path d="M7 10l5 5 5-5" /></>,
    check: <><path d="M20 6L9 17l-5-5" /></>,
    refresh: <><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0115-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 01-15 6.7L3 16" /></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    trending: <><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    sparkle: <><path d="M12 3l1.9 5.8L20 10l-6.1 2.2L12 18l-1.9-5.8L4 10l6.1-1.2L12 3z" /></>,
    minus: <><path d="M5 12h14" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ============================================================
// COMPONENTES BASE
// ============================================================
const Card = ({ children, style = {}, onClick, hover = false }) => (
  <div
    onClick={onClick}
    style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 24,
      cursor: onClick ? "pointer" : "default",
      transition: "background 0.15s, border-color 0.15s",
      ...style,
    }}
    onMouseEnter={(e) => {
      if (hover || onClick) {
        e.currentTarget.style.background = C.surfaceHover;
        e.currentTarget.style.borderColor = C.borderStrong;
      }
    }}
    onMouseLeave={(e) => {
      if (hover || onClick) {
        e.currentTarget.style.background = C.surface;
        e.currentTarget.style.borderColor = C.border;
      }
    }}
  >
    {children}
  </div>
);

const MetricCard = ({ icon, iconColor, label, value, sublabel }) => (
  <Card>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${iconColor}20`,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={16} />
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>{label}</div>
    </div>
    <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.6, color: C.text, marginBottom: 4 }}>{value}</div>
    {sublabel && <div style={{ fontSize: 11, color: C.textFaint }}>{sublabel}</div>}
  </Card>
);

const ExpandableCard = ({ title, subtitle, children, defaultOpen = false, badge, badgeColor, dense = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 10,
        transition: "border-color 0.15s",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: dense ? "14px 18px" : "18px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <div style={{ fontSize: dense ? 13 : 14, fontWeight: 500, color: C.text }}>{title}</div>
            {badge && (
              <span
                style={{
                  fontSize: 10,
                  color: badgeColor || C.textMuted,
                  background: `${badgeColor || C.textMuted}15`,
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && <div style={{ fontSize: 12, color: C.textMuted }}>{subtitle}</div>}
        </div>
        <div
          style={{
            color: C.textMuted,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <Icon name="chevron" size={16} />
        </div>
      </div>
      {open && (
        <div
          style={{
            padding: dense ? "4px 18px 18px" : "4px 22px 22px",
            borderTop: `1px solid ${C.border}`,
            paddingTop: 16,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const Sparkline = ({ data, color = C.accent, height = 40, width = 120 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      <polygon fill={`url(#grad-${color.replace("#", "")})`} points={`0,${height} ${points} ${width},${height}`} />
    </svg>
  );
};

// ============================================================
// SIDEBAR
// ============================================================
const Sidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: "overview", label: "Overview", icon: "overview" },
    { id: "campaigns", label: "Campañas", icon: "campaigns" },
    { id: "keywords", label: "Keywords", icon: "keywords" },
    { id: "terms", label: "Términos", icon: "terms" },
    { id: "quality", label: "Calidad de anuncios", icon: "shield" },
    { id: "competencia", label: "Competencia", icon: "competencia" },
    { id: "plan", label: "Plan", icon: "plan" },
    { id: "historico", label: "Histórico", icon: "historico" },
  ];

  return (
    <nav
      style={{
        width: 240,
        minHeight: "100vh",
        background: C.sidebar,
        borderRight: `1px solid ${C.border}`,
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, padding: "0 8px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: C.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
            color: "#fff",
          }}
        >
          W
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, letterSpacing: -0.2 }}>Windmar</div>
          <div style={{ fontSize: 10, color: C.textFaint, letterSpacing: 0.3 }}>MARKETING INTEL</div>
        </div>
      </div>

      <div
        style={{
          fontSize: 10,
          color: C.textFaint,
          letterSpacing: 1.5,
          fontWeight: 500,
          padding: "0 12px",
          marginBottom: 10,
        }}
      >
        MENU PRINCIPAL
      </div>

      {sections.map((s) => {
        const active = activeSection === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              marginBottom: 2,
              borderRadius: 10,
              background: active ? C.accent : "transparent",
              color: active ? "#fff" : C.textMuted,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: active ? 500 : 400,
              fontFamily: "inherit",
              transition: "all 0.15s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = C.surfaceHover;
                e.currentTarget.style.color = C.text;
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = C.textMuted;
              }
            }}
          >
            <Icon name={s.icon} size={16} />
            {s.label}
          </button>
        );
      })}

      <div style={{ marginTop: "auto", padding: "16px 12px 0", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 4 }}>Última sync</div>
        <div style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{DATA.lastUpdate}</div>
      </div>
    </nav>
  );
};

// ============================================================
// HEADERS Y COMPONENTES COMPARTIDOS
// ============================================================
const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, gap: 24, flexWrap: "wrap" }}>
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 6px", letterSpacing: -0.6, color: C.text }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 14, color: C.textMuted, margin: 0 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const RefreshButton = () => (
  <button
    onClick={() =>
      alert(
        'Envía este prompt a Claude cada semana:\n\n"Actualiza el dashboard con los datos más recientes de Google Ads: términos de búsqueda, keywords activas y Auction Insights de las 3 campañas (BRAND, GENERIC, ROOFING)."'
      )
    }
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: C.accent,
      border: "none",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: 10,
      fontSize: 13,
      cursor: "pointer",
      fontWeight: 500,
      fontFamily: "inherit",
    }}
  >
    <Icon name="refresh" size={14} />
    Actualizar
  </button>
);

const CampaignPills = ({ active, onChange }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
    {Object.values(DATA.campaigns).map((cp) => (
      <button
        key={cp.id}
        onClick={() => onChange(cp.id)}
        style={{
          background: active === cp.id ? C.accent : C.surface,
          border: `1px solid ${active === cp.id ? C.accent : C.border}`,
          color: active === cp.id ? "#fff" : C.textMuted,
          padding: "8px 16px",
          borderRadius: 10,
          fontSize: 12,
          cursor: "pointer",
          fontWeight: 500,
          fontFamily: "inherit",
          letterSpacing: 0.3,
          transition: "all 0.15s",
        }}
      >
        {cp.id}
      </button>
    ))}
  </div>
);

// ============================================================
// OVERVIEW — Resumen ejecutivo + métricas + top hallazgos
// ============================================================
const OverviewSection = () => {
  const s = DATA.executiveSummary;

  return (
    <div>
      <SectionHeader
        title="¡Buen día, Julian!"
        subtitle="Resumen ejecutivo del análisis de calidad de keywords y anuncios"
        action={<RefreshButton />}
      />

      {/* Executive summary banner */}
      <Card style={{ marginBottom: 28, background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surfaceElevated} 100%)`, border: `1px solid ${C.borderStrong}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon name="sparkle" size={14} color={C.accent} />
          <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1.5, fontWeight: 600, textTransform: "uppercase" }}>
            Resumen ejecutivo
          </div>
        </div>
        <div style={{ fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 20 }}>
          Se analizaron <span style={{ color: C.accent, fontWeight: 600 }}>{DATA.totalTerms.toLocaleString()} términos de búsqueda</span> en 90 días.
          El análisis detecta <span style={{ color: C.green, fontWeight: 600 }}>{s.totalWinners} oportunidades</span> para agregar como keyword
          y <span style={{ color: C.red, fontWeight: 600 }}>${s.wasteAmount.toLocaleString()} en desperdicio</span> por términos irrelevantes, de competidores y mal calibrados.
          Las optimizaciones sugeridas podrían recuperar{" "}
          <span style={{ color: C.accent, fontWeight: 600 }}>~${s.potentialRecovery}/mes</span> y sumar{" "}
          <span style={{ color: C.accent, fontWeight: 600 }}>{s.potentialConversions} conversiones adicionales/mes</span>.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Costo por conversión actual</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: C.red }}>${s.currentCostPerConv.toFixed(0)}</span>
              <span style={{ fontSize: 12, color: C.textFaint }}>→</span>
              <span style={{ fontSize: 22, fontWeight: 600, color: C.green }}>${s.projectedCostPerConv}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Tasa de conversión</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: C.red }}>{s.currentConvRate}%</span>
              <span style={{ fontSize: 12, color: C.textFaint }}>→</span>
              <span style={{ fontSize: 22, fontWeight: 600, color: C.green }}>{s.projectedConvRate}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Recuperación estimada</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.accent }}>+${s.potentialRecovery}/mes</div>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <MetricCard icon="keywords" iconColor={C.accent} label="Términos analizados" value={DATA.totalTerms.toLocaleString()} sublabel="Últimos 90 días" />
        <MetricCard icon="trending" iconColor={C.green} label="Ganadores detectados" value={s.totalWinners} sublabel="Agregar como keyword" />
        <MetricCard icon="alert" iconColor={C.red} label="Desperdicio identificado" value={s.totalWaste} sublabel={`$${s.wasteAmount.toLocaleString()} en 90 días`} />
        <MetricCard icon="target" iconColor={C.amber} label="Conv. potenciales" value={`+${s.potentialConversions}`} sublabel="Por mes estimado" />
      </div>

      {/* Top hallazgos */}
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12, fontWeight: 500 }}>Top hallazgos</div>

      <ExpandableCard
        title="Familia LUMA: la mayor hemorragia del presupuesto"
        subtitle="11 variantes · 147 clics · $543 en 90 días · 0 conversiones"
        badge="CRÍTICO"
        badgeColor={C.red}
        defaultOpen
      >
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
          La campaña GENERIC está pagando por búsquedas de LUMA Energy (la eléctrica pública de Puerto Rico).
          Se detectaron 11 variantes activas: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text }}>luma, miluma, lumapr, luma energy, www luma pr com, mi luma pr</span>, entre otras.
          Son búsquedas informativas, no compra. A ritmo mensual equivale a <span style={{ color: C.red, fontWeight: 500 }}>~$180/mes quemados</span>.
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>
          <span style={{ color: C.text, fontWeight: 500 }}>Acción sugerida:</span> agregar como negativas de frase a nivel campaña.
        </div>
      </ExpandableCard>

      <ExpandableCard
        title="7 términos ganadores listos para agregar"
        subtitle="Costo por conversión entre $1.77 y $15.41 · mejor ROI del período"
        badge="OPORTUNIDAD"
        badgeColor={C.green}
      >
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
          Términos con mejor costo por conversión del análisis. El promedio actual de la campaña es $210 por conversión — estos están entre $1.77 y $15.41.
          Agregarlos en concordancia exacta daría control del tráfico y mejoraría el Quality Score.
        </div>
        <div style={{ fontSize: 12 }}>
          <div style={{ color: C.text, fontWeight: 500, marginBottom: 8 }}>Top 3:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", color: C.textMuted }}>
              <span>incentivos placas solares puerto rico</span>
              <span style={{ color: C.green }}>$1.77</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", color: C.textMuted }}>
              <span>solar panel installer</span>
              <span style={{ color: C.green }}>$2.94</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", color: C.textMuted }}>
              <span>instaladores paneles solares</span>
              <span style={{ color: C.green }}>$3.57</span>
            </div>
          </div>
        </div>
      </ExpandableCard>

      <ExpandableCard
        title="3 variantes duplicadas consumiendo $184 sin convertir"
        subtitle="'placas solares puerto rico' en amplia + frase + exacta"
        badge="REVISAR"
        badgeColor={C.amber}
      >
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
          La misma keyword está activa en 3 concordancias distintas sumando <span style={{ color: C.red, fontWeight: 500 }}>$184 sin conversiones</span>.
          Curiosamente, la variante con preposición <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text }}>placas solares en puerto rico</span> sí convierte ($88/conv).
          Recomendación: pausar las 3 sin "en" y mantener solo la que convierte, o crear landing específica con CTA más directo.
        </div>
      </ExpandableCard>

      <ExpandableCard
        title="Verificación del anunciante bloqueando 4 campañas"
        subtitle="7 assets rechazados · 12 pendientes de aprobación"
        badge="CRÍTICO"
        badgeColor={C.red}
      >
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
          La verificación pendiente está bloqueando la aprobación de assets (anuncios, enlaces de sitio, imágenes) en 4 campañas.
          Completar en <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text }}>ads.google.com/aw/identity/verification</span> con documentación legal.
        </div>
      </ExpandableCard>

      <ExpandableCard
        title="18 keywords con Quality Score ≤ 4 en GENERIC"
        subtitle="CPC inflado · peor posición · landing con problemas"
        badge="REVISAR"
        badgeColor={C.amber}
      >
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
          Quality Score bajo infla el CPC y empeora la posición. 3 landing pages detectadas con issues:
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text }}> /solar-residencial</span> (LCP 3.8s móvil),
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text }}> /incentivos</span> (falta consistencia con copy),
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text }}> /instalacion</span> (CTA no visible en móvil).
        </div>
      </ExpandableCard>
    </div>
  );
};

// ============================================================
// CAMPAIGNS
// ============================================================
const CampaignsSection = () => (
  <div>
    <SectionHeader
      title="Campañas"
      subtitle="Vista detallada de las 3 campañas activas en Puerto Rico"
      action={<RefreshButton />}
    />
    {Object.values(DATA.campaigns).map((cp) => (
      <ExpandableCard
        key={cp.id}
        title={cp.id}
        subtitle={cp.name}
        badge={cp.status === "ok" ? "SALUDABLE" : cp.status === "warning" ? "REVISAR" : "CRÍTICO"}
        badgeColor={statusColor[cp.status]}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Keywords</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.text }}>{cp.keywords}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Alertas</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: cp.alerts > 10 ? C.red : cp.alerts > 3 ? C.amber : C.green }}>{cp.alerts}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" }}>QS promedio</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: cp.qs >= 7 ? C.green : cp.qs >= 5 ? C.amber : C.red }}>{cp.qs.toFixed(1)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textFaint, letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" }}>Sugerencias</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.accent }}>{cp.suggestions}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div style={{ padding: "14px 16px", background: C.surfaceElevated, borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Ganadores</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.green }}>{cp.winnersCount}</div>
          </div>
          <div style={{ padding: "14px 16px", background: C.surfaceElevated, borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>A revisar</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.amber }}>{cp.reviewCount}</div>
          </div>
          <div style={{ padding: "14px 16px", background: C.surfaceElevated, borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Desperdicio</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.red }}>{cp.wasteCount}</div>
          </div>
        </div>
      </ExpandableCard>
    ))}
  </div>
);

// ============================================================
// KEYWORDS
// ============================================================
const KeywordsSection = () => {
  const [activeCampaign, setActiveCampaign] = useState("GENERIC");
  const [selected, setSelected] = useState(new Set());
  const c = DATA.campaigns[activeCampaign];

  const toggle = (t) => {
    const n = new Set(selected);
    if (n.has(t)) n.delete(t);
    else n.add(t);
    setSelected(n);
  };

  return (
    <div>
      <SectionHeader
        title="Keywords"
        subtitle="Gestión de keywords activas, ganadoras para agregar y negativas sugeridas"
        action={<RefreshButton />}
      />

      <CampaignPills active={activeCampaign} onChange={setActiveCampaign} />

      <ExpandableCard
        title="Términos ganadores"
        subtitle={`${c.winners.length} términos listos para agregar como keyword`}
        badge="AGREGAR"
        badgeColor={C.green}
        defaultOpen
      >
        {c.winners.map((w, i) => {
          const isSelected = selected.has(w.term);
          return (
            <div
              key={i}
              onClick={() => toggle(w.term)}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto auto",
                gap: 20,
                padding: "14px 12px",
                margin: "0 -12px",
                borderRadius: 8,
                cursor: "pointer",
                alignItems: "center",
                background: isSelected ? C.accentSoft : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = C.surfaceHover;
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `1.5px solid ${isSelected ? C.accent : C.textFaint}`,
                  background: isSelected ? C.accent : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && <Icon name="check" size={10} color="#fff" />}
              </div>
              <div style={{ fontSize: 13, color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>{w.term}</div>
              <div style={{ fontSize: 11, color: C.textMuted, minWidth: 50 }}>{w.match}</div>
              <div style={{ fontSize: 12, color: C.textMuted, minWidth: 70, textAlign: "right" }}>{w.conv} conv.</div>
              <div style={{ fontSize: 13, color: C.green, fontFamily: "'JetBrains Mono', monospace", minWidth: 60, textAlign: "right" }}>
                ${w.cpc.toFixed(2)}
              </div>
            </div>
          );
        })}
        {selected.size > 0 && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: C.text }}>
              {selected.size} seleccionada{selected.size > 1 ? "s" : ""}
            </div>
            <button
              onClick={() => alert(`Prompt para Claude:\n\n"Genera el CSV bulk upload de Google Ads Editor para estas ${selected.size} keywords:\n${Array.from(selected).join("\n")}"`)}
              style={{
                background: C.accent,
                border: "none",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            >
              Exportar a Ads Editor
            </button>
          </div>
        )}
      </ExpandableCard>

      <ExpandableCard
        title="Keywords activas sin conversiones"
        subtitle={`${c.lowQsKeywords} keywords con QS bajo en esta campaña`}
        badge="PAUSAR"
        badgeColor={C.amber}
      >
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
          Hay <span style={{ color: C.text, fontWeight: 500 }}>{c.lowQsKeywords} keywords</span> activas con Quality Score ≤ 4 y sin conversiones en 90 días.
          La más costosa es <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text }}>placas solares puerto rico</span> en 3 concordancias distintas,
          acumulando <span style={{ color: C.red, fontWeight: 500 }}>$184 sin retorno</span>.
        </div>
      </ExpandableCard>

      <ExpandableCard
        title="Negativas sugeridas"
        subtitle={`${c.wasteTerms.length} términos para agregar como negativa`}
        badge="NEGATIVAS"
        badgeColor={C.red}
      >
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
          Términos que consumieron presupuesto sin convertir. Ve a la pestaña <span style={{ color: C.accent }}>Términos</span> para el detalle completo.
        </div>
      </ExpandableCard>
    </div>
  );
};

// ============================================================
// TERMS
// ============================================================
const TermsSection = () => {
  const [activeCampaign, setActiveCampaign] = useState("GENERIC");
  const c = DATA.campaigns[activeCampaign];

  return (
    <div>
      <SectionHeader
        title="Términos de búsqueda"
        subtitle="Análisis de los términos reales que dispararon anuncios"
        action={<RefreshButton />}
      />

      <CampaignPills active={activeCampaign} onChange={setActiveCampaign} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>Ganadores</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.green, letterSpacing: -0.8 }}>{c.winnersCount}</div>
          <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>Agregar como keyword</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>A revisar</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.amber, letterSpacing: -0.8 }}>{c.reviewCount}</div>
          <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>Potencial, validar</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>Desperdicio</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.red, letterSpacing: -0.8 }}>{c.wasteCount}</div>
          <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>Agregar como negativa</div>
        </Card>
      </div>

      <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 500, marginBottom: 12, marginTop: 32 }}>
        Top desperdicio de presupuesto
      </div>
      {c.wasteTerms.map((t, i) => (
        <ExpandableCard
          key={i}
          title={t.term}
          subtitle={`${t.clicks} clics · ${t.cat}`}
          badge={`−$${t.cost.toFixed(0)}`}
          badgeColor={C.red}
          dense
        >
          <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
            {t.detail}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                background: C.red,
                border: "none",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            >
              {t.action === "negativa" ? "Agregar como negativa" : t.action === "pausar" ? "Pausar keyword" : t.action === "ajuste_geo" ? "Ajustar geo" : "Revisar"}
            </button>
            <button
              style={{
                background: "transparent",
                border: `1px solid ${C.borderStrong}`,
                color: C.text,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            >
              Ver contexto
            </button>
          </div>
        </ExpandableCard>
      ))}

      <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 500, marginBottom: 12, marginTop: 32 }}>
        Términos ganadores detectados
      </div>
      {c.winners.map((w, i) => (
        <ExpandableCard
          key={i}
          title={w.term}
          subtitle={`${w.conv} conv. · concordancia ${w.match}`}
          badge={`$${w.cpc.toFixed(2)}/conv`}
          badgeColor={C.green}
          dense
        >
          <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
            {w.detail}
          </div>
        </ExpandableCard>
      ))}
    </div>
  );
};

// ============================================================
// QUALITY — nueva sección
// ============================================================
const QualitySection = () => {
  const q = DATA.adQuality;
  return (
    <div>
      <SectionHeader
        title="Calidad de anuncios"
        subtitle="Estado de verificación, assets, RSA strength y landing pages"
        action={<RefreshButton />}
      />

      {/* Verification status */}
      <Card style={{ marginBottom: 16, border: `1px solid rgba(248, 113, 113, 0.3)`, background: `linear-gradient(135deg, ${C.surface} 0%, rgba(248, 113, 113, 0.04) 100%)` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: `${C.red}20`,
              color: C.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="shield" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Verificación del anunciante pendiente</div>
              <span style={{ fontSize: 10, color: C.red, background: `${C.red}15`, padding: "2px 8px", borderRadius: 999, fontWeight: 600, letterSpacing: 0.5 }}>CRÍTICO</span>
            </div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 12 }}>
              Bloquea aprobación de assets en {q.verificationAffected} campañas. Completar en{" "}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.text }}>ads.google.com/aw/identity/verification</span>.
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>Assets rechazados</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.red }}>{q.assetsRejected}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>Assets pendientes</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.amber }}>{q.assetsPending}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* QS distribution */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>Distribución de Quality Score</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Promedio ponderado por campaña</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.values(DATA.campaigns).map((cp) => {
            const barColor = cp.qs >= 7 ? C.green : cp.qs >= 5 ? C.amber : C.red;
            return (
              <div key={cp.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 50px 80px", gap: 16, alignItems: "center" }}>
                <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>{cp.id}</div>
                <div style={{ height: 8, background: C.surfaceElevated, borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(cp.qs / 10) * 100}%`,
                      background: barColor,
                      borderRadius: 999,
                    }}
                  />
                </div>
                <div style={{ fontSize: 14, color: barColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, textAlign: "right" }}>
                  {cp.qs.toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: C.textFaint, textAlign: "right" }}>
                  {cp.lowQsKeywords} con QS ≤ 4
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* RSA strength */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>RSA strength</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Estado de fuerza de los Responsive Search Ads</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <div style={{ padding: "14px 16px", background: C.surfaceElevated, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.green, marginBottom: 4 }}>{q.rsaStrength.excellent}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Excelente</div>
          </div>
          <div style={{ padding: "14px 16px", background: C.surfaceElevated, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.blue, marginBottom: 4 }}>{q.rsaStrength.good}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Bueno</div>
          </div>
          <div style={{ padding: "14px 16px", background: C.surfaceElevated, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.amber, marginBottom: 4 }}>{q.rsaStrength.average}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Promedio</div>
          </div>
          <div style={{ padding: "14px 16px", background: C.surfaceElevated, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.red, marginBottom: 4 }}>{q.rsaStrength.poor}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Pobre</div>
          </div>
        </div>
      </Card>

      {/* Landing page issues */}
      <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 500, marginBottom: 12, marginTop: 28 }}>
        Issues de landing pages
      </div>
      {q.landingPageIssues.map((issue, i) => (
        <ExpandableCard
          key={i}
          title={issue.page}
          subtitle={issue.issue}
          badge={issue.severity.toUpperCase()}
          badgeColor={issue.severity === "alta" ? C.red : issue.severity === "media" ? C.amber : C.blue}
          dense
        >
          <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
            Esta landing page tiene un issue que afecta el Quality Score de las keywords que apuntan aquí.
            La severidad es <span style={{ color: C.text }}>{issue.severity}</span> y debe resolverse para mejorar el rendimiento.
          </div>
        </ExpandableCard>
      ))}
    </div>
  );
};

// ============================================================
// COMPETENCIA — sección más compacta
// ============================================================
const CompetenciaSection = () => (
  <div>
    <SectionHeader
      title="Competencia"
      subtitle="Posicionamiento de Windmar en la subasta de Puerto Rico"
      action={<RefreshButton />}
    />

    <Card style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 24, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Tu impression share</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.accent, letterSpacing: -0.6 }}>34%</div>
        </div>
        <div style={{ width: 1, background: C.border }} />
        <div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Posición en ranking</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.text, letterSpacing: -0.6 }}>#2</div>
        </div>
        <div style={{ width: 1, background: C.border }} />
        <div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Gap con #1 (Sunnova)</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.red, letterSpacing: -0.6 }}>−7 pts</div>
        </div>
      </div>

      {/* Competitors bar chart */}
      {DATA.competitors.map((comp, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr 50px",
            gap: 14,
            padding: "9px 0",
            alignItems: "center",
            borderBottom: i < DATA.competitors.length - 1 ? `1px solid ${C.border}` : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {comp.isUs && <span style={{ color: C.accent, fontSize: 14 }}>▸</span>}
            <span style={{ fontSize: 12, color: comp.isUs ? C.accent : C.text, fontWeight: comp.isUs ? 600 : 400 }}>
              {comp.name}
            </span>
          </div>
          <div style={{ height: 8, background: C.surfaceElevated, borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${(comp.imprShare / 45) * 100}%`,
                background: comp.isUs ? C.accent : `${C.textMuted}40`,
                borderRadius: 999,
                transition: "width 0.3s",
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: comp.isUs ? C.accent : C.text, fontFamily: "'JetBrains Mono', monospace", textAlign: "right", fontWeight: comp.isUs ? 600 : 400 }}>
            {comp.imprShare}%
          </div>
        </div>
      ))}
    </Card>

    <div
      style={{
        padding: "18px 22px",
        background: `${C.accent}08`,
        border: `1px solid ${C.accent}30`,
        borderRadius: 12,
        fontSize: 13,
        color: C.textMuted,
        lineHeight: 1.7,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon name="sparkle" size={14} color={C.accent} />
        <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Insight</span>
      </div>
      Sunnova lidera la subasta con 7 pts más de impression share y 13 pts más en top of page. Es la principal amenaza en pagado.
      Los competidores locales (H&amp;H, Solar Roots, Planet Solar) tienen baja presencia pagada pero construyen autoridad orgánica —
      espacio para diferenciación por SEO y contenido local.
    </div>
  </div>
);

// ============================================================
// PLAN
// ============================================================
const PlanSection = ({ checklist, toggle }) => {
  const completed = DATA.weeklyActions.filter((a) => checklist[a.id]).length;
  return (
    <div>
      <SectionHeader
        title="Plan de acción"
        subtitle="Tareas priorizadas para la optimización de esta semana"
        action={<RefreshButton />}
      />

      <Card style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>Progreso semanal</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.text }}>
              {completed} <span style={{ color: C.textFaint, fontWeight: 400 }}>/ {DATA.weeklyActions.length}</span>
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: C.accent, letterSpacing: -1 }}>
            {Math.round((completed / DATA.weeklyActions.length) * 100)}%
          </div>
        </div>
        <div style={{ height: 8, background: C.surfaceElevated, borderRadius: 999, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(completed / DATA.weeklyActions.length) * 100}%`,
              background: C.accent,
              borderRadius: 999,
              transition: "width 0.3s",
            }}
          />
        </div>
      </Card>

      {DATA.weeklyActions.map((a) => {
        const done = checklist[a.id];
        return (
          <ExpandableCard
            key={a.id}
            title={a.title}
            subtitle={`${a.impact} · ${a.campaign}`}
            badge={a.priority.toUpperCase()}
            badgeColor={priorityColor[a.priority]}
          >
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, marginBottom: 16 }}>{a.detail}</div>
            <button
              onClick={() => toggle(a.id)}
              style={{
                background: done ? C.green : C.accent,
                border: "none",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {done ? (
                <>
                  <Icon name="check" size={12} /> Completado
                </>
              ) : (
                "Marcar completado"
              )}
            </button>
          </ExpandableCard>
        );
      })}
    </div>
  );
};

// ============================================================
// HISTÓRICO
// ============================================================
const HistoricoSection = () => (
  <div>
    <SectionHeader
      title="Histórico"
      subtitle="Evolución semanal de keywords optimizadas y Quality Score"
      action={<RefreshButton />}
    />

    <Card style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>Quality Score promedio</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Últimas 4 semanas</div>
      <Sparkline data={DATA.history.map((h) => h.avgQs)} color={C.accent} width={560} height={80} />
    </Card>

    <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 500, marginBottom: 12 }}>Detalle por semana</div>
    {DATA.history.map((h, i) => (
      <ExpandableCard
        key={i}
        title={h.week}
        subtitle={`QS promedio ${h.avgQs.toFixed(1)} · ${h.winnersAdded} ganadores agregados · ${h.negativesAdded} negativas`}
        badge={h.wasteRecovered > 0 ? `$${h.wasteRecovered} recuperados` : "Sin cambios"}
        badgeColor={h.wasteRecovered > 0 ? C.green : C.textMuted}
        dense
      >
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>{h.notes}</div>
      </ExpandableCard>
    ))}
  </div>
);

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [checklist, setChecklist] = useState({});

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("windmar-checklist-v5");
        if (saved) setChecklist(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const toggle = (id) => {
    const n = { ...checklist, [id]: !checklist[id] };
    setChecklist(n);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("windmar-checklist-v5", JSON.stringify(n));
      }
    } catch (e) {}
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main
        style={{
          flex: 1,
          padding: "32px 40px 80px",
          maxWidth: 1200,
          minWidth: 0,
        }}
      >
        {activeSection === "overview" && <OverviewSection />}
        {activeSection === "campaigns" && <CampaignsSection />}
        {activeSection === "keywords" && <KeywordsSection />}
        {activeSection === "terms" && <TermsSection />}
        {activeSection === "quality" && <QualitySection />}
        {activeSection === "competencia" && <CompetenciaSection />}
        {activeSection === "plan" && <PlanSection checklist={checklist} toggle={toggle} />}
        {activeSection === "historico" && <HistoricoSection />}
      </main>
    </div>
  );
}
