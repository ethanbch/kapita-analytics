document.addEventListener("DOMContentLoaded", () => {
  // Gestion du formulaire newsletter
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit);
  }

  // Exemple de chargement dynamique d'articles
  const articlesGrid = document.querySelector(".articles-grid");
  if (articlesGrid) {
    loadArticles();
  }

  // Header scroll effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Animation des éléments au scroll
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".article-card, .section-title").forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // Gestion des filtres d'articles
  const filterButtons = document.querySelectorAll(".filter-button");
  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Retirer la classe active de tous les boutons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Ajouter la classe active au bouton cliqué
        button.classList.add("active");

        // Extraire la catégorie du texte du bouton (en ignorant l'icône)
        const categoryText = button.textContent.trim();
        filterArticles(categoryText);
      });
    });
  }

  // Gestion de la recherche d'articles
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterArticlesBySearch(searchTerm);
    });
  }
});

// Gestion du menu mobile
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");

  // Création du bouton hamburger
  const menuToggle = document.createElement("button");
  menuToggle.className = "menu-toggle";
  menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  header.insertBefore(menuToggle, nav);

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.innerHTML = nav.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Ferme le menu quand on clique sur un lien
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Ferme le menu quand on scroll
  window.addEventListener("scroll", () => {
    if (nav.classList.contains("active")) {
      nav.classList.remove("active");
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

const API_URL = "http://localhost:3000/api";

async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector("#email");
  const formContainer = form.parentElement;

  try {
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Inscription en cours...';

    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.querySelector("#name")?.value || "Abonné",
        email: emailInput.value,
      }),
    });

    if (!response.ok) throw new Error("Erreur réseau");

    // Remplacer tout le contenu du formulaire par le message de succès
    formContainer.innerHTML = `
      <div class="success-message">
        <i class="fas fa-check-circle"></i>
        <h3>Merci pour votre inscription !</h3>
        <p>Un email de confirmation a été envoyé à ${emailInput.value}</p>
        <p class="success-details">Vous recevrez bientôt nos dernières analyses économiques.</p>
      </div>
    `;
  } catch (error) {
    console.error("Erreur:", error);
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> S\'abonner';

    // Afficher l'erreur de manière plus visible
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <div>
        <strong>Erreur lors de l'inscription</strong>
        <p>Veuillez réessayer plus tard ou nous contacter directement.</p>
      </div>
    `;

    form.insertBefore(errorDiv, submitButton);
    setTimeout(() => errorDiv.remove(), 5000);
  }
}

function loadArticles() {
  const articles = [
    {
      title: "Les enjeux de l'inflation en 2024",
      date: "15 janvier 2024",
      excerpt:
        "L'inflation continue d'impacter l'économie mondiale en 2024. Avec une hausse des prix qui touche particulièrement l'alimentation et l'énergie, les banques centrales font face à des défis majeurs. Découvrez notre analyse complète des causes, conséquences et perspectives...",
      image:
        "https://images.unsplash.com/photo-1618044619888-009e412ff12a?w=800",
      category: "Macroéconomie",
      url: "articles/inflation-2024.html",
    },
    {
      title: "Bitcoin : L'année de tous les records ?",
      date: "12 janvier 2024",
      excerpt:
        "Alors que le Bitcoin atteint de nouveaux sommets, le marché des cryptomonnaies attire de plus en plus d'investisseurs institutionnels. Entre adoption massive et régulation croissante, 2024 pourrait être une année charnière pour les actifs numériques...",
      image:
        "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800",
      category: "Finance",
      url: "articles/bitcoin-2024.html",
    },
    {
      title: "Guide pratique : Optimiser son épargne en période d'inflation",
      date: "10 janvier 2024",
      excerpt:
        "Face à la hausse des taux d'intérêt, quelles sont les meilleures options pour faire fructifier son épargne ? De l'immobilier aux marchés boursiers, découvrez nos conseils pour protéger et faire croître votre patrimoine en 2024...",
      image:
        "https://images.unsplash.com/photo-1579621970589-a6652767393b?w=800",
      category: "Finance personnelle",
      url: "articles/guide-epargne-2024.html",
    },
  ];

  const articlesGrid = document.querySelector(".articles-grid");
  articlesGrid.innerHTML = ""; // Nettoyage des articles existants

  articles.forEach((article) => {
    const articleCard = createArticleCard(article);
    articleCard.addEventListener(
      "click",
      () => (window.location.href = article.url)
    );
    articlesGrid.appendChild(articleCard);
  });
}

function createArticleCard(article) {
  const card = document.createElement("div");
  card.className = "article-card";
  card.style.cursor = "pointer";
  card.innerHTML = `
    <div class="article-image">
      <img src="${article.image}" alt="${article.title}" loading="lazy">
      <span class="category-tag">${article.category}</span>
      <button class="brief-button" data-title="${article.title}">
        <i class="fas fa-lightbulb"></i> En bref !
      </button>
    </div>
    <div class="article-content">
      <h3>${article.title}</h3>
      <p class="date"><i class="far fa-calendar-alt"></i> ${article.date}</p>
      <p class="excerpt">${article.excerpt}</p>
      <span class="read-more">Lire la suite <i class="fas fa-arrow-right"></i></span>
    </div>
  `;

  // Empêcher le clic sur le bouton "En bref" de rediriger vers l'article
  const briefButton = card.querySelector(".brief-button");
  briefButton.addEventListener("click", (e) => {
    e.stopPropagation();
    showBrief(article);
  });

  return card;
}

function showBrief(article) {
  // Création du modal
  const modal = document.createElement("div");
  modal.className = "brief-modal";
  modal.innerHTML = `
    <div class="brief-content">
      <div class="brief-header">
        <h3>${article.title}</h3>
        <button class="close-brief">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <ul class="brief-points">
        ${generateBriefPoints(article)}
      </ul>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("show-modal"), 10);

  // Gestion de la fermeture
  const closeBtn = modal.querySelector(".close-brief");
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show-modal");
    setTimeout(() => modal.remove(), 300);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show-modal");
      setTimeout(() => modal.remove(), 300);
    }
  });
}

