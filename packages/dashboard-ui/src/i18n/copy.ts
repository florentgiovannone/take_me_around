import type { DashboardLocale } from "@tma/config"

export type DashboardCopy = {
  eyebrow: string
  titleLiveBefore: string
  titleLiveAfter: string
  titleFallback: string
  signIn: string
  logOut: string
  restoring: string
  openingDemo: string
  unlock: string
  unlocking: string
  activity: string
  counts: string
  overview: string
  audience: string
  liveSessions: string
  loading: string
  errorPrefix: string
  dashboardViews: string
  totalEvents: string
  artworks: string
  latestScan: string
  updatesEvery5s: string
  liveActivity: string
  live: string
  logId: string
  artwork: string
  time: string
  type: string
  seen: string
  link: string
  pageSeen: string
  hideVisitDetails: string
  showVisitDetails: string
  tagUid: string
  device: string
  browser: string
  os: string
  language: string
  ipAddress: string
  userAgent: string
  totalScans: string
  activeLinks: string
  topLink: string
  noDataYet: string
  linkScanCounts: string
  android: string
  id: string
  totalTaps: string
  thisWeek: string
  activeTags: string
  linksTracked: (count: number) => string
  topTag: string
  tapsThisMonth: string
  avgPerTag: string
  tapsPerLink: string
  tapsOverTime: string
  timeRange: string
  weekly: string
  monthly: string
  previousWeek: string
  previousMonth: string
  nextWeek: string
  nextMonth: string
  upcoming: string
  tapDay: string
  hoverDay: string
  tapsCalendar: string
  totalTapsPerMonth: string
  totalTapsPerWeek: string
  noTapsInPeriod: string
  weekdays: readonly string[]
  devices: string
  mobile: string
  desktop: string
  tablet: string
  operatingSystem: string
  tapOs: string
  hoverOs: string
  browsers: string
  tapBrowser: string
  hoverBrowser: string
  tapLanguage: string
  hoverLanguage: string
  noDeviceData: string
  noBrowserData: string
  noLanguageData: string
  hourlyActivity: string
  dailyActivity: string
  hourlyAm: string
  hourlyPm: string
  tapBar: string
  hoverBar: string
  tapToSee: string
  hoverToSee: string
  liveSessionsHint: (domain: string) => string
  filterEventLog: string
  pasteSar: string
  filterLog: string
  sarsInLoad: (count: number) => string
  noSarActivity: (domain: string) => string
  sarUsers: string
  rowsOnTimeline: string
  nfcScans: string
  redirectedOn: (domain: string) => string
  allEvents: string
  scansAndVisits: string
  sessionTimeline: string
  eventLog: string
  clearFilter: string
  noSarActivityForFilter: (domain: string) => string
  visibleWindow: string
  past: string
  future: string
  zoomTimeline: string
  zoomIn: string
  zoomOut: string
  windowSuffix: string
  scrollTimeline: string
  scrollPast: string
  scrollFuture: string
  now: string
  timeAxis: string
  scanOrder: string
  clickColour: string
  older: string
  thirdLatest: string
  secondLatest: string
  latest: string
  noRecencyScan: (label: string) => string
  selectSessionFirst: string
  jumpToScan: (label: string) => string
  nfcScan: string
  pageVisit: string
  liveSessionsTimeline: string
  justNow: string
  minutesAgo: (n: number) => string
  hoursAgo: (n: number) => string
  daysAgo: (n: number) => string
  taps: (n: number) => string
  scans: (n: number) => string
  visits: (n: number) => string
  links: (n: number) => string
  visitsDotPercent: (countLabel: string, percent: number) => string
  trackedScansMeta: string
  trackedLinksMeta: (count: number) => string
  trackedScansAcrossMeta: string
  emptyActivity: string
  couldNotOpenDemo: string
}

