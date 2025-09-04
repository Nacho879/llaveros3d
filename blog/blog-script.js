// Script específico para el blog - Evita conflictos con script.js principal
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Blog script inicializado');
    
    // Solo ejecutar funciones específicas del blog
    initializeBlogFeatures();
});

function initializeBlogFeatures() {
    // Mobile menu
    setupMobileMenu();
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('¡Gracias por suscribirte! Recibirás nuestros consejos y ofertas exclusivas.', 'success');
                this.reset();
            }
        });
    }
    
    // Load more articles
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles();
        });
    }
    
    // Table of contents navigation
    const tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length > 0) {
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Highlight current section in TOC
    if (tocLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // Article reading progress
    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
        createReadingProgress();
    }
    
    // Share buttons
    createShareButtons();
    
    // Related articles carousel
    const relatedArticles = document.querySelector('.related-articles .articles-grid');
    if (relatedArticles && relatedArticles.children.length > 2) {
        createRelatedCarousel();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function loadMoreArticles() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const articlesGrid = document.querySelector('.articles-grid');
    
    if (!loadMoreBtn || !articlesGrid) return;
    
    // Show loading state
    loadMoreBtn.textContent = 'Cargando...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
        // Add more articles (in a real implementation, this would fetch from an API)
        const newArticles = [
            {
                image: '/assets/blog/sector-tecnologico.svg',
                category: 'Sectores',
                date: '12 Diciembre 2024',
                title: 'Llaveros para el Sector Tecnológico',
                excerpt: 'Cómo las empresas tecnológicas utilizan llaveros personalizados para branding y eventos corporativos.',
                link: '/blog/llaveros-sector-tecnologico.html'
            },
            {
                image: '/assets/blog/sostenibilidad.svg',
                category: 'Sostenibilidad',
                date: '11 Diciembre 2024',
                title: 'Llaveros Sostenibles: El Futuro del Merchandising',
                excerpt: 'Exploramos las opciones más ecológicas para llaveros personalizados y su impacto en el medio ambiente.',
                link: '/blog/llaveros-sostenibles.html'
            }
        ];
        
        newArticles.forEach(article => {
            const articleElement = createArticleCard(article);
            articlesGrid.appendChild(articleElement);
        });
        
        // Reset button
        loadMoreBtn.textContent = 'Cargar más artículos';
        loadMoreBtn.disabled = false;
        
        // Hide button if no more articles
        loadMoreBtn.style.display = 'none';
        
        showNotification('Se han cargado más artículos', 'success');
    }, 1500);
}

function createArticleCard(article) {
    const articleCard = document.createElement('article');
    articleCard.className = 'article-card';
    
    articleCard.innerHTML = `
        <div class="article-image">
            <img src="${article.image}" alt="${article.title}" loading="lazy">
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="category">${article.category}</span>
                <span class="date">${article.date}</span>
            </div>
            <h3><a href="${article.link}">${article.title}</a></h3>
            <p>${article.excerpt}</p>
            <a href="${article.link}" class="read-more">Leer más</a>
        </div>
    `;
    
    return articleCard;
}

function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;
        
        const articleTop = articleContent.offsetTop;
        const articleHeight = articleContent.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const progress = Math.min(
            Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
            1
        );
        
        progressBar.style.width = (progress * 100) + '%';
    });
}

function createShareButtons() {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;
    
    const shareButtons = document.createElement('div');
    shareButtons.className = 'share-buttons';
    shareButtons.style.cssText = `
        position: fixed;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    `;
    
    const shareData = {
        title: document.title,
        url: window.location.href,
        text: document.querySelector('.article-excerpt')?.textContent || ''
    };
    
    const platforms = [
        {
            name: 'Facebook',
            icon: '📘',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
        },
        {
            name: 'Twitter',
            icon: '🐦',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`
        },
        {
            name: 'LinkedIn',
            icon: '💼',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`
        },
        {
            name: 'WhatsApp',
            icon: '📱',
            url: `https://wa.me/?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`
        }
    ];
    
    platforms.forEach(platform => {
        const button = document.createElement('a');
        button.href = platform.url;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.title = `Compartir en ${platform.name}`;
        button.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            text-decoration: none;
            font-size: 20px;
            transition: transform 0.2s ease;
        `;
        button.textContent = platform.icon;
        
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        shareButtons.appendChild(button);
    });
    
    document.body.appendChild(shareButtons);
}

function createRelatedCarousel() {
    const relatedSection = document.querySelector('.related-articles');
    const articlesGrid = relatedSection.querySelector('.articles-grid');
    
    // Convert grid to carousel
    articlesGrid.style.display = 'flex';
    articlesGrid.style.overflowX = 'auto';
    articlesGrid.style.gap = '2rem';
    articlesGrid.style.paddingBottom = '1rem';
    
    // Add scroll indicators
    const scrollLeft = document.createElement('button');
    const scrollRight = document.createElement('button');
    
    scrollLeft.innerHTML = '←';
    scrollRight.innerHTML = '→';
    
    [scrollLeft, scrollRight].forEach(btn => {
        btn.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: #3b82f6;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            z-index: 10;
        `;
    });
    
    scrollLeft.style.left = '-20px';
    scrollRight.style.right = '-20px';
    
    relatedSection.style.position = 'relative';
    relatedSection.appendChild(scrollLeft);
    relatedSection.appendChild(scrollRight);
    
    // Add scroll functionality
    scrollLeft.addEventListener('click', () => {
        articlesGrid.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    scrollRight.addEventListener('click', () => {
        articlesGrid.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

// ========================================
// MENÚ MÓVIL RESPONSIVE - BLOG
// ========================================

function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!mobileMenuToggle || !mobileNav) {
        console.warn('⚠️ Elementos del menú móvil del blog no encontrados');
        return;
    }
    
    // Toggle del menú hamburguesa
    mobileMenuToggle.addEventListener('click', () => {
        const isActive = mobileMenuToggle.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Cerrar menú al hacer click en un enlace
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú al redimensionar ventana (si se vuelve desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.classList.add('active');
        mobileNav.classList.add('active');
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Actualizar aria-label
        mobileMenuToggle.setAttribute('aria-label', 'Cerrar menú');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
}

function closeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Actualizar aria-label
        mobileMenuToggle.setAttribute('aria-label', 'Abrir menú');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
}
