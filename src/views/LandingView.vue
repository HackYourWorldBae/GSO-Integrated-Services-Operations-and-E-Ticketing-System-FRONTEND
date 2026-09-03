<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobileMenuOpen = ref(false);

// Services — semantically accurate single SVG path per service (Heroicons v1 outline)
const services = [
  {
    title: 'Facilities & Grounds',
    unit: 'FGMU',
    description: 'Submit maintenance, repair, and facilities requests for campus buildings and grounds.',
    svcClass: 'svc-green',
    // Heroicons outline: office-building
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    title: 'Landscaping & Aesthetics',
    unit: 'LEAU',
    description: 'Request grounds maintenance, landscaping, sanitation, and environmental aesthetic services.',
    svcClass: 'svc-gold',
    // Heroicons outline: sun (outdoor / nature)
    iconPath: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    title: 'Security Services',
    unit: 'SSU',
    description: 'Request security assistance, campus safety coordination, and official incident reporting.',
    svcClass: 'svc-slate',
    // Heroicons outline: shield-check
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
];

const goToLogin = () => router.push({ name: 'login' });

// ── Project Announcements ──
const landingProjects = ref([]);
const landingProjectsLoading = ref(false);

const fetchLandingProjects = async () => {
  landingProjectsLoading.value = true;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`);
    const data = await res.json();
    if (res.ok) landingProjects.value = data.data?.projects || [];
  } catch (e) {
    console.error('Failed to load landing projects', e);
  } finally {
    landingProjectsLoading.value = false;
  }
};

const _today = new Date();
_today.setHours(0, 0, 0, 0);

const landingActive = computed(() =>
  landingProjects.value.filter(p => p.status === 'processing' && p.current_step >= 5)
);

const landingUpcoming = computed(() =>
  landingProjects.value.filter(
    p => p.status === 'pending' || p.status === 'approved' ||
    (p.status === 'processing' && p.current_step < 5)
  )
);

const unitLabel = (unitId) => {
  const map = { 1: 'FGMU', 2: 'LEAU', 3: 'SSU' };
  return map[Number(unitId)] || 'GSO';
};

const isActiveProject = (project) =>
  project.status === 'processing' && project.current_step >= 5;

const formatLandingDate = (d) => {
  if (!d) return 'TBD';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatLandingProjectNumber = (id) => {
  if (!id) return '';
  const s = String(id);
  if (s.includes('PRJ')) return s;
  return `Project #${s}`;
};

onMounted(fetchLandingProjects);
</script>

<template>
  <div class="landing-page">

    <!-- ===================== NAVBAR ===================== -->
    <nav class="navbar">
      <div class="navbar-inner">
        <!-- Brand -->
        <div class="navbar-brand">
          <div class="navbar-logo-ring">
            <img src="/bsu-logo.png" alt="BSU Logo" class="navbar-logo-img" />
          </div>
          <div class="navbar-text">
            <span class="navbar-title">Benguet State University</span>
            <span class="navbar-subtitle">General Services Office</span>
          </div>
        </div>

        <!-- Desktop links -->
        <ul class="nav-links" role="list">
          <li><a href="#about" class="nav-link">About</a></li>
          <li><router-link to="/projects" class="nav-link">Projects</router-link></li>
          <li><a href="#services" class="nav-link">Services</a></li>
        </ul>

        <!-- Login button -->
        <button id="nav-login-btn" class="btn-nav-login" @click="goToLogin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Login
        </button>

        <!-- Hamburger -->
        <button class="hamburger" @click="isMobileMenuOpen = !isMobileMenuOpen"
                aria-label="Toggle navigation" :aria-expanded="String(isMobileMenuOpen)">
          <span :class="{ open: isMobileMenuOpen }"></span>
          <span :class="{ open: isMobileMenuOpen }"></span>
          <span :class="{ open: isMobileMenuOpen }"></span>
        </button>
      </div>

      <!-- Mobile menu -->
      <div class="mobile-menu" :class="{ 'mobile-menu--open': isMobileMenuOpen }">
        <a href="#about" @click="isMobileMenuOpen = false">About</a>
        <router-link to="/projects" @click="isMobileMenuOpen = false">Projects</router-link>
        <a href="#services" @click="isMobileMenuOpen = false">Services</a>
        <button class="btn-mobile-login" @click="goToLogin">Login to Portal</button>
      </div>
    </nav>

    <!-- ===================== HERO ===================== -->
    <section class="hero" aria-labelledby="hero-heading">
      <!-- Dot-grid background pattern -->
      <div class="hero-pattern" aria-hidden="true"></div>
      <!-- Gold accent line -->
      <div class="hero-gold-bar" aria-hidden="true"></div>

      <div class="hero-inner">
        <!-- Left: Text content -->
        <div class="hero-content">
          <div class="hero-eyebrow">
            <span class="hero-eyebrow-line" aria-hidden="true"></span>
            <span class="hero-eyebrow-text">Benguet State University</span>
          </div>

          <p class="hero-office-tag">General Services Office</p>

          <h1 id="hero-heading" class="hero-heading">
            e-Ticketing<br>
            <span class="hero-heading-accent">Service Portal</span>
          </h1>

          <p class="hero-subtext">
            The official digital platform for submitting, monitoring, and managing campus service
            requests across all GSO units — designed for transparency, accountability,
            and efficient campus operations.
          </p>

          <div class="hero-actions">
            <button id="hero-login-btn" class="btn-primary" @click="goToLogin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Login to Portal
            </button>
            <a href="#services" class="btn-ghost">
              Explore Services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Right: Ticket preview card -->
        <div class="hero-card" aria-label="Sample service ticket statuses">
          <div class="hero-card-header">
            <span class="hero-card-dot" aria-hidden="true"></span>
            <span class="hero-card-title">GSO e-Ticket Portal</span>
            <span class="hero-card-live" aria-label="Live system">LIVE</span>
          </div>
          <div class="hero-card-body">
            <div class="ticket-item ticket-item--active">
              <div class="ticket-status-icon icon-processing" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ticket-details">
                <span class="ticket-title">Electrical Repair — Admin Bldg.</span>
                <span class="ticket-meta">FGMU · Ticket #2051</span>
              </div>
              <span class="ticket-badge badge-processing">In Progress</span>
            </div>

            <div class="ticket-item">
              <div class="ticket-status-icon icon-pending" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ticket-details">
                <span class="ticket-title">Incident Report — Main Campus</span>
                <span class="ticket-meta">SSU · Ticket #2052</span>
              </div>
              <span class="ticket-badge badge-pending">Pending</span>
            </div>

            <div class="ticket-item">
              <div class="ticket-status-icon icon-done" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="ticket-details">
                <span class="ticket-title">Grounds Mowing — Science Bldg.</span>
                <span class="ticket-meta">LEAU · Ticket #2049</span>
              </div>
              <span class="ticket-badge badge-done">Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== ABOUT ===================== -->
    <section id="about" class="about-section" aria-labelledby="about-heading">
      <div class="section-container">
        <div class="about-grid">
          <!-- Left: text -->
          <div class="about-text">
            <span class="section-eyebrow">About the GSO</span>
            <h2 id="about-heading" class="section-heading">Serving BSU with Excellence</h2>
            <p class="about-body">
              The General Services Office (GSO) is the backbone of Benguet State University's
              operational infrastructure — overseeing facilities, security, grounds, and
              transportation to ensure a safe and conducive environment for learning.
            </p>
            <p class="about-body">
              Our e-Ticketing portal streamlines service requests, enabling BSU staff and
              faculty to submit, track, and receive updates digitally — eliminating paperwork
              and reducing response times.
            </p>
            <ul class="about-highlights" role="list">
              <li class="highlight-item">
                <span class="highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </span>
                <span>Fully paperless request processing</span>
              </li>
              <li class="highlight-item">
                <span class="highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <span>Real-time status tracking per request</span>
              </li>
              <li class="highlight-item">
                <span class="highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <span>Secure access for BSU staff and faculty</span>
              </li>
            </ul>
          </div>

          <!-- Right: stat grid -->
          <div class="about-stats" aria-label="GSO key facts">
            <div class="stat-card">
              <span class="stat-value">4</span>
              <span class="stat-label">Service Units</span>
            </div>
            <div class="stat-card stat-card--gold">
              <span class="stat-value">100%</span>
              <span class="stat-label">Paperless Process</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">24/7</span>
              <span class="stat-label">Portal Access</span>
            </div>
            <div class="stat-card stat-card--dark">
              <span class="stat-value">BSU</span>
              <span class="stat-label">Official Digital Portal</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SERVICES ===================== -->
    <section id="services" class="services-section" aria-labelledby="services-heading">
      <div class="section-container">
        <div class="section-header">
          <span class="section-eyebrow">Our Services</span>
          <h2 id="services-heading" class="section-heading">What We Offer</h2>
          <p class="section-desc">
            Four specialized units covering every aspect of campus operations,
            accessible through a single integrated digital platform.
          </p>
        </div>

        <div class="services-grid">
          <div
            v-for="service in services"
            :key="service.unit"
            class="service-card"
            :class="service.svcClass"
          >
            <div class="service-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path :d="service.iconPath" />
              </svg>
            </div>
            <span class="service-unit-tag">{{ service.unit }}</span>
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-desc-text">{{ service.description }}</p>
            <button class="service-cta" @click="goToLogin">
              Submit a Request
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== PROJECT ANNOUNCEMENTS ===================== -->
    <section v-if="landingProjects.length > 0" class="projects-section"
             aria-labelledby="projects-heading">
      <div class="section-container">
        <div class="projects-header">
          <div>
            <span class="section-eyebrow">Campus Projects</span>
            <h2 id="projects-heading" class="section-heading">Official Project Notices</h2>
            <p class="projects-desc">
              Stay informed about ongoing and upcoming facility maintenance and grounds projects
              across the BSU campus.
            </p>
          </div>
          <div class="projects-counts">
            <div class="count-pill count-pill--active">
              <span class="count-dot" aria-hidden="true"></span>
              <strong>{{ landingActive.length }}</strong>
              <span>Active</span>
            </div>
            <div class="count-pill count-pill--upcoming">
              <span class="count-dot upcoming-dot" aria-hidden="true"></span>
              <strong>{{ landingUpcoming.length }}</strong>
              <span>Upcoming</span>
            </div>
            <router-link to="/projects" class="btn-view-all">
              View All
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>

        <div class="projects-list">
          <div
            v-for="(project, index) in landingProjects.slice(0, 3)"
            :key="project.id"
            class="project-row"
            :class="isActiveProject(project) ? 'project-row--active' : 'project-row--upcoming'"
            :style="{ animationDelay: `${index * 80}ms` }"
          >
            <div class="project-row-meta">
              <span class="project-status-badge"
                    :class="isActiveProject(project) ? 'badge-active' : 'badge-upcoming'">
                <span class="badge-dot" aria-hidden="true"></span>
                {{ isActiveProject(project) ? 'Active' : 'Upcoming' }}
              </span>
              <span class="project-unit-tag">{{ unitLabel(project.unit_id) }}</span>
              <span class="project-date-text">{{ formatLandingDate(project.submitted_at) }}</span>
            </div>
            <h4 class="project-title">{{ project.project_title }}</h4>
            <div class="project-location-row">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                   class="project-loc-icon" aria-hidden="true">
                <path fill-rule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd" />
              </svg>
              <span>{{ project.location || 'BSU Main Campus' }}</span>
              <span class="project-target-chip">
                Target: {{ formatLandingDate(project.project_target_date) }}
              </span>
            </div>
          </div>

          <router-link v-if="landingProjects.length > 3" to="/projects" class="projects-show-more">
            View all {{ landingProjects.length }} project announcements
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ===================== CTA ===================== -->
    <section class="cta-section" aria-label="Call to action — login to portal">
      <div class="section-container cta-inner">
        <div class="cta-text">
          <h2 class="cta-heading">Ready to submit a service request?</h2>
          <p class="cta-subtext">
            Log in with your BSU staff account to access the full GSO e-Ticketing portal.
          </p>
        </div>
        <button id="cta-login-btn" class="btn-primary btn-primary--large" @click="goToLogin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          Login Now
        </button>
      </div>
    </section>

    <!-- ===================== FOOTER ===================== -->
    <footer id="contact" class="footer" aria-label="Site footer">
      <div class="section-container footer-inner">
        <div class="footer-brand">
          <div class="footer-logo-ring">
            <img src="/bsu-logo.png" alt="Benguet State University Logo" class="footer-logo-img" />
          </div>
          <div>
            <div class="footer-title">Benguet State University</div>
            <div class="footer-subtitle">General Services Office</div>
            <div class="footer-contact">gso@bsu.edu.ph</div>
          </div>
        </div>

        <div class="footer-links-group">
          <div class="footer-links-col">
            <span class="footer-col-title">Navigation</span>
            <a href="#about">About GSO</a>
            <a href="#services">Services</a>
            <router-link to="/projects">Projects</router-link>
          </div>
          <div class="footer-links-col">
            <span class="footer-col-title">Service Units</span>
            <span>FGMU — Facilities &amp; Grounds</span>
            <span>LEAU — Landscaping &amp; Aesthetics</span>
            <span>SSU — Security Services</span>
          </div>
          <div class="footer-links-col">
            <span class="footer-col-title">Portal Access</span>
            <a href="#" @click.prevent="goToLogin">Staff Login</a>
            <a href="https://www.bsu.edu.ph" target="_blank" rel="noopener noreferrer">
              BSU Official Website
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} Benguet State University — General Services Office</span>
        <span>La Trinidad, Benguet, Philippines</span>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ============================================================
   FONT IMPORT — EB Garamond (display) + Inter (UI)
   ============================================================ */
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
.landing-page {
  /* Brand */
  --bsu-green:        #1a6b35;
  --bsu-green-light:  #24903f;
  --bsu-green-dark:   #0f4221;
  --bsu-green-deep:   #071e0f;
  --bsu-gold:         #c8a800;
  --bsu-gold-light:   #f0cc00;
  --bsu-gold-dark:    #9a8000;

  /* Surfaces */
  --surface:          #ffffff;
  --surface-2:        #f8faf9;
  --surface-3:        #f0f5f2;

  /* Text */
  --text-primary:     #0d1f15;
  --text-secondary:   #2d5040;
  --text-muted:       #5a7a65;
  --text-subtle:      #8ca89a;

  /* Borders */
  --border:           rgba(26, 107, 53, 0.13);
  --border-strong:    rgba(26, 107, 53, 0.26);

  /* Typography */
  --font-display:     'EB Garamond', Georgia, serif;
  --font-ui:          'Inter', 'Segoe UI', system-ui, sans-serif;

  /* Spacing (4px base) */
  --sp-1:  0.25rem;
  --sp-2:  0.5rem;
  --sp-3:  0.75rem;
  --sp-4:  1rem;
  --sp-6:  1.5rem;
  --sp-8:  2rem;
  --sp-12: 3rem;
  --sp-16: 4rem;
  --sp-24: 6rem;

  /* Radii */
  --r-sm:   6px;
  --r-md:   12px;
  --r-lg:   16px;
  --r-xl:   20px;
  --r-pill: 100px;

  font-family: var(--font-ui);
  color: var(--text-primary);
  background: var(--surface);
  overflow-x: hidden;
}

