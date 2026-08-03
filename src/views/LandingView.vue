<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();



// Mobile menu
const isMobileMenuOpen = ref(false);

// Services data
const services = [
  {
    icon: '🔧',
    title: 'Facilities & Grounds',
    unit: 'FGMU',
    description: 'Submit maintenance, repair, and facilities requests for campus buildings and grounds.',
    color: 'service-icon-green',
  },
  {
    icon: '🌿',
    title: 'Landscaping & Aesthetics',
    unit: 'LEAU',
    description: 'Request grounds maintenance, landscaping, sanitation, and environmental aesthetic services.',
    color: 'service-icon-gold',
  },
  {
    icon: '🛡️',
    title: 'Security Services',
    unit: 'SSU',
    description: 'Request security assistance, incident reporting, and campus vehicle pass sticker.',
    color: 'service-icon-slate',
  },
  {
    icon: '🚐',
    title: 'Transport Services',
    unit: 'TASU',
    description: 'Book a university vehicle.',
    color: 'service-icon-teal',
  },
];

const goToLogin = () => router.push({ name: 'login' });
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
        <!-- Badge -->
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          Now Live — Digital Service Platform
        </div>

        <h1 class="hero-heading">
          GSO
          <span class="hero-heading-accent">e-Ticketing</span>
          <br />System
        </h1>

        <p class="hero-subtext">
          The official digital service portal of the <strong>General Services Office</strong> of
          <strong>Benguet State University</strong>. Submit, track, and manage campus service
          requests — fast, transparent, and accessible.
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
                <span class="ticket-meta">LEAU · Ticket #2051</span>
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
                <span class="ticket-meta">FGMU · Ticket #2049</span>
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
                <span class="highlight-icon">✅</span>
                <span>Paperless request processing</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon">⚡</span>
                <span>Real-time status tracking</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon">🔒</span>
                <span>Secure BSU staff access</span>
              </div>
            </div>
          </div>

          <div class="about-visual">
            <div class="about-card-stack">
              <div class="about-badge-card card-1">
                <span class="card-emoji">🏛️</span>
                <span>FGMU - Facilities & Grounds</span>
              </div>
              <div class="about-badge-card card-2">
                <span class="card-emoji">🌿</span>
                <span>LEAU - Landscaping & Aesthetics</span>
              </div>
              <div class="about-badge-card card-3">
                <span class="card-emoji">🛡️</span>
                <span>SSU - Security Services</span>
              </div>
              <div class="about-badge-card card-4">
                <span class="card-emoji">🚌</span>
                <span>TASU - Transport & Automotive</span>
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
            <div class="service-icon-wrap" :class="service.color">
              <span class="service-icon">{{ service.icon }}</span>
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

.hero-badge {
  grid-column: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(200, 168, 0, 0.15);
  border: 1px solid rgba(200, 168, 0, 0.4);
  color: var(--bsu-gold-light);
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  width: fit-content;
  animation: fadeSlideUp 0.6s ease forwards;
}

.hero-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bsu-gold-light);
  animation: pulseBadge 2s ease infinite;
}

@keyframes pulseBadge {
  0%, 100% { box-shadow: 0 0 0 0 rgba(240, 204, 0, 0.6); }
  50%       { box-shadow: 0 0 0 6px rgba(240, 204, 0, 0); }
}

.hero-heading {
  grid-column: 1;
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  color: white;
  margin: 0;
  animation: fadeSlideUp 0.7s 0.1s ease both;
  letter-spacing: -0.03em;
}

.hero-heading-accent {
  color: var(--bsu-gold-light);
  display: inline-block;
  position: relative;
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
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  line-height: 1.75;
  max-width: 480px;
  margin: 0;
  animation: fadeSlideUp 0.7s 0.2s ease both;
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

.card-emoji { font-size: 1.25rem; }

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

.service-icon { font-size: 1.75rem; }

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
}

@media (max-width: 480px) {
  .hero-heading { font-size: 2.5rem; }
  .hero-actions { flex-direction: column; }
  .btn-hero-primary, .btn-hero-secondary { justify-content: center; }
  .services-grid { grid-template-columns: 1fr; }
  .btn-login-hero, .btn-secondary-hero { width: 100%; justify-content: center; }
}
</style>
