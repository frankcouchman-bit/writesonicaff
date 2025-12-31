/*
 * Global JavaScript for AI Writer Hub
 * Adds scroll reveal animations, a session-based promotional popup, a sticky CTA,
 * and subtle header effects to reinforce the flash-inspired UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Scroll‑reveal animation
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // Nav active state
  const navLinks = document.querySelectorAll('.navbar nav a');
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const pathTail = pathParts.pop() || 'index.html';
  const currentPath = pathTail.includes('.') ? pathTail : 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const normalized = href.split('/').filter(Boolean).pop();
    if (normalized === currentPath) {
      link.classList.add('active');
    }
  });

  // Sticky CTA button (auto-injected on every page)
  if (!document.querySelector('.sticky-cta')) {
    const stickyCta = document.createElement('a');
    stickyCta.href = 'https://writesonic.com/botsonic?fpr=frank67';
    stickyCta.target = '_blank';
    stickyCta.rel = 'noopener';
    stickyCta.className = 'sticky-cta';
    stickyCta.setAttribute('aria-label', 'Start your free Writesonic trial');
    stickyCta.textContent = 'Start Free Trial';
    body.appendChild(stickyCta);
  }

  // Header shadow on scroll
  const header = document.querySelector('.navbar');
  const toggleHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add('navbar-scrolled');
    } else {
      header.classList.remove('navbar-scrolled');
    }
  };
  window.addEventListener('scroll', toggleHeaderState);
  toggleHeaderState();

  // Subtle parallax for hero imagery
  const heroImages = document.querySelectorAll('.hero-image img');
  let ticking = false;
  const parallax = () => {
    heroImages.forEach((img) => {
      const offset = Math.min(window.scrollY * 0.04, 30);
      img.style.transform = `translateY(${offset}px) scale(1.02)`;
      img.style.boxShadow = '0 20px 65px rgba(0, 0, 0, 0.6)';
    });
    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(parallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll);
  parallax();

  // Promotional popup
  const popup = document.getElementById('promo-popup');
  if (popup) {
    const popupDelay = 6500; // milliseconds
    const closePopup = () => {
      popup.classList.remove('show');
      sessionStorage.setItem('popupShown', 'true');
    };

    if (!sessionStorage.getItem('popupShown')) {
      setTimeout(() => {
        popup.classList.add('show');
      }, popupDelay);
    }

    const closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    });
  }

  // Deep content booster for article pages
  const isArticlePage = window.location.pathname.includes('/posts/');
  if (isArticlePage && !document.querySelector('.article-depth')) {
    const articleContainer = document.createElement('section');
    articleContainer.className = 'article-depth container reveal';

    const headline =
      document.querySelector('h1')?.textContent?.trim() || 'Writesonic Guide';

    const longformBlocks = [
      `Modern readers expect more than surface-level comparisons. This deep dive builds topical authority around ${headline} by weaving together AI writing best practices, search intent analysis, and actionable prompts you can deploy immediately. We map every recommendation back to conversion opportunities—free trials, demo requests, and SEO wins—so each section earns its place on the page.`,
      'Start with clear topical clusters. Group related keywords, questions, and feature comparisons into sections that answer the who/what/why of the tool you are evaluating. Prioritise intent-rich phrases like “best AI writer 2025,” “Writesonic vs Jasper,” and “AI writing software pricing” so both Google and readers see depth and relevance in a single visit.',
      'Layer in proof. Use mini case studies that show how marketers speed up briefs, editors enforce brand voice, and founders validate messaging with AI-assisted drafts. Describe real workflows: building an outline, generating first drafts, running the SEO checker, and tightening copy with human edits. Evidence-driven copy keeps engagement high.',
      'Demonstrate the stack. Beyond the writer, mention complementary tools like ChatSonic for conversational intake, BotSonic for lead capture, and the built-in SEO Checker & Optimizer for on-page guidance. Showing how these puzzle pieces connect elevates the perceived value of your recommendation.',
      'Highlight pricing clarity. Summarise the free plan (10k monthly words), Unlimited, and Business tiers in plain language. Readers appreciate transparent thresholds and the reassurance that they can trial Writesonic without risk before upgrading to scale campaigns.',
      'Add comparison anchors. Link to sibling guides—Jasper, Copy.ai, ChatGPT, Surfer AI, Frase, QuillBot, Grammarly, MarketMuse, and Anyword—so users can pivot between options without pogo-sticking back to search results. Internal links distribute authority across the site.',
      'Teach prompt craft. Include a short library of prompts for blog posts, ecommerce pages, social captions, and email sequences. Explain how to set tone, target word counts, and include keywords naturally to avoid over-optimisation while still hitting search goals.',
      'Prioritise UX signals. Use short paragraphs, scannable bullets, gradient headings, and sticky calls-to-action so the flash-inspired layout stays engaging on both desktop and mobile. Fast page loads, legible contrast, and accessible focus states all contribute to higher rankings.',
      'Offer optimisation checklists. Encourage readers to run an SEO pass on every draft—check headings, meta descriptions, internal links, and schema where relevant. Pair the checklist with a CTA that jumps directly into the Writesonic editor so the advice is actionable.',
      'Close with a playbook. Provide a three-step launch plan: research keywords, generate long-form drafts with Writesonic, then refine with human editing and publish with internal links to comparison pages. This keeps the user journey flowing toward conversion.',
    ];

    const title = document.createElement('h2');
    title.textContent = `${headline}: Conversion-Focused Breakdown`;
    articleContainer.appendChild(title);

    longformBlocks.forEach((block) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = block;
      articleContainer.appendChild(paragraph);
    });

    const promptList = document.createElement('div');
    promptList.className = 'article-cta-grid';
    promptList.innerHTML = `
      <div class="cta-card">
        <h3>High-Intent Prompts</h3>
        <ul>
          <li>“Write a 2,500-word review targeting ‘best AI writer 2025’ with product comparisons and FAQs.”</li>
          <li>“Draft a conversion-focused landing page for an AI writer with SEO schema suggestions.”</li>
          <li>“Outline a Writesonic vs Jasper head-to-head with pricing, pros, cons, and migration tips.”</li>
          <li>“Generate ecommerce descriptions with tone, length, and internal link cues.”</li>
        </ul>
      </div>
      <div class="cta-card">
        <h3>Internal Link Hub</h3>
        <p>Jump to our most requested comparisons to keep exploring without losing context.</p>
        <div class="pill-links">
          <a href="/posts/writesonic-vs-jasper.html">Writesonic vs Jasper</a>
          <a href="/posts/writesonic-vs-copy-ai.html">Writesonic vs Copy.ai</a>
          <a href="/posts/writesonic-vs-chatgpt.html">Writesonic vs ChatGPT</a>
          <a href="/posts/writesonic-vs-surfer-ai.html">Writesonic vs Surfer AI</a>
          <a href="/posts/writesonic-vs-frase.html">Writesonic vs Frase AI</a>
          <a href="/posts/writesonic-vs-marketmuse.html">Writesonic vs MarketMuse</a>
          <a href="/posts/writesonic-vs-anyword.html">Writesonic vs Anyword</a>
          <a href="/posts/writesonic-vs-grammarly.html">Writesonic vs Grammarly</a>
          <a href="/posts/writesonic-vs-quillbot.html">Writesonic vs QuillBot</a>
        </div>
      </div>
      <div class="cta-card">
        <h3>Try Writesonic</h3>
        <p>Experience the SEO Checker & Optimizer, long-form drafts, and over 80 tools built to ship content faster.</p>
        <a class="cta-button" href="https://writesonic.com/botsonic?fpr=frank67" target="_blank" rel="noopener">Start Free Trial</a>
      </div>
    `;

    articleContainer.appendChild(promptList);
    document.body.appendChild(articleContainer);
  }
});