/* ============================================================
   NAVBAR
   ============================================================ */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--sp-8);
  height: 64px;
  display: flex;
  align-items: center;
  gap: var(--sp-8);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-shrink: 0;
}

.navbar-logo-ring {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.navbar-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navbar-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.navbar-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--bsu-green-dark);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.2;
}

.navbar-subtitle {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--bsu-gold-dark);
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0 0 0 auto;
  padding: 0;
  gap: var(--sp-6);
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: var(--sp-2) 0;
  position: relative;
  transition: color 0.2s ease;
  letter-spacing: 0.01em;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  height: 2px;
  background: var(--bsu-gold);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.22s ease;
}

.nav-link:hover { color: var(--bsu-green-dark); }
.nav-link:hover::after,
.nav-link.router-link-active::after { transform: scaleX(1); }

.btn-nav-login {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--bsu-green);
  color: white;
  border: none;
  padding: 0.52rem 1.1rem;
  border-radius: var(--r-md);
  font-family: var(--font-ui);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-nav-login svg { width: 15px; height: 15px; }

.btn-nav-login:hover {
  background: var(--bsu-green-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(26, 107, 53, 0.28);
}

.btn-nav-login:active { transform: translateY(0); }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--bsu-green);
  border-radius: 2px;
  transition: all 0.25s ease;
  transform-origin: center;
}

