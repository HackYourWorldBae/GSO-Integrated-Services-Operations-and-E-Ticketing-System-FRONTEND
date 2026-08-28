<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mobile menu
const isMobileMenuOpen = ref(false);

// Services data — icons are SVG path definitions rendered inline
const services = [
  {
    iconPaths: [
      // Wrench / maintenance icon (Heroicons outline)
      'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    ],
    title: 'Facilities & Grounds',
    unit: 'FGMU',
    description: 'Submit maintenance, repair, and facilities requests for campus buildings and grounds.',
    color: 'service-icon-green',
  },
  {
    iconPaths: [
      // Leaf / landscaping icon (Heroicons outline)
      'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    ],
    title: 'Landscaping & Aesthetics',
    unit: 'LEAU',
    description: 'Request grounds maintenance, landscaping, sanitation, and environmental aesthetic services.',
    color: 'service-icon-gold',
  },
  {
    iconPaths: [
      // Shield check icon (Heroicons outline)
      'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    ],
    title: 'Security Services',
    unit: 'SSU',
    description: 'Request security assistance, incident reporting, and campus vehicle pass sticker.',
    color: 'service-icon-slate',
  },
  {
    iconPaths: [
      // Truck / transport icon (Heroicons outline)
      'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    ],
    title: 'Transport Services',
    unit: 'TASU',
    description: 'Book a university vehicle for official campus transport needs.',
    color: 'service-icon-teal',
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
  landingProjects.value.filter(p => p.status === 'pending' || p.status === 'approved' || (p.status === 'processing' && p.current_step < 5))
);

const formatLandingDate = (d) => {
  if (!d) return 'TBD';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatLandingProjectNumber = (id) => {
  if (!id) return '';
  const s = String(id);
  // Try to parse structured IDs like FGMU-PRJ-1-2025, else fallback
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
        <!-- Logo & Branding -->
        <div class="navbar-brand">
          <div class="navbar-logo-ring">
            <img src="/bsu-logo.png" alt="BSU Logo" class="navbar-logo-img" />
          </div>
          <div class="navbar-text">
            <span class="navbar-title">Benguet State University</span>
            <span class="navbar-subtitle">General Services Office</span>
          </div>
        </div>

        <!-- Desktop Nav Links -->
        <ul class="nav-links">
          <li>
            <a href="#about" class="nav-item">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              About
            </a>
          </li>
          <li>
            <router-link to="/projects" class="nav-item">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Projects
            </router-link>
          </li>
          <li>
            <a href="#services" class="nav-item">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              Services
            </a>
          </li>
        </ul>

        <!-- CTA Login Button -->
        <button id="nav-login-btn" class="btn-login-nav" @click="goToLogin">
          <span class="btn-login-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </span>
          Login
        </button>

        <!-- Hamburger -->
        <button class="hamburger" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Toggle menu">
          <span :class="{ open: isMobileMenuOpen }"></span>
          <span :class="{ open: isMobileMenuOpen }"></span>
          <span :class="{ open: isMobileMenuOpen }"></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ 'mobile-menu--open': isMobileMenuOpen }">
        <a href="#about" @click="isMobileMenuOpen = false">About</a>
        <router-link to="/projects" @click="isMobileMenuOpen = false">Projects</router-link>
        <a href="#services" @click="isMobileMenuOpen = false">Services</a>
        <button class="btn-login-mobile" @click="goToLogin">Login to Portal</button>
      </div>
    </nav>

    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <!-- Animated background orbs -->
      <div class="hero-orbs" aria-hidden="true">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <!-- Diagonal gold accent stripe -->
      <div class="hero-stripe" aria-hidden="true"></div>

      <!-- Floating particles -->
      <div class="particles" aria-hidden="true">
        <span v-for="i in 12" :key="i" class="particle" :style="{ '--i': i }"></span>
      </div>

      <div class="hero-content">
        <!-- Institutional Identifier -->
        <div class="hero-office-id">
          <div class="hero-office-id-bar"></div>
          <div class="hero-office-id-text">
            <span class="hero-office-university">Benguet State University</span>
            <span class="hero-office-name">General Services Office</span>
          </div>
        </div>

        <h1 class="hero-heading">
          e-Ticketing
          <br /><span class="hero-heading-accent">Service Portal</span>
        </h1>

        <p class="hero-subtext">
          The official digital platform for submitting, monitoring, and managing campus service
          requests across all GSO units — designed for transparency, accountability,
          and efficient campus operations.
        </p>

        <div class="hero-actions">
          <button id="hero-login-btn" class="btn-hero-primary" @click="goToLogin">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            Login to Portal
          </button>
          <a href="#services" class="btn-hero-secondary">
            Explore Services
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        <!-- Hero visual card -->
        <div class="hero-card">
          <div class="hero-card-header">
            <span class="hero-card-label">GSO e-Ticket Portal</span>
          </div>
          <div class="hero-card-body">
            <div class="ticket-row ticket-row--active" style="animation-delay: 0.1s">
              <div class="ticket-icon icon-processing">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ticket-info">
                <span class="ticket-title">Electrical Repair — Admin Bldg.</span>
                <span class="ticket-meta">FGMU · Ticket #2051</span>
              </div>
              <span class="ticket-badge badge-processing">In Progress</span>
            </div>
            <div class="ticket-row" style="animation-delay: 0.2s">
              <div class="ticket-icon icon-pending">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ticket-info">
                <span class="ticket-title">Vehicle Request — La Trinidad</span>
                <span class="ticket-meta">TASU · Ticket #2052</span>
              </div>
              <span class="ticket-badge badge-pending">Pending</span>
            </div>
            <div class="ticket-row" style="animation-delay: 0.3s">
              <div class="ticket-icon icon-done">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="ticket-info">
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
    <section id="about" class="about-section">
      <div class="section-container">
        <div class="about-grid">
          <div class="about-text">
            <span class="section-label">About GSO</span>
            <h2 class="section-heading about-heading">Serving BSU with Excellence</h2>
            <p class="about-body">
              The General Services Office (GSO) is the backbone of Benguet State University's
              operational infrastructure. We oversee campus facilities, security, electrical
              systems, and transportation — ensuring a safe, functional, and conducive
              environment for learning and service.
            </p>
            <p class="about-body">
              Our new e-Ticketing portal streamlines service requests, enabling staff and
              faculty to submit, track, and receive updates on their requests digitally —
              eliminating paperwork and reducing response times.
            </p>
            <div class="about-highlights">
              <div class="highlight-item">
                <span class="highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </span>
                <span>Paperless request processing</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <span>Real-time status tracking</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <span>Secure BSU staff access</span>
              </div>
            </div>
          </div>


          <div class="about-visual">
            <div class="about-card-stack">
              <div class="about-badge-card card-1">
                <span class="card-icon card-icon--green" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                <span>FGMU — Facilities &amp; Grounds</span>
              </div>
              <div class="about-badge-card card-2">
                <span class="card-icon card-icon--gold" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a10 10 0 000 20M12 2C6.477 2 2 6.477 2 12M12 2c2.761 0 5 4.477 5 10s-2.239 10-5 10M12 2c-2.761 0-5 4.477-5 10s2.239 10 5 10" />
                  </svg>
                </span>
                <span>LEAU — Landscaping &amp; Aesthetics</span>
              </div>
              <div class="about-badge-card card-3">
                <span class="card-icon card-icon--slate" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <span>SSU — Security Services</span>
              </div>
              <div class="about-badge-card card-4">
                <span class="card-icon card-icon--teal" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </span>
                <span>TASU — Transport &amp; Automotive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SERVICES ===================== -->
    <section id="services" class="services-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-label">Our Services</span>
          <h2 class="section-heading">What We Offer</h2>
          <p class="section-desc">
            The GSO manages four specialized service units, each handling distinct campus
            operational needs through this integrated digital platform.
          </p>
        </div>

        <div class="services-grid">
          <div
            v-for="service in services"
            :key="service.unit"
            class="service-card"
          >
            <div class="service-icon-wrap" :class="service.color" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="service-icon-svg">
                <path v-for="(d, i) in service.iconPaths" :key="i" :d="d" />
              </svg>
            </div>
            <div class="service-unit-badge">{{ service.unit }}</div>
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-desc">{{ service.description }}</p>
            <button class="service-cta" @click="goToLogin">
              Submit a Request
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>



    <!-- ===================== PROJECT ANNOUNCEMENTS ===================== -->
    <section v-if="landingProjects.length > 0" class="landing-projects-section">
      <div class="section-container">
        <!-- Section header -->
        <div class="landing-proj-header">
          <div>
            <span class="section-label">Campus Projects</span>
            <h2 class="section-heading">Official Project Notices</h2>
            <p class="section-desc" style="max-width:500px">
              Stay informed about ongoing and upcoming facility maintenance and grounds projects across the BSU campus.
            </p>
          </div>
          <div class="landing-proj-counts">
            <div class="landing-proj-count-card active-count-card">
              <span class="landing-count-value">{{ landingActive.length }}</span>
              <span class="landing-count-label">
                <span class="landing-count-dot active-count-dot"></span>
                Active Projects
              </span>
            </div>
            <div class="landing-proj-count-card upcoming-count-card">
              <span class="landing-count-value">{{ landingUpcoming.length }}</span>
              <span class="landing-count-label">
                <span class="landing-count-dot upcoming-count-dot"></span>
                Upcoming
              </span>
            </div>
            <router-link to="/projects" class="landing-proj-view-all">
              View All
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>
        </div>

        <!-- Project announcement rows (max 3 shown) -->
        <div class="landing-proj-list">
          <div v-for="(project, index) in landingProjects.slice(0, 3)" :key="project.id"
               class="landing-proj-row"
               :class="Number(project.unit_id) === 1 ? 'landing-proj-row--fgmu' : 'landing-proj-row--leau'"
               :style="{ animationDelay: `${index * 80}ms` }">

            <!-- Left color band -->
            <div class="landing-proj-band" :class="Number(project.unit_id) === 1 ? 'band--fgmu' : 'band--leau'">
              <span class="landing-proj-num">{{ formatLandingProjectNumber(project.id) }}</span>
              <span class="landing-proj-unit">{{ Number(project.unit_id) === 1 ? 'FGMU' : 'LEAU' }}</span>
            </div>

            <!-- Content -->
            <div class="landing-proj-content">
              <div class="landing-proj-meta">
                <span class="landing-proj-badge"
                      :class="(project.status === 'processing' && project.current_step >= 5) ? 'badge-active' : 'badge-upcoming'">
                  <span class="landing-proj-badge-dot"></span>
                  {{ (project.status === 'processing' && project.current_step >= 5) ? 'ACTIVE' : 'UPCOMING' }}
                </span>
                <span class="landing-proj-date">{{ formatLandingDate(project.submitted_at) }}</span>
              </div>
              <h4 class="landing-proj-title">{{ project.project_title }}</h4>
              <p class="landing-proj-location">
                <svg xmlns="http://www.w3.org/2000/svg" class="landing-proj-loc-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                {{ project.location || 'BSU Main Campus' }}
                <span class="landing-proj-date-chip">Target: {{ formatLandingDate(project.project_target_date) }}</span>
              </p>
            </div>
          </div>

          <!-- Show more link -->
          <router-link v-if="landingProjects.length > 3" to="/projects" class="landing-proj-showmore">
            View all {{ landingProjects.length }} project announcements
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 inline ml-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ===================== CTA BANNER ===================== -->
    <section class="cta-section">
      <div class="cta-glow" aria-hidden="true"></div>
      <div class="section-container cta-inner">
        <div class="cta-text">
          <h2 class="cta-heading">Ready to submit a service request?</h2>
          <p class="cta-subtext">
            Log in with your BSU staff account to access the full GSO e-Ticketing portal.
          </p>
        </div>
        <button id="cta-login-btn" class="btn-hero-primary btn-cta-large" @click="goToLogin">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          Login Now
        </button>
      </div>
    </section>

    <!-- ===================== FOOTER ===================== -->
    <footer id="contact" class="footer">
      <div class="section-container footer-inner">
        <div class="footer-brand">
          <div class="footer-logo-ring">
            <img src="/bsu-logo.png" alt="BSU Logo" class="footer-logo-img" />
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
          </div>
          <div class="footer-links-col">
            <span class="footer-col-title">Service Units</span>
            <span>FGMU — Facilities & Grounds</span>
            <span>LEAU — Landscaping & Aesthetics</span>
            <span>SSU — Security Services</span>
            <span>TASU — Transport Services</span>
          </div>
          <div class="footer-links-col">
            <span class="footer-col-title">Portal Access</span>
            <a href="#" @click.prevent="goToLogin">Staff Login</a>
            <a href="https://www.bsu.edu.ph" target="_blank" rel="noopener">BSU Official Website</a>
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
/* ========================
   CSS CUSTOM PROPERTIES
   ======================== */
.landing-page {
  --bsu-green:        #1a6b35;
  --bsu-green-light:  #24903f;
  --bsu-green-dark:   #0f4221;
  --bsu-green-muted:  #e6f4eb;
  --bsu-gold:         #c8a800;
  --bsu-gold-light:   #f0cc00;
  --bsu-gold-dark:    #9a8000;
  --surface:          #ffffff;
  --surface-2:        #f7faf8;
  --text-primary:     #0f2419;
  --text-secondary:   #3d6647;
  --text-muted:       #6b8f76;
  --border:           rgba(26, 107, 53, 0.15);

  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  color: var(--text-primary);
  background: var(--surface);
  overflow-x: hidden;
}

/* ========================
   NAVBAR
   ======================== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 20px rgba(26, 107, 53, 0.08);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 72px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  flex-shrink: 0;
}

.navbar-logo-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: transparent;
  overflow: hidden;
  box-shadow: none;
  flex-shrink: 0;
}

.navbar-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.navbar-text {
  display: flex;
  flex-direction: column;
}

.navbar-title {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--bsu-green-dark);
  letter-spacing: 0.05em;
  line-height: 1.2;
  text-transform: uppercase;
}

.navbar-subtitle {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--bsu-gold-dark);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0 1.5rem 0 auto;
  padding: 0;
  gap: 1.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-icon svg {
  width: 18px;
  height: 18px;
  opacity: 0.7;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, color 0.3s ease;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--bsu-gold);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 2px;
  transform: translateX(-50%);
}

.nav-item:hover {
  color: var(--bsu-green-dark);
}

.nav-item:hover .nav-icon svg {
  transform: translateY(-2px) scale(1.1);
  opacity: 1;
  color: var(--bsu-green);
}

.nav-item:hover::after {
  width: 100%;
}

.btn-login-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bsu-green);
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(26, 107, 53, 0.3);
}

.btn-login-nav:hover {
  background: var(--bsu-green-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(26, 107, 53, 0.4);
}

.btn-login-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
}

.btn-login-icon svg { width: 100%; height: 100%; }

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
  width: 24px;
  height: 2px;
  background: var(--bsu-green);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger span.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  background: white;
  border-top: 1px solid var(--border);
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.3s ease;
}

.mobile-menu--open {
  max-height: 400px;
  padding: 1rem 2rem 1.5rem;
}

.mobile-menu a {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
}

.btn-login-mobile {
  margin-top: 1rem;
  width: 100%;
  background: var(--bsu-green);
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-login-mobile:hover { background: var(--bsu-green-dark); }

/* ========================
   HERO
   ======================== */
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #062b12 0%, #0d4a22 40%, #1a6b35 70%, #0a3d1a 100%);
  padding-top: 72px;
}

.hero-orbs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: orbFloat 20s ease-in-out infinite alternate;
}

.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(200, 168, 0, 0.25) 0%, transparent 70%);
  top: -100px; right: -100px;
  animation-duration: 18s;
}

.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(36, 144, 63, 0.4) 0%, transparent 70%);
  bottom: 0; left: -80px;
  animation-duration: 22s;
  animation-direction: alternate-reverse;
}

