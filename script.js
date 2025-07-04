/**
 * PORTAL DE NOTÍCIAS - JAVASCRIPT
 * Site de notícias completo e funcional
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
  PAGINATION: {
    itemsPerPage: 12,
    maxPages: 10,
  },
  CACHE: {
    duration: 5 * 60 * 1000, // 5 minutos
    enabled: true,
  },
  AUTO_REFRESH: {
    enabled: true,
    interval: 30 * 1000, // 30 segundos
  },
}

// ===== ESTADO GLOBAL DA APLICAÇÃO =====
const AppState = {
  currentCategory: "hot",
  currentPage: 1,
  isLoading: false,
  searchQuery: "",
  newsCache: new Map(),
  lastUpdate: null,
  totalNews: 0,
}

// ===== DADOS SIMULADOS =====
const MOCK_NEWS_DATA = {
  hot: [
    {
      id: 1,
      title: "Descoberta revolucionária na medicina pode mudar tratamento de doenças",
      summary:
        "Pesquisadores brasileiros desenvolvem nova técnica que promete revolucionar o tratamento de várias doenças crônicas.",
      content: "Uma equipe de pesquisadores da Universidade de São Paulo...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Ciência",
      author: "Dr. Maria Silva",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      views: 15420,
      featured: true,
    },
    {
      id: 2,
      title: "Economia brasileira mostra sinais de recuperação no terceiro trimestre",
      summary: "PIB cresce 2.1% e desemprego cai para menor nível em dois anos.",
      content: "Os dados divulgados hoje pelo IBGE mostram...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Economia",
      author: "João Santos",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      views: 8930,
      featured: false,
    },
    {
      id: 3,
      title: "Nova tecnologia de energia solar promete reduzir custos em 40%",
      summary: "Startup brasileira desenvolve painéis solares mais eficientes e baratos.",
      content: "A empresa SolarTech anunciou hoje...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Tecnologia",
      author: "Ana Costa",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      views: 12150,
      featured: false,
    },
    {
      id: 4,
      title: "Inteligência Artificial brasileira ganha prêmio internacional",
      summary: "Startup nacional é reconhecida por inovação em IA aplicada à saúde.",
      content: "A empresa HealthAI, sediada em São Paulo...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Tecnologia",
      author: "Lucas Ferreira",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      views: 7890,
      featured: true,
    },
  ],

  brasil: [
    {
      id: 5,
      title: "Flamengo vence clássico e se aproxima do título do Brasileirão",
      summary: "Rubro-negro derrota rival por 3-1 e abre vantagem na liderança.",
      content: "No Maracanã lotado, o Flamengo mostrou...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Futebol Brasil",
      author: "Carlos Mendes",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      views: 25680,
      featured: true,
    },
    {
      id: 6,
      title: "Palmeiras contrata novo técnico para próxima temporada",
      summary: "Clube paulista anuncia chegada de treinador europeu renomado.",
      content: "O Palmeiras oficializou hoje...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Futebol Brasil",
      author: "Roberto Lima",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      views: 18420,
      featured: false,
    },
    {
      id: 7,
      title: "Corinthians anuncia renovação de contrato com estrela do time",
      summary: "Jogador assina extensão até 2027 e se torna o mais bem pago do clube.",
      content: "Em coletiva de imprensa realizada hoje...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Futebol Brasil",
      author: "Marina Souza",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      views: 14230,
      featured: false,
    },
  ],

  "premier-league": [
    {
      id: 8,
      title: "Manchester City goleia e mantém liderança da Premier League",
      summary: "Citizens vencem por 4-0 e abrem vantagem na tabela.",
      content: "O Manchester City mostrou toda sua força...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Premier League",
      author: "James Wilson",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      views: 14230,
      featured: true,
    },
    {
      id: 9,
      title: "Arsenal contrata jovem promessa do futebol brasileiro",
      summary: "Clube londrino investe 50 milhões de euros em atacante de 19 anos.",
      content: "O Arsenal oficializou a contratação...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Premier League",
      author: "David Brown",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      views: 11890,
      featured: false,
    },
  ],

  "la-liga": [
    {
      id: 10,
      title: "Real Madrid vence El Clásico e assume liderança",
      summary: "Merengues derrotam Barcelona por 2-1 no Santiago Bernabéu.",
      content: "Em uma partida emocionante...",
      image: "/placeholder.svg?height=300&width=500",
      category: "La Liga",
      author: "Carlos Rodriguez",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      views: 32450,
      featured: true,
    },
  ],

  "serie-a": [
    {
      id: 11,
      title: "Juventus anuncia retorno de ídolo como novo técnico",
      summary: "Ex-jogador assume comando técnico da Velha Senhora.",
      content: "A Juventus surpreendeu o mundo do futebol...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Serie A",
      author: "Marco Rossi",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      views: 16780,
      featured: true,
    },
  ],

  bundesliga: [
    {
      id: 12,
      title: "Bayern de Munique mantém invencibilidade na temporada",
      summary: "Bávaros vencem mais uma e chegam a 15 jogos sem derrota.",
      content: "O Bayern de Munique continua...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Bundesliga",
      author: "Hans Mueller",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      views: 9340,
      featured: true,
    },
  ],

  politica: [
    {
      id: 13,
      title: "Congresso aprova nova lei de proteção de dados pessoais",
      summary: "Legislação reforça direitos dos cidadãos na era digital.",
      content: "Por unanimidade, o Congresso Nacional...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Política",
      author: "Fernanda Oliveira",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      views: 9870,
      featured: false,
    },
    {
      id: 14,
      title: "Presidente anuncia novo pacote de investimentos em infraestrutura",
      summary: "R$ 100 bilhões serão destinados a obras em todo o país nos próximos 4 anos.",
      content: "Em pronunciamento oficial...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Política",
      author: "Ricardo Alves",
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      views: 22340,
      featured: true,
    },
  ],

  economia: [
    {
      id: 15,
      title: "Bolsa de valores atinge novo recorde histórico",
      summary: "Ibovespa fecha em alta de 3.2% impulsionado por ações de tecnologia.",
      content: "O mercado financeiro brasileiro...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Economia",
      author: "Pedro Almeida",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      views: 11540,
      featured: false,
    },
    {
      id: 16,
      title: "Inflação recua pelo terceiro mês consecutivo",
      summary: "IPCA registra 0.15% em novembro, menor taxa do ano.",
      content: "Os dados divulgados pelo IBGE...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Economia",
      author: "Juliana Costa",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      views: 8760,
      featured: true,
    },
  ],

  tecnologia: [
    {
      id: 17,
      title: "Startup brasileira desenvolve chip revolucionário para smartphones",
      summary: "Nova tecnologia promete aumentar autonomia da bateria em 300%.",
      content: "A empresa TechBrasil anunciou...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Tecnologia",
      author: "Gabriel Santos",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      views: 19230,
      featured: true,
    },
    {
      id: 18,
      title: "Google anuncia investimento de R$ 2 bilhões no Brasil",
      summary: "Recursos serão destinados a data centers e programas de capacitação.",
      content: "O Google Brasil confirmou...",
      image: "/placeholder.svg?height=300&width=500",
      category: "Tecnologia",
      author: "Carla Mendes",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      views: 15670,
      featured: false,
    },
  ],
}

const TRENDING_TOPICS = [
  "Eleições 2024",
  "Copa do Mundo",
  "Inteligência Artificial",
  "Sustentabilidade",
  "Criptomoedas",
  "Saúde Mental",
  "Energia Renovável",
  "Educação Digital",
]

const BREAKING_NEWS = [
  "URGENTE: Nova descoberta científica revoluciona medicina",
  "ÚLTIMA HORA: Acordo histórico é assinado entre países",
  "AGORA: Tecnologia brasileira ganha reconhecimento mundial",
  "BREAKING: Economia mostra sinais de forte recuperação",
]

// ===== CLASSES PRINCIPAIS =====

class NewsManager {
  constructor() {
    this.cache = new Map()
    this.observers = []
  }

  async fetchNews(category = "hot", page = 1, limit = CONFIG.PAGINATION.itemsPerPage) {
    const cacheKey = `${category}-${page}-${limit}`

    if (CONFIG.CACHE.enabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < CONFIG.CACHE.duration) {
        return cached.data
      }
    }

    try {
      const data = await this.simulateAPICall(category, page, limit)

      if (CONFIG.CACHE.enabled) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        })
      }

      return data
    } catch (error) {
      console.error("Erro ao buscar notícias:", error)
      throw error
    }
  }

  async simulateAPICall(category, page, limit) {
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    const categoryNews = MOCK_NEWS_DATA[category] || MOCK_NEWS_DATA.hot
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNews = categoryNews.slice(startIndex, endIndex)

    return {
      news: paginatedNews,
      total: categoryNews.length,
      page,
      totalPages: Math.ceil(categoryNews.length / limit),
      hasMore: endIndex < categoryNews.length,
    }
  }

  async searchNews(query) {
    if (!query.trim()) return []

    const allNews = Object.values(MOCK_NEWS_DATA).flat()
    const filtered = allNews.filter(
      (news) =>
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.summary.toLowerCase().includes(query.toLowerCase()) ||
        news.category.toLowerCase().includes(query.toLowerCase()),
    )

    return filtered
  }
}

class UIManager {
  constructor() {
    this.elements = this.initializeElements()
    this.setupEventListeners()
  }

  initializeElements() {
    return {
      nav: document.getElementById("nav"),
      navLinks: document.querySelectorAll(".nav-link"),
      mobileMenuToggle: document.getElementById("mobileMenuToggle"),
      searchInput: document.getElementById("searchInput"),
      searchBtn: document.getElementById("searchBtn"),
      categoryTitle: document.getElementById("categoryTitle"),
      newsCount: document.getElementById("newsCount"),
      refreshBtn: document.getElementById("refreshBtn"),
      featuredSection: document.getElementById("featuredSection"),
      featuredNews: document.getElementById("featuredNews"),
      newsGrid: document.getElementById("newsGrid"),
      loadMoreBtn: document.getElementById("loadMoreBtn"),
      trendingList: document.getElementById("trendingList"),
      breakingNews: document.getElementById("breakingNews"),
      breakingText: document.getElementById("breakingText"),
      loadingOverlay: document.getElementById("loadingOverlay"),
    }
  }

  setupEventListeners() {
    this.elements.mobileMenuToggle?.addEventListener("click", () => {
      this.toggleMobileMenu()
    })

    this.elements.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const category = link.dataset.category
        if (category) {
          this.handleCategoryChange(category)
        }
      })
    })

    this.elements.searchBtn?.addEventListener("click", () => {
      this.handleSearch()
    })

    this.elements.searchInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSearch()
      }
    })

    this.elements.refreshBtn?.addEventListener("click", () => {
      this.handleRefresh()
    })

    this.elements.loadMoreBtn?.addEventListener("click", () => {
      this.handleLoadMore()
    })

    const newsletterForm = document.querySelector(".newsletter-form")
    newsletterForm?.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleNewsletterSignup(e)
    })

    window.addEventListener("resize", () => {
      this.handleResize()
    })
  }

  toggleMobileMenu() {
    this.elements.nav?.classList.toggle("active")

    const spans = this.elements.mobileMenuToggle?.querySelectorAll("span")
    spans?.forEach((span, index) => {
      span.style.transform = this.elements.nav?.classList.contains("active")
        ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg) translate(${index === 1 ? "0" : index === 0 ? "5px, 5px" : "-5px, -5px"})`
        : "none"
    })
  }

  handleCategoryChange(category) {
    AppState.currentCategory = category
    AppState.currentPage = 1
    AppState.searchQuery = ""

    this.updateActiveNavLink(category)
    this.updateCategoryTitle(category)

    window.app.loadNews(category)

    if (this.elements.nav?.classList.contains("active")) {
      this.toggleMobileMenu()
    }
  }

  updateActiveNavLink(category) {
    this.elements.navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.dataset.category === category) {
        link.classList.add("active")
      }
    })
  }

  updateCategoryTitle(category) {
    const titles = {
      hot: "Notícias Quentes",
      brasil: "Futebol - Brasil",
      "premier-league": "Futebol - Premier League",
      "la-liga": "Futebol - La Liga",
      "serie-a": "Futebol - Serie A",
      bundesliga: "Futebol - Bundesliga",
      politica: "Política",
      economia: "Economia",
      tecnologia: "Tecnologia",
    }

    if (this.elements.categoryTitle) {
      this.elements.categoryTitle.textContent = titles[category] || "Notícias"
    }
  }

  async handleSearch() {
    const query = this.elements.searchInput?.value.trim()
    if (!query) return

    AppState.searchQuery = query
    this.showLoading()

    try {
      const results = await window.app.newsManager.searchNews(query)
      this.displaySearchResults(results, query)
    } catch (error) {
      console.error("Erro na busca:", error)
      this.showError("Erro ao realizar busca. Tente novamente.")
    } finally {
      this.hideLoading()
    }
  }

  displaySearchResults(results, query) {
    if (this.elements.categoryTitle) {
      this.elements.categoryTitle.textContent = `Resultados para: "${query}"`
    }

    if (this.elements.newsCount) {
      this.elements.newsCount.textContent = `${results.length} resultado${results.length !== 1 ? "s" : ""}`
    }

    if (this.elements.featuredNews) {
      this.elements.featuredNews.innerHTML = ""
    }

    this.displayNews(results)

    if (this.elements.loadMoreBtn) {
      this.elements.loadMoreBtn.style.display = "none"
    }
  }

  handleRefresh() {
    app.loadNews(AppState.currentCategory, true)
  }

  handleLoadMore() {
    AppState.currentPage++
    app.loadNews(AppState.currentCategory, false, true)
  }

  handleNewsletterSignup(e) {
    const formData = new FormData(e.target)
    const email = formData.get("email")

    this.showSuccess("Email cadastrado com sucesso!")
    e.target.reset()
  }

  handleResize() {
    if (window.innerWidth > 768 && this.elements.nav?.classList.contains("active")) {
      this.toggleMobileMenu()
    }
  }

  displayNews(news, append = false) {
    if (!news || news.length === 0) {
      if (!append) {
        this.elements.newsGrid.innerHTML = '<p class="text-center">Nenhuma notícia encontrada.</p>'
      }
      return
    }

    if (!append) {
      this.elements.newsGrid.innerHTML = ""
    }

    news.forEach((article) => {
      const newsCard = this.createNewsCard(article)
      this.elements.newsGrid.appendChild(newsCard)
    })

    const newCards = this.elements.newsGrid.querySelectorAll(".news-card")
    newCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("fade-in")
    })
  }

  displayFeaturedNews(featuredNews) {
    if (!featuredNews || featuredNews.length === 0) return

    const mainFeatured = featuredNews[0]
    const sidebarFeatured = featuredNews.slice(1, 4)

    this.elements.featuredNews.innerHTML = `
            <div class="featured-main">
                <img src="${mainFeatured.image}" alt="${mainFeatured.title}" loading="lazy">
                <div class="featured-content">
                    <h3>${mainFeatured.title}</h3>
                    <p>${mainFeatured.summary}</p>
                    <div class="featured-meta">
                        <span>${mainFeatured.author}</span>
                        <span>${this.formatDate(mainFeatured.publishedAt)}</span>
                        <span>${this.formatViews(mainFeatured.views)} visualizações</span>
                    </div>
                </div>
            </div>
            <div class="featured-sidebar">
                ${sidebarFeatured
                  .map(
                    (article) => `
                    <div class="featured-item">
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                        <div class="featured-item-content">
                            <h4>${article.title}</h4>
                            <div class="featured-item-meta">
                                ${this.formatDate(article.publishedAt)} • ${this.formatViews(article.views)} views
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `
  }

  createNewsCard(article) {
    const card = document.createElement("div")
    card.className = "news-card"
    card.innerHTML = `
            <img src="${article.image}" alt="${article.title}" loading="lazy">
            <div class="news-card-content">
                <span class="news-category">${article.category}</span>
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <div class="news-meta">
                    <span class="news-author">${article.author}</span>
                    <span>${this.formatDate(article.publishedAt)}</span>
                </div>
            </div>
        `

    card.addEventListener("click", () => {
      this.openNewsModal(article)
    })

    return card
  }

  openNewsModal(article) {
    alert(`Abrindo: ${article.title}\n\n${article.summary}`)
  }

  updateNewsCount(count) {
    if (this.elements.newsCount) {
      this.elements.newsCount.textContent = `${count} notícia${count !== 1 ? "s" : ""}`
    }
  }

  updateTrendingTopics(topics) {
    if (!this.elements.trendingList) return

    this.elements.trendingList.innerHTML = topics
      .map(
        (topic) => `
            <li><a href="#" data-search="${topic}">${topic}</a></li>
        `,
      )
      .join("")

    this.elements.trendingList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const searchTerm = link.dataset.search
        this.elements.searchInput.value = searchTerm
        this.handleSearch()
      })
    })
  }

  updateBreakingNews(breakingNews) {
    if (!this.elements.breakingText || !breakingNews.length) return

    let currentIndex = 0
    const updateText = () => {
      this.elements.breakingText.textContent = breakingNews[currentIndex]
      currentIndex = (currentIndex + 1) % breakingNews.length
    }

    updateText()
    setInterval(updateText, 5000)
  }

  showLoading() {
    AppState.isLoading = true
    this.elements.loadingOverlay?.classList.add("active")
  }

  hideLoading() {
    AppState.isLoading = false
    this.elements.loadingOverlay?.classList.remove("active")
  }

  showSuccess(message) {
    this.showNotification(message, "success")
  }

  showError(message) {
    this.showNotification(message, "error")
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: type === "success" ? "#38a169" : type === "error" ? "#e53e3e" : "#2d5a87",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      zIndex: "10000",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      maxWidth: "400px",
      animation: "slideIn 0.3s ease-out",
    })

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 5000)

    notification.querySelector(".notification-close").addEventListener("click", () => {
      notification.remove()
    })
  }

  formatDate(date) {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Agora"
    if (minutes < 60) return `${minutes}min atrás`
    if (hours < 24) return `${hours}h atrás`
    if (days < 7) return `${days}d atrás`

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  formatViews(views) {
    if (views < 1000) return views.toString()
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
    return `${(views / 1000000).toFixed(1)}M`
  }
}

class NewsApp {
  constructor() {
    this.newsManager = new NewsManager()
    this.uiManager = new UIManager()
    this.autoRefreshInterval = null

    this.init()
  }

  async init() {
    try {
      await this.loadInitialData()
      this.setupAutoRefresh()
      this.setupServiceWorker()

      console.log("Portal de Notícias inicializado com sucesso!")
    } catch (error) {
      console.error("Erro ao inicializar aplicação:", error)
      this.uiManager.showError("Erro ao carregar aplicação. Recarregue a página.")
    }
  }

  async loadInitialData() {
    this.uiManager.showLoading()

    try {
      await this.loadNews(AppState.currentCategory)
      this.uiManager.updateTrendingTopics(TRENDING_TOPICS)
      this.uiManager.updateBreakingNews(BREAKING_NEWS)
    } finally {
      this.uiManager.hideLoading()
    }
  }

  async loadNews(category = "hot", forceRefresh = false, append = false) {
    if (AppState.isLoading && !append) return

    if (!append) {
      this.uiManager.showLoading()
    }

    try {
      if (forceRefresh) {
        this.newsManager.cache.clear()
      }

      const page = append ? AppState.currentPage : 1
      const data = await this.newsManager.fetchNews(category, page)

      AppState.totalNews = data.total
      AppState.lastUpdate = new Date()

      this.uiManager.updateNewsCount(data.total)

      if (!append) {
        const featuredNews = data.news.filter((news) => news.featured)
        if (featuredNews.length > 0) {
          this.uiManager.displayFeaturedNews(featuredNews)
        }

        this.uiManager.displayNews(data.news)
      } else {
        this.uiManager.displayNews(data.news, true)
      }

      if (this.uiManager.elements.loadMoreBtn) {
        this.uiManager.elements.loadMoreBtn.style.display = data.hasMore ? "block" : "none"
        this.uiManager.elements.loadMoreBtn.disabled = !data.hasMore
      }
    } catch (error) {
      console.error("Erro ao carregar notícias:", error)
      this.uiManager.showError("Erro ao carregar notícias. Tente novamente.")
    } finally {
      if (!append) {
        this.uiManager.hideLoading()
      }
    }
  }

  setupAutoRefresh() {
    if (!CONFIG.AUTO_REFRESH.enabled) return

    this.autoRefreshInterval = setInterval(() => {
      if (!AppState.isLoading && !AppState.searchQuery) {
        this.loadNews(AppState.currentCategory, true)
      }
    }, CONFIG.AUTO_REFRESH.interval)
  }

  setupServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado:", registration)
        })
        .catch((error) => {
          console.log("Erro ao registrar Service Worker:", error)
        })
    }
  }

  destroy() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval)
    }
  }
}

// ===== UTILITÁRIOS =====
const Utils = {
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  throttle(func, limit) {
    let inThrottle
    return function () {
      const args = arguments
      
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  sanitizeHTML(str) {
    const temp = document.createElement("div")
    temp.textContent = str
    return temp.innerHTML
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  window.app = new NewsApp()

  window.addEventListener("beforeunload", () => {
    if (window.app) {
      window.app.destroy()
    }
  })

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
  if (prefersDark.matches) {
    document.body.classList.add("dark-theme")
  }

  prefersDark.addEventListener("change", (e) => {
    document.body.classList.toggle("dark-theme", e.matches)
  })
})

// ===== EXPORTAÇÕES =====
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NewsApp,
    NewsManager,
    UIManager,
    Utils,
    CONFIG,
  }
}

// Função para carregar o anúncio no espaço publicitário
function carregarAnuncios() {
    // Selecione os espaços publicitários
    const adContainers = [
        document.getElementById('horizontalAd'),
        document.getElementById('leftSidebarAd'),
        document.getElementById('rightSidebarAd')
    ];

    // Para cada espaço publicitário, carregar um anúncio
    adContainers.forEach(container => {
        // Solicita um novo anúncio da Monetag
        fetch('https://api.monetag.com/ads') // Este URL deve ser a API do Monetag ou outra URL que forneça o conteúdo do anúncio
            .then(response => response.json())
            .then(data => {
                // Suponha que os dados retornem um URL de imagem do anúncio ou código HTML do anúncio
                container.innerHTML = `<a href="${data.adUrl}" target="_blank"><img src="${data.adImage}" alt="Anúncio"></a>`;
            })
            .catch(error => {
                console.error('Erro ao carregar anúncio:', error);
            });
    });
}

// Carregar os anúncios assim que a página carregar
window.onload = function() {
    carregarAnuncios();
};

// Atualizar anúncios a cada 30 segundos (30000 milissegundos)
setInterval(carregarAnuncios, 30000);

fetch('https://api.monetag.com/get-ad?zone=sidebar-left')
    .then(response => response.json())
    .then(adData => {
        // Exibir o anúncio no espaço de sidebar-left
        document.getElementById('leftSidebarAd').innerHTML = `<a href="${adData.url}" target="_blank"><img src="${adData.image}" alt="Anúncio"></a>`;
    })
    .catch(error => console.log('Erro ao carregar anúncio:', error));