.hamburger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger span.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  background: white;
  border-top: 1px solid var(--border);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.mobile-menu--open {
  max-height: 400px;
  padding: var(--sp-4) var(--sp-8) var(--sp-6);
}

.mobile-menu a {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
}

.btn-mobile-login {
  margin-top: var(--sp-4);
  width: 100%;
  background: var(--bsu-green);
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: var(--r-md);
  font-family: var(--font-ui);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-mobile-login:hover { background: var(--bsu-green-dark); }

/* ============================================================
   HERO
   ============================================================ */
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--bsu-green-deep);
  padding-top: 64px;
}

/* Dot-grid overlay */
.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(200, 168, 0, 0.09) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

/* Gold accent line just below navbar */
.hero-gold-bar {
  position: absolute;
  top: 64px; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--bsu-gold) 0%, var(--bsu-gold-light) 35%, transparent 80%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem var(--sp-8) 6rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  width: 100%;
}

/* Eyebrow */
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-3);
  animation: fadeSlideUp 0.5s ease both;
}

.hero-eyebrow-line {
  width: 28px;
  height: 2px;
  background: var(--bsu-gold);
  flex-shrink: 0;
}

.hero-eyebrow-text {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
}

/* Office tag */
.hero-office-tag {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--bsu-gold-light);
  letter-spacing: 0.03em;
  margin-bottom: var(--sp-4);
  animation: fadeSlideUp 0.5s 0.06s ease both;
}

