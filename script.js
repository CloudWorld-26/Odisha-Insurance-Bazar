/* ═══════════════════════════════════════════════════════════
   ODISHA INSURANCE BAZAR — Main JavaScript
   ═══════════════════════════════════════════════════════════ */

/* ── Carousel ── */
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const dots  = document.querySelectorAll('.dot');
  const total = 3;
  let current = 0;
  let timer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); resetTimer(); }));

  function resetTimer() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 5000); }
  resetTimer();
})();

/* ── Hamburger ── */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  document.querySelectorAll('.main-nav a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('open'))
  );
})();

/* ── Scroll-to-top ── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () =>
    btn.classList.toggle('visible', window.scrollY > 400), { passive: true }
  );
})();

/* ── Header shadow on scroll ── */
window.addEventListener('scroll', () => {
  document.getElementById('header').style.boxShadow =
    window.scrollY > 10 ? '0 4px 24px rgba(6,49,77,.14)' : '';
}, { passive: true });

/* ── Product dropdown population ── */
const productsByType = {
  life: [
    'Term Life Insurance',
    'Whole Life Insurance',
    'Endowment Plan',
    'Money Back Policy',
    'ULIP (Unit Linked Insurance)',
    'Child Education Plan',
    'Retirement / Pension Plan',
    'Group Life Insurance'
  ],
  general: [
    'Motor Insurance (Car)',
    'Two-Wheeler Insurance',
    'Home Insurance',
    'Travel Insurance',
    'Marine Insurance',
    'Fire Insurance',
    'Commercial Vehicle Insurance',
    'Crop / Agriculture Insurance'
  ],
  health: [
    'Individual Health Plan',
    'Family Floater Plan',
    'Senior Citizen Health Plan',
    'Critical Illness Cover',
    'Top-Up / Super Top-Up',
    'Personal Accident Cover',
    'Group Health Insurance',
    'OPD / Maternity Cover'
  ]
};

document.getElementById('insType').addEventListener('change', function () {
  const prodSel = document.getElementById('insProduct');
  const products = productsByType[this.value] || [];
  prodSel.innerHTML = products.length
    ? '<option value="">— Select a Product —</option>' +
      products.map(p => `<option value="${p}">${p}</option>`).join('')
    : '<option value="">— Select Insurance Type First —</option>';
});

/* ── Coverage Range Display ── */
document.getElementById('coverageRange').addEventListener('input', function () {
  const val = +this.value;
  const display = val >= 100 ? `₹${val / 100} Crore` : `₹${val} Lakh`;
  document.getElementById('coverageDisplay').textContent = display;
});

/* ── Premium Calculator Engine ── */
const basePremiums = {
  life: [
    { company: 'LIC of India',        plan: 'Jeevan Amar Term Plan',      base: 8500,  rating: 5 },
    { company: 'SBI Life Insurance',   plan: 'eShield Next',               base: 7800,  rating: 5 },
    { company: 'HDFC Life Insurance',  plan: 'Click 2 Protect Life',       base: 9200,  rating: 4 },
    { company: 'ICICI Prudential',     plan: 'iProtect Smart',             base: 8100,  rating: 5 },
    { company: 'Max Life Insurance',   plan: 'Smart Secure Plus',          base: 7600,  rating: 4 },
    { company: 'Tata AIA Life',        plan: 'Sampoorna Raksha Supreme',   base: 8300,  rating: 4 }
  ],
  general: [
    { company: 'HDFC ERGO',            plan: 'Comprehensive Motor Plan',   base: 4200,  rating: 5 },
    { company: 'ICICI Lombard',        plan: 'Complete Home Cover',        base: 3800,  rating: 5 },
    { company: 'Bajaj Allianz',        plan: 'Travel Companion',           base: 3500,  rating: 4 },
    { company: 'New India Assurance',  plan: 'Griha Suraksha',             base: 4000,  rating: 4 },
    { company: 'Tata AIG',             plan: 'Car Secure Policy',          base: 4100,  rating: 4 },
    { company: 'United India',         plan: 'Commercial Package',         base: 3600,  rating: 3 }
  ],
  health: [
    { company: 'Star Health',          plan: 'Comprehensive Plan',         base: 12000, rating: 5 },
    { company: 'Care Health',          plan: 'Care Supreme',               base: 11000, rating: 5 },
    { company: 'Niva Bupa',            plan: 'ReAssure 2.0',               base: 10500, rating: 4 },
    { company: 'ManipalCigna',         plan: 'Prime Senior',               base: 13500, rating: 4 },
    { company: 'Aditya Birla Health',  plan: 'Activ Health Platinum',      base: 11800, rating: 5 },
    { company: 'HDFC ERGO Health',     plan: 'Optima Secure',              base: 10800, rating: 4 }
  ]
};