const EN: DashboardCopy = {
  eyebrow: "Take Me Around · Analytics",
  titleLiveBefore: "Live",
  titleLiveAfter: "Dashboard",
  titleFallback: "Dashboard",
  signIn: "Sign in to continue",
  logOut: "Log out",
  restoring: "Restoring dashboard session...",
  openingDemo: "Opening TMA Demo...",
  unlock: "Unlock",
  unlocking: "Unlocking...",
  activity: "Activity",
  counts: "Link scan counts",
  overview: "Overview",
  audience: "Audience",
  liveSessions: "Live sessions",
  loading: "Loading poise_log entries...",
  errorPrefix: "Error:",
  dashboardViews: "Dashboard views",
  totalEvents: "Total Events",
  artworks: "Artworks",
  latestScan: "Latest Scan",
  updatesEvery5s: "updates every 5s",
  liveActivity: "Live Activity",
  live: "Live",
  logId: "Log ID",
  artwork: "Artwork",
  time: "Time",
  type: "Type",
  seen: "Seen?",
  link: "Link",
  pageSeen: "Page seen",
  hideVisitDetails: "Hide visit details",
  showVisitDetails: "Show visit details",
  tagUid: "Tag UID",
  device: "Device",
  browser: "Browser",
  os: "Operating system",
  language: "Language",
  ipAddress: "IP address",
  userAgent: "User agent",
  totalScans: "Total Scans",
  activeLinks: "Active Links",
  topLink: "Top Link",
  noDataYet: "no data yet",
  linkScanCounts: "Link Scan Counts",
  android: "Android",
  id: "ID",
  totalTaps: "Total Taps",
  thisWeek: "this week",
  activeTags: "Active Tags",
  linksTracked: (count) => `${count} links tracked`,
  topTag: "Top Tag",
  tapsThisMonth: "taps this month",
  avgPerTag: "Avg / Tag",
  tapsPerLink: "taps per link",
  tapsOverTime: "Taps Over Time",
  timeRange: "Time range",
  weekly: "Weekly",
  monthly: "Monthly",
  previousWeek: "Previous week",
  previousMonth: "Previous month",
  nextWeek: "Next week",
  nextMonth: "Next month",
  upcoming: "Upcoming",
  tapDay: "Tap a day to see tap counts",
  hoverDay: "Hover a day to see tap counts",
  tapsCalendar: "Taps over time calendar",
  totalTapsPerMonth: "Total taps per month",
  totalTapsPerWeek: "Total taps per week",
  noTapsInPeriod: "No taps in this period.",
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  devices: "Devices",
  mobile: "Mobile",
  desktop: "Desktop",
  tablet: "Tablet",
  operatingSystem: "Operating system",
  tapOs: "Tap an operating system to see visit counts",
  hoverOs: "Hover an operating system to see visit counts",
  browsers: "Browsers",
  tapBrowser: "Tap a browser to see visit counts",
  hoverBrowser: "Hover a browser to see visit counts",
  tapLanguage: "Tap a language to see visit counts",
  hoverLanguage: "Hover a language to see visit counts",
  noDeviceData: "No device data yet.",
  noBrowserData: "No browser data yet.",
  noLanguageData: "No language data yet.",
  hourlyActivity: "Hourly Activity",
  dailyActivity: "Daily Activity",
  hourlyAm: "Hourly activity, 12 AM to 11 AM",
  hourlyPm: "Hourly activity, 12 PM to 11 PM",
  tapBar: "Tap a bar to see tap counts",
  hoverBar: "Hover a bar to see tap counts",
  tapToSee: "Tap to see tap counts",
  hoverToSee: "Hover to see tap counts",
  liveSessionsHint: (domain) =>
    `Y-axis: each visitor session (SAR cookie when the page loads, otherwise the NFC tag ID). X-axis: time — past on the left, now in the centre, future on the right. Dots are tracked ${domain} events: dot colour shows scan recency (red = latest); square = NFC scan, circle = page visit. Scroll or use the hour buttons to move along the timeline. Click a SAR row to filter the event log below.`,
  filterEventLog: "Filter event log (optional)",
  pasteSar: "Paste SAR to filter log",
  filterLog: "Filter log",
  sarsInLoad: (count) =>
    `${count} SAR${count === 1 ? "" : "s"} in this load`,
  noSarActivity: (domain) =>
    `No SAR-linked ${domain} activity in this dashboard load yet.`,
  sarUsers: "SAR users",
  rowsOnTimeline: "rows on timeline",
  nfcScans: "NFC Scans",
  redirectedOn: (domain) => `REDIRECTED on ${domain}`,
  allEvents: "All events",
  scansAndVisits: "scans + page visits",
  sessionTimeline: "Session timeline",
  eventLog: "Event log —",
  clearFilter: "Clear filter",
  noSarActivityForFilter: (domain) =>
    `No tracked ${domain} activity for this SAR in the current load.`,
  visibleWindow: "Visible window",
  past: "← Past",
  future: "Future →",
  zoomTimeline: "Zoom timeline",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  windowSuffix: "window",
  scrollTimeline: "Scroll timeline",
  scrollPast: "Scroll to past",
  scrollFuture: "Scroll to future",
  now: "Now",
  timeAxis: "Time axis (GMT)",
  scanOrder: "Scan order (per user, past ← → now)",
  clickColour: "· click a colour to jump to that scan",
  older: "Older",
  thirdLatest: "3rd latest",
  secondLatest: "2nd latest",
  latest: "Latest",
  noRecencyScan: (label) => `No ${label.toLowerCase()} scan for this session`,
  selectSessionFirst: "Select a session on the timeline first",
  jumpToScan: (label) => `Jump to ${label.toLowerCase()} scan`,
  nfcScan: "NFC scan",
  pageVisit: "Page visit",
  liveSessionsTimeline: "Live sessions timeline",
  justNow: "Just now",
  minutesAgo: (n) => `${n}m ago`,
  hoursAgo: (n) => `${n}h ago`,
  daysAgo: (n) => `${n}d ago`,
  taps: (n) => `${n === 1 ? "1 tap" : `${n} taps`}`,
  scans: (n) => `${n === 1 ? "1 scan" : `${n} scans`}`,
  visits: (n) => `${n === 1 ? "1 visit" : `${n} visits`}`,
  links: (n) => `${n === 1 ? "1 link" : `${n} links`}`,
  visitsDotPercent: (countLabel, percent) => `${countLabel} · ${percent}%`,
  trackedScansMeta: "tracked TMA Demo scans",
  trackedLinksMeta: (count) => `of ${count} tracked TMA Demo tags`,
  trackedScansAcrossMeta: "across tracked TMA Demo tags",
  emptyActivity: "No tracked TMA Demo activity found.",
  couldNotOpenDemo:
    "Could not open TMA Demo. Set VITE_DASHBOARD_PASSWORD in apps/dashboard/.env to match the API.",
}