.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(200, 168, 0, 0.15) 0%, transparent 70%);
  top: 40%; left: 40%;
  animation-duration: 15s;
}

@keyframes orbFloat {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(40px, -30px) scale(1.05); }
  66%  { transform: translate(-20px, 20px) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}

.hero-stripe {
  position: absolute;
  top: 0; right: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(to bottom left, rgba(200, 168, 0, 0.08) 0%, transparent 60%);
  pointer-events: none;
}

.particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--bsu-gold);
  opacity: 0;
  animation: particleFloat calc(10s + var(--i) * 1.5s) ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.8s);
  left: calc(var(--i) * 8% + 2%);
  bottom: -10px;
}

@keyframes particleFloat {
  0%   { opacity: 0; transform: translateY(0) scale(0.5); }
  20%  { opacity: 0.6; }
  80%  { opacity: 0.3; }
  100% { opacity: 0; transform: translateY(-100vh) scale(1.5); }
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2rem 6rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto auto;
  gap: 1.5rem;
  align-items: center;
  width: 100%;
}

/* Hero badge removed — replaced by .hero-office-id block */
@keyframes pulseBadge {
  0%, 100% { box-shadow: 0 0 0 0 rgba(240, 204, 0, 0.6); }
  50%       { box-shadow: 0 0 0 6px rgba(240, 204, 0, 0); }
}