/* Main heading */
.hero-heading {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5.5vw, 5rem);
  font-weight: 800;
  line-height: 1.08;
  color: white;
  margin: 0 0 var(--sp-6);
  animation: fadeSlideUp 0.55s 0.1s ease both;
  letter-spacing: -0.01em;
}

.hero-heading-accent {
  color: var(--bsu-gold-light);
  position: relative;
}

.hero-heading-accent::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--bsu-gold-light), transparent);
  border-radius: 2px;
  animation: lineExpand 0.7s 0.6s ease both;
  transform-origin: left;
}

@keyframes lineExpand {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

/* Subtext */
.hero-subtext {
  color: rgba(255, 255, 255, 0.58);
  font-size: clamp(0.875rem, 1.3vw, 1rem);
  line-height: 1.85;
  max-width: 460px;
  margin: 0 0 var(--sp-8);
  animation: fadeSlideUp 0.55s 0.15s ease both;
}

/* CTA row */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  animation: fadeSlideUp 0.55s 0.2s ease both;
}

/* ── Shared Buttons ── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: linear-gradient(135deg, var(--bsu-gold) 0%, var(--bsu-gold-light) 100%);
  color: var(--bsu-green-deep);
  border: none;
  padding: 0.82rem 1.7rem;
  border-radius: var(--r-md);
  font-family: var(--font-ui);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  text-decoration: none;
  letter-spacing: 0.01em;
  box-shadow: 0 6px 20px rgba(200, 168, 0, 0.32);
}

.btn-primary svg { width: 16px; height: 16px; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200, 168, 0, 0.42); }
.btn-primary:active { transform: translateY(0); }

.btn-primary--large {
  padding: 0.95rem 2.1rem;
  font-size: 0.95rem;
  border-radius: var(--r-lg);
  flex-shrink: 0;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 0.82rem 1.5rem;
  border-radius: var(--r-md);
  font-family: var(--font-ui);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  text-decoration: none;
}

.btn-ghost svg { width: 15px; height: 15px; }
.btn-ghost:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.28); }

/* ── Hero Card ── */
.hero-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--r-xl);
  overflow: hidden;
  animation: fadeSlideLeft 0.65s 0.2s ease both;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
}