function generateBriefPoints(article) {
  // Exemple de points clés (à personnaliser selon vos besoins)
  const points = [
    "Point clé 1 de l'article",
    "Point clé 2 avec plus de détails",
    "Point clé 3 sur les implications",
    "Conclusion principale",
  ];

  return points.map((point) => `<li>${point}</li>`).join("");
}

function filterArticlesBySearch(searchTerm) {
  const articles = document.querySelectorAll(".article-card");

  articles.forEach((article) => {
    const title = article.querySelector("h3").textContent.toLowerCase();
    const excerpt = article.querySelector(".excerpt").textContent.toLowerCase();
    const category = article
      .querySelector(".category-tag")
      .textContent.toLowerCase();

    if (
      title.includes(searchTerm) ||
      excerpt.includes(searchTerm) ||
      category.includes(searchTerm)
    ) {
      article.style.display = "flex";
    } else {
      article.style.display = "none";
    }
  });
}

// Mise à jour de la fonction filterArticles pour combiner avec la recherche
function filterArticles(category) {
  const searchTerm =
    document.querySelector(".search-bar input")?.value.toLowerCase() || "";
  const articles = document.querySelectorAll(".article-card");

  articles.forEach((article) => {
    const articleCategory = article.querySelector(".category-tag").textContent;
    const title = article.querySelector("h3").textContent.toLowerCase();
    const excerpt = article.querySelector(".excerpt").textContent.toLowerCase();

    const matchesCategory =
      category.includes("Tous") || category.includes(articleCategory);
    const matchesSearch =
      title.includes(searchTerm) ||
      excerpt.includes(searchTerm) ||
      articleCategory.toLowerCase().includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      article.style.display = "flex";
    } else {
      article.style.display = "none";
    }
  });
}