function calculatePremiums() {
  const type     = document.getElementById('insType').value;
  const age      = parseInt(document.getElementById('ageInput').value) || 30;
  const coverage = parseInt(document.getElementById('coverageRange').value);
  const members  = parseInt(document.getElementById('familyMembers').value) || 1;

  if (!type) {
    alert('Please select an Insurance Type to compare premiums.');
    return;
  }

  const data = basePremiums[type];

  // Apply actuarial-style multipliers
  const ageMultiplier      = age < 30 ? 0.85 : age < 40 ? 1.0 : age < 50 ? 1.35 : 1.75;
  const coverageMultiplier = coverage / 10;
  const memberMultiplier   = members === 1 ? 1.0 : members === 2 ? 1.5 : members === 3 ? 1.85 : members === 4 ? 2.2 : 2.5;

  const rows = data
    .map(d => ({
      ...d,
      premium: Math.round(d.base * ageMultiplier * (coverageMultiplier / 10 + 0.5) * memberMultiplier)
    }))
    .sort((a, b) => a.premium - b.premium);

  const tbody = document.getElementById('premiumTableBody');
  tbody.innerHTML = rows.map((r, i) => `
    <tr>
      <td><strong>${r.company}</strong></td>
      <td style="color:var(--gray-500);font-size:0.8rem">${r.plan}</td>
      <td class="price">₹${r.premium.toLocaleString('en-IN')}/yr${i === 0 ? '<span class="best-tag">Best</span>' : ''}</td>
      <td><span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span></td>
    </tr>
  `).join('');

  document.getElementById('resultPlaceholder').style.display = 'none';
  document.getElementById('resultTable').style.display = 'block';

  // Update Google Form URL with pre-filled params (replace with real form URL)
  const formUrl = `https://script.google.com/macros/s/AKfycbw2MA3qQC3iCWqfkAmxtQhUplw5pZPIgbNy1PcjoefZpuHP8BDzB4wCpymI6ROdFyE8/exec`
    + `&entry.INSURANCE_TYPE=${encodeURIComponent(type)}`
    + `&entry.AGE=${age}`
    + `&entry.COVERAGE=${coverage}`;
  document.getElementById('quotationBtn').href = formUrl;

  // Smooth scroll to results
  document.getElementById('resultTable').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Newsletter Subscription ── */
function subscribeNewsletter() {
  const emailInput = document.getElementById('newsletterEmail');
  const msgEl      = document.getElementById('newsletterMsg');
  const email      = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    msgEl.style.color = '#F87171';
    msgEl.textContent = 'Please enter your email address.';
    return;
  }
  if (!emailRegex.test(email)) {
    msgEl.style.color = '#F87171';
    msgEl.textContent = 'Please enter a valid email address.';
    return;
  }

  // In production: POST to your Google Sheets or email service endpoint
  msgEl.style.color = '#34D399';
  msgEl.textContent = '✓ Subscribed! Thank you for joining.';
  emailInput.value = '';

  setTimeout(() => { msgEl.textContent = ''; }, 4000);
}

/* ── Intersection Observer for Fade-In ── */
(function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll('.company-card, .product-card, .about-stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  });
})();

/* ── Smooth Active Nav Link Highlight ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => {
            a.style.color = '';
            a.style.background = '';
          });
          const active = document.querySelector(`.main-nav a[href="#${e.target.id}"]`);
          if (active && !active.classList.contains('btn-login')) {
            active.style.color = 'var(--blue)';
            active.style.background = 'var(--gray-50)';
          }
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => io.observe(s));
})();
