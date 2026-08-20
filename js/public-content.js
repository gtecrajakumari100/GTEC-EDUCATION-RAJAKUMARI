/* Public, read-only managed content. No admin credentials or write access are exposed here. */
(async () => {
  try {
    const response = await fetch(`/api/public?_t=${Date.now()}`, { cache:'no-store', headers:{ Accept:'application/json' } });
    if (!response.ok) return;
    const data = await response.json(), settings = data.settings || {}, home = data.homepage || {};
    window.GTEC_MANAGED_SETTINGS = settings;
    window.GTEC_PUBLIC_DATA = data;
    const text = (selector, value, attribute) => document.querySelectorAll(selector).forEach(el => { if (value) attribute ? el.setAttribute(attribute, value) : el.textContent = value; });
    const escape = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[char]);
    text('[data-gtec-phone]', settings.phone); text('[data-gtec-phone]', settings.phone ? `tel:${settings.phone.replace(/[^+\d]/g, '')}` : '', 'href'); text('[data-gtec-address]', settings.address); text('[data-gtec-instagram]', settings.instagram, 'href'); text('[data-gtec-facebook]', settings.facebook, 'href'); text('[data-gtec-form]', settings.form, 'href'); text('[data-gtec-maps]', settings.maps, 'href'); text('[data-gtec-sitename]', settings.siteName || 'G-TEC Education Rajakumari');
    document.querySelectorAll('.footer-grid p').forEach(paragraph => { if (settings.address && paragraph.textContent.includes('THOLANIKUNNEL PLAZA')) paragraph.textContent = settings.address; if (settings.phone && paragraph.textContent.includes('Phone:')) paragraph.textContent = `Phone: ${settings.phone}`; });
    document.querySelectorAll('a[href^="tel:"]').forEach(link => { if (settings.phone) { link.href = `tel:${settings.phone.replace(/[^+\d]/g, '')}`; if (link.textContent.trim().match(/[\d\s()+-]+/)) link.textContent = settings.phone; } });
    document.querySelectorAll('[data-gtec-whatsapp]').forEach(link => { if (settings.whatsapp) link.href = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`; });
    document.querySelectorAll('a[href*="wa.me/"]').forEach(link => { if (settings.whatsapp) link.href = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`; });
    document.querySelectorAll('a[href*="instagram.com"]').forEach(link => { if (settings.instagram) link.href = settings.instagram; }); document.querySelectorAll('a[href*="facebook.com"]').forEach(link => { if (settings.facebook) link.href = settings.facebook; }); document.querySelectorAll('a[href*="maps.app"],a[href*="google.com/maps"]').forEach(link => { if (settings.maps) link.href = settings.maps; }); document.querySelectorAll('a[href*="docs.google.com/forms"]').forEach(link => { if (settings.form) link.href = settings.form; });
    const isEmbedUrl = settings.mapsEmbed && (settings.mapsEmbed.includes('/embed') || settings.mapsEmbed.includes('output=embed'));
    if (isEmbedUrl) { document.querySelectorAll('iframe[src*="maps.google"]').forEach(frame => { frame.src = settings.mapsEmbed; }); } else { document.querySelectorAll('iframe[src*="maps.google"]').forEach(frame => { frame.src = 'https://maps.google.com/maps?q=loc:9.9688819,77.1508434+(G-TEC+Education+Rajakumari)&t=&z=17&ie=UTF8&iwloc=B&output=embed'; }); }
    document.querySelectorAll('.footer-grid').forEach(grid => { const heading = [...grid.querySelectorAll('h4')].find(node => /contact|address/i.test(node.textContent)); const parent = heading && heading.parentElement; if (!parent) return; let details = parent.querySelector('[data-gtec-managed-contact]'); if (!details && (settings.email || settings.hours)) { details = document.createElement('div'); details.dataset.gtecManagedContact = 'true'; parent.appendChild(details); } if (details) details.innerHTML = `${settings.email ? `<p style="font-size: 0.9rem; color: rgba(255,255,255,0.75); margin-top: 0.5rem;"><a data-gtec-email href="mailto:${escape(settings.email)}" style="color: inherit;">${escape(settings.email)}</a></p>` : ''}${settings.hours ? `<p data-gtec-hours style="font-size: 0.9rem; color: rgba(255,255,255,0.75); margin-top: 0.5rem;">${escape(settings.hours)}</p>` : ''}`; });
    text('[data-gtec-hero-heading]', home.heroHeading); text('[data-gtec-hero-description]', home.heroDescription); text('[data-gtec-cta]', home.ctaText); text('[data-gtec-cta]', home.ctaLink, 'href'); text('[data-gtec-hero-image]', home.heroImage, 'src');
    if (home.heroBgImage) document.querySelectorAll('[data-gtec-hero-bg], .hero, .hero-section').forEach(el => { el.style.backgroundImage = `url("${escape(home.heroBgImage)}")`; });
    const bannerRoot = document.getElementById('managed-home-banners');
    if (bannerRoot) bannerRoot.innerHTML = [home.offerBanner ? `<p class="managed-home-banner">${escape(home.offerBanner)}</p>` : '', home.announcementBanner ? `<p class="managed-home-banner">${escape(home.announcementBanner)}</p>` : ''].join('');
    
    const floatingContainer = document.getElementById('floating-offer-card');
    const activeOffersList = Array.isArray(data.offers) ? data.offers : [];
    const activeAnnouncementsList = Array.isArray(data.announcements) ? data.announcements : [];

    const activePromos = [
      ...activeOffersList.map(item => ({ ...item, isOffer: true })),
      ...activeAnnouncementsList.map(item => ({ ...item, isOffer: false }))
    ];

    const sessionDismissed = sessionStorage.getItem('gtec_floating_offer_dismissed') === 'true';

    if (floatingContainer) {
      if (activePromos.length === 0 || sessionDismissed) {
        floatingContainer.style.display = 'none';
      } else {
        let currentOfferIndex = 0;

        const renderFloatingCard = (index) => {
          const item = activePromos[index];
          if (!item) return;

          const rawWa = settings.whatsapp || '919400059100';
          const cleanWa = String(rawWa).replace(/\D/g, '') || '919400059100';
          const offerTitle = item.title || 'Special Offer';
          const waMessage = `Hi, I would like to know more details about the ${offerTitle} offer. Please share the offer details, eligibility, and admission information.`;
          const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMessage)}`;

          const targetUrl = item.buttonLink ? item.buttonLink : waUrl;
          const defaultButtonText = item.isOffer ? 'Join Now' : 'Learn More';
          const buttonText = item.buttonText || defaultButtonText;
          const buttonHtml = `<a href="${escape(targetUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm floating-offer-btn">${escape(buttonText)}</a>`;

          const imgHtml = item.image ? `<div class="floating-offer-img"><img src="${escape(item.image)}" alt="${escape(item.title)}" loading="lazy"></div>` : '';
          const badgeText = item.discount || (item.isOffer ? 'SPECIAL OFFER' : (item.date || 'ANNOUNCEMENT'));
          const priceHtml = (item.offerPrice || item.originalPrice) ? `<div class="floating-offer-prices">${item.originalPrice ? `<del>${escape(item.originalPrice)}</del>` : ''}${item.offerPrice ? `<strong>${escape(item.offerPrice)}</strong>` : ''}</div>` : '';
          const validityHtml = item.endAt ? `<div class="floating-offer-validity">⏰ Valid until ${escape(item.endAt.slice(0, 10))}</div>` : '';

          floatingContainer.innerHTML = `
            <button type="button" class="floating-offer-close" aria-label="Close offer">&times;</button>
            ${imgHtml}
            <div class="floating-offer-body">
              <span class="badge badge-gold floating-offer-badge">${escape(badgeText)}</span>
              <h4 class="floating-offer-title">${escape(item.title)}</h4>
              ${item.description ? `<p class="floating-offer-desc">${escape(item.description)}</p>` : ''}
              ${priceHtml}
              ${validityHtml}
              ${buttonHtml}
            </div>
          `;

          const closeBtn = floatingContainer.querySelector('.floating-offer-close');
          if (closeBtn) {
            closeBtn.onclick = () => {
              floatingContainer.classList.remove('active');
              sessionStorage.setItem('gtec_floating_offer_dismissed', 'true');
              setTimeout(() => { floatingContainer.style.display = 'none'; }, 400);
            };
          }
        };

        renderFloatingCard(currentOfferIndex);
        floatingContainer.style.display = 'block';

        setTimeout(() => {
          floatingContainer.classList.add('active');
        }, 600);

        if (activePromos.length > 1) {
          setInterval(() => {
            if (sessionStorage.getItem('gtec_floating_offer_dismissed') === 'true') return;
            floatingContainer.classList.remove('active');
            setTimeout(() => {
              currentOfferIndex = (currentOfferIndex + 1) % activePromos.length;
              renderFloatingCard(currentOfferIndex);
              floatingContainer.classList.add('active');
            }, 400);
          }, 6500);
        }
      }
    }

    if (Array.isArray(data.gallery) && data.gallery.length > 0) {
      const grid = document.querySelector('#gallery .gallery-grid');
      if (grid) grid.innerHTML = data.gallery.map(item => `<div class="gallery-item reveal-scale"><img src="${escape(item.image)}" alt="${escape(item.title)}" class="gallery-img" loading="lazy"><div class="gallery-overlay"><span>${escape(item.title)}</span></div></div>`).join('');
    }

    if (typeof COURSES_DATA !== 'undefined' && Array.isArray(data.courses)) {
      const staticCourses = new Map(COURSES_DATA.map(course => [course.id, course]));
      const managedCourses = data.courses.map(item => {
        const fallback = staticCourses.get(item.id) || {};
        const parsedFeatures = item.features ? item.features.split(/\r?\n/).map(x => x.trim()).filter(Boolean) : [];
        return {
          ...fallback,
          id: item.id,
          category: item.category || fallback.category || 'software',
          level: (item.classification || fallback.level || 'certificate').toLowerCase(),
          title: item.title || fallback.title || '',
          duration: item.duration || fallback.duration || 'Flexible',
          image: item.image || fallback.image || '',
          shortDesc: item.description || fallback.shortDesc || '',
          overview: item.description || fallback.overview || fallback.shortDesc || '',
          fee: item.fee || fallback.fee || '',
          features: item.features || fallback.features || '',
          enquiryLink: item.enquiryLink || fallback.enquiryLink || '',
          learnings: fallback.learnings && fallback.learnings.length ? fallback.learnings : parsedFeatures,
          skills: fallback.skills || [],
          careerRoles: fallback.careerRoles || [],
          careerPath: fallback.careerPath || [],
          certificates: fallback.certificates || []
        };
      });
      COURSES_DATA.splice(0, COURSES_DATA.length, ...managedCourses);
    }

    if (typeof CERTIFICATES_DATA !== 'undefined' && Array.isArray(data.certificates)) {
      const managedCerts = data.certificates.map(item => ({
        id: item.id,
        name: item.title,
        provider: item.provider,
        university: item.university || '',
        category: item.category || 'all',
        logo: item.image || 'assets/images/certificates/course-placeholder.svg',
        description: item.description || '',
        global: !!item.global,
        relatedCourses: item.global ? ['Available with all relevant G-TEC courses'] : (Array.isArray(item.relatedCourses) ? item.relatedCourses : String(item.relatedCourses || '').split('\n').map(x => x.trim()).filter(Boolean))
      }));
      CERTIFICATES_DATA.splice(0, CERTIFICATES_DATA.length, ...managedCerts);
    }

    window.dispatchEvent(new CustomEvent('gtec:content-loaded', { detail: data }));
  } catch (_) { /* The static public website remains usable whenever the admin server is unavailable. */ }
})();