@keyframes fadeSlideLeft {
  from { opacity: 0; transform: translateX(28px); }
  to   { opacity: 1; transform: translateX(0); }
}

.hero-card-header {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1.2rem;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.hero-card-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bsu-gold);
  animation: dotPulse 2.4s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.hero-card-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.06em;
}

.hero-card-live {
  margin-left: auto;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.14);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 0.12rem 0.42rem;
  border-radius: var(--r-sm);
}

.hero-card-body {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.ticket-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--r-md);
  padding: 0.82rem;
  opacity: 0;
  animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: background 0.2s ease;
}

.ticket-item:nth-child(1) { animation-delay: 0.5s; }
.ticket-item:nth-child(2) { animation-delay: 0.65s; }
.ticket-item:nth-child(3) { animation-delay: 0.8s; }

.ticket-item:hover { background: rgba(255, 255, 255, 0.07); }

.ticket-item--active {
  background: rgba(200, 168, 0, 0.06);
  border-color: rgba(200, 168, 0, 0.16);
}

.ticket-item--active:hover { background: rgba(200, 168, 0, 0.1); }

.ticket-status-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ticket-status-icon svg { width: 15px; height: 15px; }

.icon-processing { background: rgba(240, 204, 0, 0.18); color: #f0cc00; }
.icon-pending    { background: rgba(148, 163, 184, 0.18); color: #94a3b8; }
.icon-done       { background: rgba(34, 197, 94, 0.18); color: #22c55e; }

.ticket-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ticket-title {
  font-size: 0.77rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-meta {
  font-size: 0.64rem;
  color: rgba(255, 255, 255, 0.35);
}

.ticket-badge {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.16rem 0.48rem;
  border-radius: var(--r-pill);
  white-space: nowrap;
  flex-shrink: 0;
}

.badge-processing { background: rgba(240, 204, 0, 0.18); color: #f0cc00; }
.badge-pending    { background: rgba(148, 163, 184, 0.14); color: #94a3b8; }
.badge-done       { background: rgba(34, 197, 94, 0.18); color: #22c55e; }

/* ============================================================
   SHARED SECTION UTILITIES
   ============================================================ */
.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--sp-8);
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bsu-green);
  background: rgba(26, 107, 53, 0.08);
  padding: 0.28rem 0.82rem;
  border-radius: var(--r-pill);
  border: 1px solid rgba(26, 107, 53, 0.16);
  margin-bottom: var(--sp-4);
}

.section-heading {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.6rem);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--sp-4);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.section-header {
  text-align: center;
  margin-bottom: var(--sp-16);
}

.section-desc {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.75;
}

/* ============================================================
   ABOUT SECTION
   ============================================================ */
.about-section {
  padding: var(--sp-24) 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.about-text .section-heading { text-align: left; }

.about-body {
  color: var(--text-muted);
  line-height: 1.85;
  font-size: 0.97rem;
  margin-bottom: var(--sp-4);
}

.about-highlights {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-top: var(--sp-6);
  list-style: none;
  padding: 0;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.highlight-icon {
  width: 28px;
  height: 28px;
  background: rgba(26, 107, 53, 0.08);
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--bsu-green);
}

.highlight-icon svg { width: 15px; height: 15px; }

/* Stat grid */
.about-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
}

.stat-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  transition: box-shadow 0.2s ease;
}

.stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

.stat-card--gold {
  background: rgba(200, 168, 0, 0.05);
  border-color: rgba(200, 168, 0, 0.2);
}

.stat-card--dark {
  background: var(--bsu-green-dark);
  border-color: transparent;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--bsu-green);
  line-height: 1;
}

.stat-card--gold  .stat-value { color: var(--bsu-gold-dark); }
.stat-card--dark  .stat-value { color: rgba(255, 255, 255, 0.92); }

.stat-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  line-height: 1.45;
}