/* Institutional office identifier block */
.hero-office-id {
  grid-column: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: fadeSlideUp 0.6s ease forwards;
  margin-bottom: 0.25rem;
}

.hero-office-id-bar {
  width: 4px;
  height: 40px;
  background: linear-gradient(180deg, var(--bsu-gold-light) 0%, var(--bsu-gold) 100%);
  border-radius: 4px;
  flex-shrink: 0;
}

.hero-office-id-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.hero-office-university {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1;
}

.hero-office-name {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--bsu-gold-light);
  line-height: 1;
}

.hero-heading {
  grid-column: 1;
  font-size: clamp(2.6rem, 5.5vw, 5rem);
  font-weight: 900;
  line-height: 1.05;
  color: white;
  margin: 0;
  animation: fadeSlideUp 0.7s 0.1s ease both;
  letter-spacing: -0.02em;
}

.hero-heading-accent {
  color: var(--bsu-gold-light);
  display: inline-block;
  position: relative;
  font-size: clamp(2.6rem, 5.5vw, 5rem);
  font-weight: 900;
}

.hero-heading-accent::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--bsu-gold-light), transparent);
  border-radius: 2px;
  animation: lineExpand 0.8s 0.6s ease both;
  transform-origin: left;
}

@keyframes lineExpand {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.hero-subtext {
  grid-column: 1;
  color: rgba(255, 255, 255, 0.68);
  font-size: clamp(0.875rem, 1.4vw, 1.05rem);
  line-height: 1.8;
  max-width: 480px;
  margin: 0;
  animation: fadeSlideUp 0.7s 0.2s ease both;
  font-weight: 400;
  letter-spacing: 0.01em;
}

.hero-subtext strong { color: rgba(255, 255, 255, 0.95); font-weight: 700; }

.hero-actions {
  grid-column: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  animation: fadeSlideUp 0.7s 0.3s ease both;
}

.hero-card {
  grid-column: 2;
  grid-row: 1 / -1;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  animation: fadeSlideLeft 0.8s 0.3s ease both;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(200, 168, 0, 0.1);
  align-self: center;
}

@keyframes fadeSlideLeft {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}

.hero-card-header {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-card-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.dot-red    { background: #ff5f57; }
.dot-yellow { background: #ffbd2e; }
.dot-green  { background: #28ca41; }

.hero-card-label {
  margin-left: auto;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
}

.hero-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ticket-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  opacity: 0;
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: transform 0.3s ease, background 0.3s ease;
}

.ticket-row:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.08);
}

@keyframes slideUpFade {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}

.ticket-row--active {
  background: rgba(200, 168, 0, 0.07);
  border-color: rgba(200, 168, 0, 0.2);
}

.ticket-row--active:hover {
  background: rgba(200, 168, 0, 0.12);
}

.ticket-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ticket-icon svg { width: 18px; height: 18px; }

.icon-processing { background: rgba(240, 204, 0, 0.2); color: #f0cc00; animation: iconPulse 2s infinite; }
.icon-pending    { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }
.icon-done       { background: rgba(34, 197, 94, 0.2); color: #22c55e; }

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.ticket-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ticket-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-meta {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.ticket-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 100px;
  white-space: nowrap;
}

.badge-processing { background: rgba(240, 204, 0, 0.2); color: #f0cc00; }
.badge-pending    { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
.badge-done       { background: rgba(34, 197, 94, 0.2); color: #22c55e; }

/* ========================
   BUTTONS
   ======================== */
.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, var(--bsu-gold) 0%, var(--bsu-gold-light) 100%);
  color: var(--bsu-green-dark);
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(200, 168, 0, 0.4);
  text-decoration: none;
  letter-spacing: 0.01em;
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(200, 168, 0, 0.5);
  background: linear-gradient(135deg, var(--bsu-gold-light) 0%, #ffe44d 100%);
}

.btn-hero-primary:active { transform: translateY(0); }

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.9rem 1.75rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  backdrop-filter: blur(8px);
}

.btn-hero-secondary:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.btn-icon { width: 18px; height: 18px; }

.btn-cta-large {
  padding: 1.1rem 2.5rem;
  font-size: 1.05rem;
  border-radius: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ========================
   SHARED SECTION UTILITIES
   ======================== */
.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-label {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bsu-green);
  background: var(--bsu-green-muted);
  padding: 0.35rem 0.9rem;
  border-radius: 100px;
  margin-bottom: 0.85rem;
  border: 1px solid rgba(26, 107, 53, 0.2);
}

.section-label--gold {
  color: var(--bsu-gold-dark);
  background: rgba(200, 168, 0, 0.15);
  border-color: rgba(200, 168, 0, 0.3);
}

.section-heading {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.section-heading--white { color: white; }

.section-desc {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

.section-desc--muted { color: rgba(255, 255, 255, 0.55); }

/* ========================
   ABOUT SECTION
   ======================== */
.about-section {
  padding: 6rem 0;
  background: var(--surface);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.about-heading { text-align: left; }

.about-body {
  color: var(--text-muted);
  line-height: 1.8;
  font-size: 0.97rem;
  margin-bottom: 1rem;
}

.about-highlights {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.highlight-icon {
  font-size: 1rem;
  width: 28px;
  height: 28px;
  background: var(--bsu-green-muted);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-card-stack {
  position: relative;
  width: 320px;
  height: 320px;
}

.about-badge-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0.75rem 1.25rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-secondary);
  box-shadow: 0 4px 20px rgba(26, 107, 53, 0.1);
  white-space: nowrap;
}

.card-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon svg {
  width: 18px;
  height: 18px;
}

.card-icon--green { background: rgba(26, 107, 53, 0.15); color: var(--bsu-green); }
.card-icon--gold  { background: rgba(200, 168, 0, 0.15); color: var(--bsu-gold-dark); }
.card-icon--slate { background: rgba(71, 85, 105, 0.12); color: #475569; }
.card-icon--teal  { background: rgba(13, 74, 34, 0.12); color: var(--bsu-green-dark); }

.card-1 { top: 5%; left: -10px; animation: cardFloat 5s ease-in-out infinite; }
.card-2 { top: 30%; right: -10px; animation: cardFloat 6s ease-in-out 1s infinite; }
.card-3 { top: 55%; left: -10px; animation: cardFloat 7s ease-in-out 2s infinite; }
.card-4 { bottom: 5%; right: -10px; animation: cardFloat 5.5s ease-in-out 1.5s infinite; }

@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}


/* ========================
   SERVICES SECTION
   ======================== */
.services-section {
  padding: 6rem 0;
  background: var(--surface-2);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.75rem;
}

.service-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--bsu-green), var(--bsu-gold));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease;
}

.service-card:hover::before { transform: scaleX(1); }

.service-card:hover {
  border-color: rgba(26, 107, 53, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(26, 107, 53, 0.12);
}

.service-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Service icon color variants */
.service-icon-green { background: linear-gradient(135deg, #1a6b35 0%, #24903f 100%); }
.service-icon-gold  { background: linear-gradient(135deg, #c8a800 0%, #f0cc00 100%); }
.service-icon-slate { background: linear-gradient(135deg, #475569 0%, #64748b 100%); }
.service-icon-teal  { background: linear-gradient(135deg, #0d4a22 0%, #1a6b35 100%); }

.service-icon-svg {
  width: 28px;
  height: 28px;
  color: white;
}

.service-unit-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--bsu-green);
  background: var(--bsu-green-muted);
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(26, 107, 53, 0.2);
}

.service-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.6rem;
}

.service-desc {
  font-size: 0.87rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0 0 1.5rem;
}

.service-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: var(--bsu-green);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: gap 0.2s ease, color 0.2s;
}

.service-cta:hover { color: var(--bsu-green-dark); gap: 0.7rem; }
.service-cta svg { width: 16px; height: 16px; }

/* ========================

/* ========================
   CTA SECTION
   ======================== */
.cta-section {
  padding: 5rem 0;
  background: var(--surface);
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.cta-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse at center, rgba(26, 107, 53, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
}

.cta-text { flex: 1; min-width: 280px; }

.cta-heading {
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
}

.cta-subtext {
  color: var(--text-muted);
  font-size: 0.97rem;
  line-height: 1.65;
  margin: 0;
}

/* ========================
   FOOTER
   ======================== */
.footer {
  background: var(--bsu-green-dark);
  color: rgba(255, 255, 255, 0.8);
  padding: 4rem 0 0;
}

.footer-inner {
  display: flex;
  gap: 4rem;
  flex-wrap: wrap;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  min-width: 220px;
}

.footer-logo-ring {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid var(--bsu-gold);
  padding: 2px;
  overflow: hidden;
  flex-shrink: 0;
}

.footer-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.footer-title {
  font-weight: 800;
  font-size: 0.9rem;
  color: white;
  margin-bottom: 0.2rem;
}

.footer-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--bsu-gold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}

.footer-contact {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.footer-links-group {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

.footer-links-col {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 160px;
}

.footer-col-title {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--bsu-gold);
  margin-bottom: 0.25rem;
}

.footer-links-col a,
.footer-links-col span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links-col a:hover { color: white; }

.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
}

/* ========================
   KEYFRAME ANIMATIONS
   ======================== */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ========================
   LANDING PROJECT ANNOUNCEMENTS
   ======================== */
.landing-projects-section {
  padding: 3rem 0;
  background: #f7faf8;
  border-top: 1px solid rgba(26,107,53,0.1);
  border-bottom: 1px solid rgba(26,107,53,0.1);
}

.landing-proj-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.landing-proj-counts {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.landing-proj-count-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.85rem 1.25rem;
  border-radius: 16px;
  border: 1px solid;
  min-width: 90px;
  text-align: center;
}
.active-count-card   { background: #dcfce7; border-color: #bbf7d0; }
.upcoming-count-card { background: #fef3c7; border-color: #fde68a; }

.landing-count-value {
  font-size: 1.75rem;
  font-weight: 900;
  line-height: 1;
  color: #0f2419;
}
.landing-count-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #374151;
  margin-top: 0.35rem;
}
.landing-count-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.active-count-dot   { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
.upcoming-count-dot { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

.landing-proj-view-all {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: #1a6b35; color: white;
  font-size: 0.82rem; font-weight: 700;
  padding: 0.65rem 1.25rem; border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
  white-space: nowrap;
}
.landing-proj-view-all:hover { background: #0f4221; transform: translateY(-1px); }

.landing-proj-list { display: flex; flex-direction: column; gap: 0.875rem; }

.landing-proj-row {
  display: flex;
  background: white;
  border-radius: 14px;
  border: 1px solid rgba(26,107,53,0.12);
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(15, 66, 33, 0.04);
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease;
  animation: fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
}
.landing-proj-row:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(15, 66, 33, 0.09); }

/* Colored left band */
.landing-proj-band {
  width: 80px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.85rem 0.4rem;
  text-align: center;
}
.band--fgmu { background: linear-gradient(175deg, #0d4a22 0%, #1a6b35 100%); }
.band--leau  { background: linear-gradient(175deg, #78350f 0%, #b45309 100%); }

.landing-proj-num {
  font-size: 0.55rem; font-weight: 900; color: white;
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px; padding: 0.15rem 0.35rem;
  letter-spacing: 0.03em;
}
.landing-proj-unit {
  font-size: 0.55rem; font-weight: 800; color: rgba(255,255,255,0.6);
  text-transform: uppercase; letter-spacing: 0.1em;
}

/* Content area */
.landing-proj-content {
  flex: 1; padding: 0.85rem 1.1rem; min-width: 0;
}

.landing-proj-meta {
  display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; flex-wrap: wrap;
}

.landing-proj-badge {
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.58rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.09em;
  border-radius: 100px; padding: 0.18rem 0.55rem; border: 1px solid;
}
.badge-active   { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
.badge-upcoming { background: #fef3c7; color: #92400e; border-color: #fde68a; }

.landing-proj-badge-dot {
  width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.7;
}

.landing-proj-date {
  font-size: 0.65rem; color: #6b7280; font-weight: 500;
}

.landing-proj-title {
  font-size: 1rem; font-weight: 900; color: #0f2419;
  line-height: 1.3; margin: 0 0 0.25rem;
  letter-spacing: -0.01em;
}

.landing-proj-location {
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.78rem; color: #6b7280; font-weight: 500; margin: 0;
  flex-wrap: wrap;
}
.landing-proj-loc-icon {
  width: 13px; height: 13px; flex-shrink: 0; color: #1a6b35;
}
.landing-proj-date-chip {
  display: inline-flex; align-items: center;
  background: #f3f4f6; border-radius: 6px; padding: 0.1rem 0.45rem;
  font-size: 0.65rem; font-weight: 700; color: #374151;
  margin-left: 0.5rem;
}

.landing-proj-showmore {
  display: block; text-align: center;
  font-size: 0.85rem; font-weight: 700; color: #1a6b35;
  padding: 1rem; border: 1px dashed rgba(26,107,53,0.25);
  border-radius: 12px; text-decoration: none;
  transition: background 0.2s, color 0.2s;
  margin-top: 0.25rem;
}
.landing-proj-showmore:hover { background: #f0faf4; color: #0f4221; }

/* ========================
   RESPONSIVE
   ======================== */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    padding: 4rem 1.5rem 5rem;
  }

  .hero-card {
    grid-column: 1;
    grid-row: auto;
    max-width: 480px;
    align-self: auto;
  }

  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .about-visual { display: none; }

  .cta-inner { flex-direction: column; text-align: center; }
  .btn-cta-large { align-self: center; }
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .btn-login-nav { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }

  .footer-inner { flex-direction: column; gap: 2rem; }
  .footer-links-group { gap: 1.5rem; }
  .footer-bottom { flex-direction: column; text-align: center; }

  .service-card { padding: 1.5rem; }

  .landing-proj-header { flex-direction: column; gap: 1.25rem; }
  .landing-proj-counts { justify-content: flex-start; }
  .landing-proj-band { width: 60px; }
}

@media (max-width: 480px) {
  .hero-heading { font-size: 2.5rem; }
  .hero-actions { flex-direction: column; }
  .btn-hero-primary, .btn-hero-secondary { justify-content: center; }
  .services-grid { grid-template-columns: 1fr; }
  .btn-login-hero, .btn-secondary-hero { width: 100%; justify-content: center; }
  .landing-proj-row { flex-direction: column; }
  .landing-proj-band { width: 100%; height: 50px; flex-direction: row; justify-content: center; }
}
</style>