const PT_BR: DashboardCopy = {
  eyebrow: "Take Me Around · Análises",
  titleLiveBefore: "Painel ao vivo",
  titleLiveAfter: "",
  titleFallback: "Painel",
  signIn: "Entre para continuar",
  logOut: "Sair",
  restoring: "Restaurando a sessão do painel...",
  openingDemo: "Abrindo o TMA Demo...",
  unlock: "Desbloquear",
  unlocking: "Desbloqueando...",
  activity: "Atividade",
  counts: "Leituras por link",
  overview: "Visão geral",
  audience: "Público",
  liveSessions: "Sessões ao vivo",
  loading: "Carregando registros...",
  errorPrefix: "Erro:",
  dashboardViews: "Visões do painel",
  totalEvents: "Total de eventos",
  artworks: "Obras",
  latestScan: "Última leitura",
  updatesEvery5s: "atualiza a cada 5s",
  liveActivity: "Atividade ao vivo",
  live: "Ao vivo",
  logId: "ID do registro",
  artwork: "Obra",
  time: "Horário",
  type: "Tipo",
  seen: "Visto?",
  link: "Link",
  pageSeen: "Página vista",
  hideVisitDetails: "Ocultar detalhes da visita",
  showVisitDetails: "Mostrar detalhes da visita",
  tagUid: "UID da tag",
  device: "Dispositivo",
  browser: "Navegador",
  os: "Sistema operacional",
  language: "Idioma",
  ipAddress: "Endereço IP",
  userAgent: "Agente do usuário",
  totalScans: "Total de leituras",
  activeLinks: "Links ativos",
  topLink: "Link principal",
  noDataYet: "ainda sem dados",
  linkScanCounts: "Leituras por link",
  android: "Android",
  id: "ID",
  totalTaps: "Total de toques",
  thisWeek: "esta semana",
  activeTags: "Tags ativas",
  linksTracked: (count) =>
    count === 1 ? "1 link rastreado" : `${count} links rastreados`,
  topTag: "Tag principal",
  tapsThisMonth: "toques neste mês",
  avgPerTag: "Média / tag",
  tapsPerLink: "toques por link",
  tapsOverTime: "Toques ao longo do tempo",
  timeRange: "Período",
  weekly: "Semanal",
  monthly: "Mensal",
  previousWeek: "Semana anterior",
  previousMonth: "Mês anterior",
  nextWeek: "Próxima semana",
  nextMonth: "Próximo mês",
  upcoming: "Em breve",
  tapDay: "Toque em um dia para ver os toques",
  hoverDay: "Passe o cursor em um dia para ver os toques",
  tapsCalendar: "Calendário de toques",
  totalTapsPerMonth: "Total de toques por mês",
  totalTapsPerWeek: "Total de toques por semana",
  noTapsInPeriod: "Nenhum toque neste período.",
  weekdays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  devices: "Dispositivos",
  mobile: "Celular",
  desktop: "Computador",
  tablet: "Tablet",
  operatingSystem: "Sistema operacional",
  tapOs: "Toque em um sistema operacional para ver as visitas",
  hoverOs: "Passe o cursor em um sistema operacional para ver as visitas",
  browsers: "Navegadores",
  tapBrowser: "Toque em um navegador para ver as visitas",
  hoverBrowser: "Passe o cursor em um navegador para ver as visitas",
  tapLanguage: "Toque em um idioma para ver as visitas",
  hoverLanguage: "Passe o cursor em um idioma para ver as visitas",
  noDeviceData: "Ainda sem dados de dispositivo.",
  noBrowserData: "Ainda sem dados de navegador.",
  noLanguageData: "Ainda sem dados de idioma.",
  hourlyActivity: "Atividade por hora",
  dailyActivity: "Atividade diária",
  hourlyAm: "Atividade por hora, 0h às 11h",
  hourlyPm: "Atividade por hora, 12h às 23h",
  tapBar: "Toque em uma barra para ver os toques",
  hoverBar: "Passe o cursor em uma barra para ver os toques",
  tapToSee: "Toque para ver os toques",
  hoverToSee: "Passe o cursor para ver os toques",
  liveSessionsHint: (domain) =>
    `Eixo Y: cada sessão de visitante (cookie SAR quando a página carrega, ou o ID da tag NFC). Eixo X: tempo — passado à esquerda, agora no centro, futuro à direita. Os pontos são eventos rastreados de ${domain}: a cor mostra a recência da leitura (vermelho = mais recente); quadrado = leitura NFC, círculo = visita à página. Role ou use os botões de hora para mover a linha do tempo. Toque em uma linha SAR para filtrar o registro abaixo.`,
  filterEventLog: "Filtrar registro de eventos (opcional)",
  pasteSar: "Cole o SAR para filtrar o registro",
  filterLog: "Filtrar registro",
  sarsInLoad: (count) =>
    count === 1 ? "1 SAR nesta carga" : `${count} SARs nesta carga`,
  noSarActivity: (domain) =>
    `Ainda não há atividade de ${domain} ligada a SAR nesta carga do painel.`,
  sarUsers: "Usuários SAR",
  rowsOnTimeline: "linhas na linha do tempo",
  nfcScans: "Leituras NFC",
  redirectedOn: (domain) => `REDIRECTED em ${domain}`,
  allEvents: "Todos os eventos",
  scansAndVisits: "leituras + visitas à página",
  sessionTimeline: "Linha do tempo da sessão",
  eventLog: "Registro de eventos —",
  clearFilter: "Limpar filtro",
  noSarActivityForFilter: (domain) =>
    `Nenhuma atividade rastreada de ${domain} para este SAR na carga atual.`,
  visibleWindow: "Janela visível",
  past: "← Passado",
  future: "Futuro →",
  zoomTimeline: "Zoom da linha do tempo",
  zoomIn: "Aumentar zoom",
  zoomOut: "Diminuir zoom",
  windowSuffix: "janela",
  scrollTimeline: "Rolar a linha do tempo",
  scrollPast: "Rolar para o passado",
  scrollFuture: "Rolar para o futuro",
  now: "Agora",
  timeAxis: "Eixo do tempo (GMT)",
  scanOrder: "Ordem das leituras (por usuário, passado ← → agora)",
  clickColour: "· toque em uma cor para ir até essa leitura",
  older: "Mais antiga",
  thirdLatest: "3ª mais recente",
  secondLatest: "2ª mais recente",
  latest: "Mais recente",
  noRecencyScan: (label) => `Nenhuma leitura ${label.toLowerCase()} para esta sessão`,
  selectSessionFirst: "Selecione uma sessão na linha do tempo primeiro",
  jumpToScan: (label) => `Ir para a leitura ${label.toLowerCase()}`,
  nfcScan: "Leitura NFC",
  pageVisit: "Visita à página",
  liveSessionsTimeline: "Linha do tempo das sessões ao vivo",
  justNow: "Agora mesmo",
  minutesAgo: (n) => `há ${n} min`,
  hoursAgo: (n) => `há ${n} h`,
  daysAgo: (n) => `há ${n} d`,
  taps: (n) => (n === 1 ? "1 toque" : `${n} toques`),
  scans: (n) => (n === 1 ? "1 leitura" : `${n} leituras`),
  visits: (n) => (n === 1 ? "1 visita" : `${n} visitas`),
  links: (n) => (n === 1 ? "1 link" : `${n} links`),
  visitsDotPercent: (countLabel, percent) => `${countLabel} · ${percent}%`,
  trackedScansMeta: "leituras rastreadas do TMA Demo",
  trackedLinksMeta: (count) => `de ${count} tags rastreadas do TMA Demo`,
  trackedScansAcrossMeta: "nas tags rastreadas do TMA Demo",
  emptyActivity: "Nenhuma atividade rastreada do TMA Demo encontrada.",
  couldNotOpenDemo:
    "Não foi possível abrir o TMA Demo. Defina VITE_DASHBOARD_PASSWORD em apps/dashboard/.env para coincidir com a API.",
}

const COPY: Record<DashboardLocale, DashboardCopy> = {
  en: EN,
  "pt-BR": PT_BR,
}

export function dashboardCopy(locale: DashboardLocale): DashboardCopy {
  return COPY[locale] ?? EN
}