.stat-card--dark .stat-label { color: rgba(255, 255, 255, 0.5); }

/* ============================================================
   SERVICES SECTION
   ============================================================ */
.services-section {
  padding: var(--sp-24) 0;
  background: var(--surface-2);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.4rem;
}

.service-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid transparent;
  border-radius: var(--r-lg);
  padding: 2rem;
  position: relative;
  transition: box-shadow 0.22s ease, border-color 0.22s ease;
}

/* Per-unit accent colors */
.svc-green { border-left-color: var(--bsu-green); }
.svc-gold  { border-left-color: var(--bsu-gold); }
.svc-slate { border-left-color: #64748b; }
.svc-teal  { border-left-color: var(--bsu-green-dark); }

.service-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);
  border-color: var(--border-strong);
}

/* Reset left border-color on hover to keep unit color */
.svc-green:hover { border-left-color: var(--bsu-green); }
.svc-gold:hover  { border-left-color: var(--bsu-gold); }
.svc-slate:hover { border-left-color: #64748b; }
.svc-teal:hover  { border-left-color: var(--bsu-green-dark); }

/* Icon wrap */
.service-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sp-4);
  background: rgba(26, 107, 53, 0.08);
  color: var(--bsu-green);
}

.svc-gold  .service-icon-wrap { background: rgba(200, 168, 0, 0.1);    color: var(--bsu-gold-dark); }
.svc-slate .service-icon-wrap { background: rgba(100, 116, 139, 0.1);  color: #475569; }
.svc-teal  .service-icon-wrap { background: rgba(13, 66, 33, 0.1);     color: var(--bsu-green-dark); }

.service-icon-wrap svg { width: 24px; height: 24px; }

/* Unit tag */
.service-unit-tag {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bsu-green);
  background: rgba(26, 107, 53, 0.08);
  padding: 0.16rem 0.52rem;
  border-radius: var(--r-pill);
  border: 1px solid rgba(26, 107, 53, 0.16);
  margin-bottom: var(--sp-3);
}

.svc-gold  .service-unit-tag { color: var(--bsu-gold-dark); background: rgba(200,168,0,0.08); border-color: rgba(200,168,0,0.2); }
.svc-slate .service-unit-tag { color: #475569; background: rgba(100,116,139,0.08); border-color: rgba(100,116,139,0.18); }
.svc-teal  .service-unit-tag { color: var(--bsu-green-dark); background: rgba(13,66,33,0.08); border-color: rgba(13,66,33,0.16); }

.service-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--sp-3);
  line-height: 1.3;
}

.service-desc-text {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.75;
  margin: 0 0 var(--sp-6);
}

.service-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: none;
  border: none;
  color: var(--bsu-green);
  font-family: var(--font-ui);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: gap 0.2s ease, color 0.2s ease;
}

.service-cta svg { width: 14px; height: 14px; }
.service-cta:hover { color: var(--bsu-green-dark); gap: var(--sp-3); }

.svc-gold  .service-cta         { color: var(--bsu-gold-dark); }
.svc-gold  .service-cta:hover   { color: #7a6000; }
.svc-slate .service-cta         { color: #475569; }
.svc-slate .service-cta:hover   { color: #334155; }
.svc-teal  .service-cta         { color: var(--bsu-green-dark); }
.svc-teal  .service-cta:hover   { color: var(--bsu-green-deep); }

/* ============================================================
   PROJECT ANNOUNCEMENTS
   ============================================================ */
.projects-section {
  padding: var(--sp-16) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.projects-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-6);
  margin-bottom: var(--sp-8);
  flex-wrap: wrap;
}

.projects-header .section-heading { margin-bottom: var(--sp-3); }

.projects-desc {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 420px;
}

.projects-counts {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.count-pill {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 0.42rem 0.85rem;
  border-radius: var(--r-pill);
  border: 1px solid;
  font-size: 0.8rem;
}

.count-pill strong { font-weight: 700; color: var(--text-primary); }
.count-pill span:last-child { color: var(--text-muted); }

.count-pill--active   { background: #f0fdf4; border-color: #bbf7d0; }
.count-pill--upcoming { background: #fefce8; border-color: #fde68a; }

.count-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.55);
  flex-shrink: 0;
}

.upcoming-dot { background: #f59e0b; box-shadow: 0 0 5px rgba(245, 158, 11, 0.55); }

.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  background: var(--bsu-green);
  color: white;
  font-family: var(--font-ui);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem 1.05rem;
  border-radius: var(--r-md);
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}

.btn-view-all svg { width: 13px; height: 13px; }
.btn-view-all:hover { background: var(--bsu-green-dark); transform: translateY(-1px); }

/* Project rows */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.project-row {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid transparent;
  border-radius: var(--r-md);
  padding: 1.1rem 1.25rem;
  transition: box-shadow 0.2s ease, transform 0.18s ease;
  animation: fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.project-row--active   { border-left-color: #22c55e; }
.project-row--upcoming { border-left-color: #f59e0b; }

.project-row:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.project-row-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
  flex-wrap: wrap;
}

.project-status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: var(--r-pill);
  padding: 0.14rem 0.48rem;
  border: 1px solid;
}

.badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.7; }
.badge-active   { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
.badge-upcoming { background: #fefce8; color: #92400e; border-color: #fde68a; }

.project-unit-tag {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--bsu-green);
  background: rgba(26, 107, 53, 0.07);
  border: 1px solid rgba(26, 107, 53, 0.14);
  border-radius: var(--r-pill);
  padding: 0.08rem 0.42rem;
  letter-spacing: 0.06em;
}

.project-date-text {
  font-size: 0.64rem;
  color: var(--text-subtle);
  margin-left: auto;
}

.project-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--sp-2);
  letter-spacing: -0.01em;
  line-height: 1.35;
}

.project-location-row {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: 0.78rem;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.project-loc-icon { width: 12px; height: 12px; color: var(--bsu-green); flex-shrink: 0; }

.project-target-chip {
  background: var(--surface-2);
  border-radius: var(--r-sm);
  padding: 0.08rem 0.42rem;
  font-size: 0.63rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: var(--sp-2);
}

.projects-show-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--bsu-green);
  padding: 0.85rem;
  border: 1px dashed rgba(26, 107, 53, 0.24);
  border-radius: var(--r-md);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  margin-top: var(--sp-1);
}

.projects-show-more svg { width: 14px; height: 14px; }
.projects-show-more:hover { background: rgba(26, 107, 53, 0.05); color: var(--bsu-green-dark); }

/* ============================================================
   CTA SECTION
   ============================================================ */
.cta-section {
  padding: var(--sp-16) 0;
  background: var(--bsu-green-dark);
  position: relative;
  overflow: hidden;
}

/* Subtle dot-grid on dark bg */
.cta-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(200, 168, 0, 0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-8);
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.cta-text { flex: 1; min-width: 260px; }

.cta-heading {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.15rem);
  font-weight: 700;
  color: white;
  margin: 0 0 var(--sp-3);
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.cta-subtext {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.95rem;
  line-height: 1.72;
  margin: 0;
}

/* ============================================================
   FOOTER
   ============================================================ */
.footer {
  background: var(--bsu-green-deep);
  color: rgba(255, 255, 255, 0.72);
  padding: var(--sp-16) 0 0;
}

.footer-inner {
  display: flex;
  gap: var(--sp-16);
  flex-wrap: wrap;
  padding-bottom: var(--sp-12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.footer-brand {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
  flex: 1;
  min-width: 200px;
}

.footer-logo-ring {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid rgba(200, 168, 0, 0.45);
  padding: 2px;
  overflow: hidden;
  flex-shrink: 0;
}

.footer-logo-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

.footer-title    { font-weight: 700; font-size: 0.87rem; color: white; margin-bottom: 0.15rem; }
.footer-subtitle { font-size: 0.7rem; font-weight: 700; color: var(--bsu-gold); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.3rem; }
.footer-contact  { font-size: 0.76rem; color: rgba(255, 255, 255, 0.38); }

.footer-links-group { display: flex; gap: var(--sp-12); flex-wrap: wrap; }

.footer-links-col {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  min-width: 148px;
}

.footer-col-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bsu-gold);
  margin-bottom: var(--sp-2);
}

.footer-links-col a,
.footer-links-col span {
  font-size: 0.83rem;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.6;
}

.footer-links-col a:hover { color: rgba(255, 255, 255, 0.88); }

.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--sp-4) var(--sp-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--sp-2);
  font-size: 0.71rem;
  color: rgba(255, 255, 255, 0.25);
}

/* ============================================================
   KEYFRAMES
   ============================================================ */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============================================================
   RESPONSIVE — 1024px
   ============================================================ */
@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: var(--sp-12);
    padding: 4rem var(--sp-6) 5rem;
  }

  .hero-card { max-width: 480px; }
  .hero-subtext { max-width: 100%; }

  .about-grid { grid-template-columns: 1fr; gap: var(--sp-12); }
  .about-stats { grid-template-columns: repeat(4, 1fr); }

  .cta-inner { flex-direction: column; text-align: center; }
  .btn-primary--large { align-self: center; }
}

/* ============================================================
   RESPONSIVE — 768px
   ============================================================ */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .btn-nav-login { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }

  .about-stats { grid-template-columns: 1fr 1fr; }

  .footer-inner { flex-direction: column; gap: var(--sp-8); }
  .footer-links-group { gap: var(--sp-6); }
  .footer-bottom { flex-direction: column; text-align: center; }

  .projects-header { flex-direction: column; gap: var(--sp-4); }
  .project-date-text { margin-left: 0; }
}

/* ============================================================
   RESPONSIVE — 480px
   ============================================================ */
@media (max-width: 480px) {
  .hero-heading { font-size: 2.5rem; }
  .hero-actions { flex-direction: column; }
  .btn-primary, .btn-ghost { justify-content: center; }
  .services-grid { grid-template-columns: 1fr; }
  .about-stats { grid-template-columns: 1fr 1fr; }
}
</style>
