<template>
  <div class="projects-page">

    <!-- ===================== NAVBAR (matches LandingView) ===================== -->
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
            <router-link to="/" class="nav-item">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              Home
            </router-link>
          </li>
          <li>
            <router-link to="/projects" class="nav-item active-nav">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Active Projects
            </router-link>
          </li>
          <li>
            <router-link to="/projects/archives" class="nav-item">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </span>
              Archives
            </router-link>
          </li>
        </ul>

        <!-- CTA Login Button -->
        <button class="btn-login-nav" @click="goToLogin">
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
        <router-link to="/" @click="isMobileMenuOpen = false">Home</router-link>
        <router-link to="/projects" @click="isMobileMenuOpen = false">Active Projects</router-link>
        <router-link to="/projects/archives" @click="isMobileMenuOpen = false">Archives</router-link>
        <button class="btn-login-mobile" @click="goToLogin">Login to Portal</button>
      </div>
    </nav>

    <!-- ===================== PAGE HERO ===================== -->
    <section class="page-hero">
      <div class="hero-orbs" aria-hidden="true">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>
      <div class="hero-stripe" aria-hidden="true"></div>

      <div class="page-hero-content">
        <div class="page-hero-eyebrow">
          <span class="eyebrow-dot"></span>
          <span>Live Updates</span>
        </div>
        <h1 class="page-hero-title">Campus <span class="title-accent">Projects</span></h1>
        <p class="page-hero-subtitle">
          Stay informed about ongoing facility upgrades, maintenance schedules, and groundskeeping operations actively reshaping our university campus.
        </p>

        <!-- Live stats strip -->
        <div class="stats-strip">
          <div class="stat-item">
            <span class="stat-value">{{ projects.length }}</span>
            <span class="stat-label">Active Projects</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ fgmuCount }}</span>
            <span class="stat-label">FGMU Projects</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ leauCount }}</span>
            <span class="stat-label">LEAU Projects</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== MAIN CONTENT ===================== -->
    <main class="page-main">
      <div class="page-container">

        <!-- Section Header + Filters -->
        <div class="section-header">
          <div class="section-title-group">
            <h2 class="section-title">Active & Upcoming Projects</h2>
            <p class="section-subtitle">Scheduled facility and grounds maintenance projects currently in progress or announced.</p>
          </div>
          <div class="filter-pills">
            <button @click="filter = 'ALL'" :class="['filter-pill', filter === 'ALL' ? 'filter-pill--active' : '']">All</button>
            <button @click="filter = 'FGMU'" :class="['filter-pill', 'filter-pill--fgmu', filter === 'FGMU' ? 'filter-pill--active-fgmu' : '']">Facilities (FGMU)</button>
            <button @click="filter = 'LEAU'" :class="['filter-pill', 'filter-pill--leau', filter === 'LEAU' ? 'filter-pill--active-leau' : '']">Grounds (LEAU)</button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading announcements...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProjects.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3>No Active Projects</h3>
          <p>There are currently no project announcements matching your filter. Check back later for updates.</p>
        </div>

        <!-- Project Cards -->
        <div v-else class="project-grid">
          <article v-for="(project, index) in filteredProjects" :key="project.id"
                   class="project-card"
                   :class="Number(project.unit_id) === 1 ? 'project-card--fgmu' : 'project-card--leau'"
                   :style="{ animationDelay: `${index * 80}ms` }">

            <!-- Card top accent + unit badge & status -->
            <div class="card-header">
              <div class="card-unit-badge" :class="Number(project.unit_id) === 1 ? 'badge--fgmu' : 'badge--leau'">
                <svg v-if="Number(project.unit_id) === 1" xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
                {{ Number(project.unit_id) === 1 ? 'FGMU — Facilities' : 'LEAU — Grounds' }}
              </div>
              <div class="card-meta-right">
                <span class="project-num-badge">{{ formatProjectNumber(project.id) }}</span>
                <div class="card-status">
                  <span class="status-dot"></span>
                  <span>Active Notice</span>
                </div>
              </div>
            </div>

            <!-- Title & Location -->
            <div class="card-body">
              <h3 class="card-title">{{ project.project_title }}</h3>

              <div class="card-location">
                <svg xmlns="http://www.w3.org/2000/svg" class="location-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span>{{ project.location || 'BSU Main Campus' }}</span>
              </div>

              <!-- Project Description -->
              <p class="card-description">
                {{ project.description || 'Official campus facility maintenance and scheduled development project.' }}
              </p>

              <!-- Schedule Highlights -->
              <div class="card-schedule-grid">
                <div class="schedule-pill">
                  <div class="schedule-icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" class="schedule-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="schedule-text">
                    <span class="schedule-label">Target Implementation</span>
                    <span class="schedule-val">{{ formatDate(project.project_target_date) }}</span>
                  </div>
                </div>

                <div class="schedule-pill">
                  <div class="schedule-icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" class="schedule-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="schedule-text">
                    <span class="schedule-label">Working Days</span>
                    <span class="schedule-val">{{ formatDuration(project.project_target_duration) }}</span>
                  </div>
                </div>
              </div>

              <!-- Scope of Work / Remarks Advisory -->
              <div v-if="project.project_remarks" class="card-remarks-box">
                <div class="remarks-header">
                  <svg xmlns="http://www.w3.org/2000/svg" class="remarks-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Scope of Work & Notes</span>
                </div>
                <p class="remarks-content">{{ project.project_remarks }}</p>
              </div>
            </div>

            <!-- Card footer (No ticket ID number) -->
            <div class="card-footer">
              <span class="announcement-date">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Published on {{ formatDate(project.submitted_at) }}
              </span>
              <span class="announcement-tag">Official Announcement</span>
            </div>
          </article>
        </div>

      </div>
    </main>

    <!-- ===================== FOOTER ===================== -->
    <footer class="page-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="/bsu-logo.png" alt="BSU" class="footer-logo" />
          <div>
            <p class="footer-title">Benguet State University</p>
            <p class="footer-subtitle">General Services Office</p>
          </div>
        </div>
        <div class="footer-links">
          <router-link to="/">Home</router-link>
          <router-link to="/projects">Active Projects</router-link>
          <router-link to="/projects/archives">Archives</router-link>
        </div>
        <p class="footer-copy">© {{ new Date().getFullYear() }} Benguet State University. All rights reserved.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { formatProjectNumber } from '@/utils/projectFormatter';

const router = useRouter();
const isMobileMenuOpen = ref(false);
const filter = ref('ALL');
const projects = ref([]);
const loading = ref(true);

const goToLogin = () => router.push({ name: 'login' });

const fetchProjects = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`);
    const data = await res.json();
    if (res.ok) projects.value = data.data?.projects || [];
  } catch (e) {
    console.error('Error fetching projects:', e);
  } finally {
    loading.value = false;
  }
};

const filteredProjects = computed(() => {
  if (filter.value === 'ALL') return projects.value;
  if (filter.value === 'FGMU') return projects.value.filter(p => Number(p.unit_id) === 1);
  if (filter.value === 'LEAU') return projects.value.filter(p => Number(p.unit_id) === 2);
  return projects.value;
});

const fgmuCount = computed(() => projects.value.filter(p => Number(p.unit_id) === 1).length);
const leauCount = computed(() => projects.value.filter(p => Number(p.unit_id) === 2).length);

const formatDate = (d) => {
  if (!d) return 'TBD';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDuration = (dur) => {
  if (!dur) return 'TBD';
  if (String(dur).toLowerCase().includes('day')) return dur;
  return `${dur} Working Days`;
};

onMounted(fetchProjects);
</script>

<style scoped>
/* ========================
   CSS CUSTOM PROPERTIES (matches LandingView)
   ======================== */
.projects-page {
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
  background: var(--surface-2);
  overflow-x: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ========================
   NAVBAR (exact copy from LandingView)
   ======================== */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
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
.navbar-brand { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; flex-shrink: 0; }
.navbar-logo-ring { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
.navbar-logo-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.navbar-text { display: flex; flex-direction: column; }
.navbar-title { font-size: 0.8rem; font-weight: 800; color: var(--bsu-green-dark); letter-spacing: 0.05em; line-height: 1.2; text-transform: uppercase; }
.navbar-subtitle { font-size: 0.65rem; font-weight: 600; color: var(--bsu-gold-dark); letter-spacing: 0.08em; text-transform: uppercase; }

.nav-links { display: flex; list-style: none; margin: 0 1.5rem 0 auto; padding: 0; gap: 1.5rem; }
.nav-item { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; font-weight: 700; padding: 0.5rem 0; position: relative; transition: color 0.3s ease; }
.nav-icon svg { width: 18px; height: 18px; opacity: 0.7; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease; }
.nav-item::after { content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 2px; background: var(--bsu-gold); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 2px; transform: translateX(-50%); }
.nav-item:hover { color: var(--bsu-green-dark); }
.nav-item:hover .nav-icon svg { transform: translateY(-2px) scale(1.1); opacity: 1; }
.nav-item:hover::after { width: 100%; }
.active-nav { color: var(--bsu-green-dark) !important; }
.active-nav::after { width: 100% !important; }

.btn-login-nav { display: flex; align-items: center; gap: 0.5rem; background: var(--bsu-green); color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; flex-shrink: 0; box-shadow: 0 4px 12px rgba(26, 107, 53, 0.3); }
.btn-login-nav:hover { background: var(--bsu-green-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26, 107, 53, 0.4); }
.btn-login-icon { width: 16px; height: 16px; display: flex; align-items: center; }
.btn-login-icon svg { width: 100%; height: 100%; }

.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; margin-left: auto; }
.hamburger span { display: block; width: 24px; height: 2px; background: var(--bsu-green); border-radius: 2px; transition: all 0.3s ease; transform-origin: center; }
.hamburger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger span.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.mobile-menu { display: none; flex-direction: column; background: white; border-top: 1px solid var(--border); padding: 0; max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.3s ease; }
.mobile-menu--open { max-height: 400px; padding: 1rem 2rem 1.5rem; }
.mobile-menu a { display: block; color: var(--text-secondary); text-decoration: none; font-size: 0.95rem; font-weight: 600; padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
.btn-login-mobile { margin-top: 1rem; width: 100%; background: var(--bsu-green); color: white; border: none; padding: 0.85rem; border-radius: 10px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.btn-login-mobile:hover { background: var(--bsu-green-dark); }

/* ========================
   PAGE HERO
   ======================== */
.page-hero {
  position: relative;
  padding: 140px 2rem 100px;
  overflow: hidden;
  background: linear-gradient(135deg, #062b12 0%, #0d4a22 40%, #1a6b35 70%, #0a3d1a 100%);
  text-align: center;
}
.hero-orbs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: orbFloat 20s ease-in-out infinite alternate; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(200, 168, 0, 0.25) 0%, transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(36, 144, 63, 0.4) 0%, transparent 70%); bottom: 0; left: -80px; animation-duration: 22s; animation-direction: alternate-reverse; }
.hero-stripe { position: absolute; top: 0; right: 0; width: 40%; height: 100%; background: linear-gradient(to bottom left, rgba(200, 168, 0, 0.08) 0%, transparent 60%); pointer-events: none; }

@keyframes orbFloat {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(40px, -30px) scale(1.05); }
  66%  { transform: translate(-20px, 20px) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}

.page-hero-content { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
.page-hero-eyebrow { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 100px; padding: 0.35rem 1rem; margin-bottom: 1.5rem; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.85); letter-spacing: 0.12em; text-transform: uppercase; backdrop-filter: blur(8px); }
.eyebrow-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.page-hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; color: white; line-height: 1.1; margin-bottom: 1.25rem; letter-spacing: -0.02em; }
.title-accent { color: var(--bsu-gold-light); }
.page-hero-subtitle { font-size: 1.1rem; color: rgba(255,255,255,0.75); max-width: 600px; margin: 0 auto 2.5rem; line-height: 1.7; font-weight: 400; }

.stats-strip { display: inline-flex; align-items: center; gap: 2rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 1rem 2rem; backdrop-filter: blur(10px); }
.stat-item { text-align: center; }
.stat-value { display: block; font-size: 1.75rem; font-weight: 900; color: white; line-height: 1; }
.stat-label { display: block; font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.3rem; }
.stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }

/* ========================
   MAIN CONTENT
   ======================== */
.page-main { flex: 1; padding: 4rem 0 6rem; }
.page-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }

.section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 2rem; margin-bottom: 3rem; flex-wrap: wrap; }
.section-title-group { flex: 1; }
.section-title { font-size: 1.75rem; font-weight: 900; color: var(--text-primary); margin-bottom: 0.4rem; letter-spacing: -0.01em; }
.section-subtitle { font-size: 0.9rem; color: var(--text-muted); max-width: 480px; line-height: 1.6; }

.filter-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
.filter-pill { border: 2px solid var(--border); background: white; color: var(--text-secondary); font-size: 0.8rem; font-weight: 700; padding: 0.45rem 1rem; border-radius: 100px; cursor: pointer; transition: all 0.2s ease; }
.filter-pill:hover { border-color: var(--bsu-green); color: var(--bsu-green); }
.filter-pill--active { background: var(--bsu-green); border-color: var(--bsu-green); color: white; box-shadow: 0 4px 12px rgba(26, 107, 53, 0.3); }
.filter-pill--active-fgmu { background: var(--bsu-green); border-color: var(--bsu-green); color: white; box-shadow: 0 4px 12px rgba(26, 107, 53, 0.3); }
.filter-pill--active-leau { background: #b45309; border-color: #b45309; color: white; box-shadow: 0 4px 12px rgba(180, 83, 9, 0.3); }

/* Loading & Empty */
.loading-state { display: flex; flex-direction: column; align-items: center; padding: 6rem 0; color: var(--text-muted); gap: 1rem; }
.loading-spinner { width: 44px; height: 44px; border: 3px solid var(--border); border-top-color: var(--bsu-green); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 6rem 2rem; background: white; border-radius: 24px; border: 1px solid var(--border); }
.empty-icon { width: 72px; height: 72px; background: var(--bsu-green-muted); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
.empty-icon svg { width: 32px; height: 32px; color: var(--bsu-green); }
.empty-state h3 { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem; }
.empty-state p { color: var(--text-muted); font-size: 0.95rem; max-width: 380px; margin: 0 auto; }

/* ========================
   PROJECT CARDS
   ======================== */
.project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.75rem; }

.project-card {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(15, 66, 33, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: cardFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  position: relative;
}
.project-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: var(--bsu-green);
  transition: height 0.2s ease;
}
.project-card--leau::before { background: #d97706; }
.project-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(15, 66, 33, 0.12); }

@keyframes cardFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem 0.75rem;
  border-bottom: 1px solid rgba(26, 107, 53, 0.08);
}
.card-unit-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
}
.badge-icon { width: 14px; height: 14px; }
.badge--fgmu { background: var(--bsu-green-muted); color: var(--bsu-green-dark); border: 1px solid rgba(26, 107, 53, 0.2); }
.badge--leau { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

.card-meta-right {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.project-num-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.65rem;
  border-radius: 8px;
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2);
}
.card-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
}
.status-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }

.card-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1.35;
  letter-spacing: -0.01em;
  margin: 0;
}

.card-location {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
}
.location-icon { width: 16px; height: 16px; flex-shrink: 0; color: var(--bsu-green); }

.card-description {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.card-schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 0.25rem;
}
.schedule-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0.75rem 0.9rem;
}
.schedule-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  color: var(--bsu-green);
}
.schedule-icon { width: 18px; height: 18px; }
.schedule-text { display: flex; flex-direction: column; }
.schedule-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.schedule-val {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-top: 0.1rem;
}

.card-remarks-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 0.85rem 1rem;
}
.remarks-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
}
.remarks-icon { width: 14px; height: 14px; color: #3b82f6; }
.remarks-content {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  font-style: italic;
}

.card-footer {
  margin-top: auto;
  padding: 0.85rem 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  background: var(--surface-2);
}
.announcement-date { display: flex; align-items: center; gap: 0.4rem; font-weight: 600; }
.announcement-tag { font-size: 0.68rem; font-weight: 800; color: var(--bsu-green); text-transform: uppercase; letter-spacing: 0.08em; }

/* ========================
   FOOTER
   ======================== */
.page-footer { background: var(--bsu-green-dark); color: rgba(255,255,255,0.65); }
.footer-inner { max-width: 1280px; margin: 0 auto; padding: 3rem 2rem; }
.footer-brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
.footer-logo { width: 36px; height: 36px; border-radius: 50%; opacity: 0.8; }
.footer-title { font-size: 0.9rem; font-weight: 800; color: white; margin: 0; }
.footer-subtitle { font-size: 0.72rem; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
.footer-links { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
.footer-links a { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s; }
.footer-links a:hover { color: white; }
.footer-copy { font-size: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.25rem; margin: 0; }

/* ========================
   RESPONSIVE
   ======================== */
@media (max-width: 900px) {
  .nav-links { display: none; }
  .btn-login-nav { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }

  .page-hero { padding: 120px 1.25rem 70px; }
  .stats-strip { flex-direction: column; gap: 1rem; padding: 1rem 1.5rem; }
  .stat-divider { width: 40px; height: 1px; }

  .section-header { flex-direction: column; gap: 1.25rem; }
  .project-grid { grid-template-columns: 1fr; }
  .page-container { padding: 0 1.25rem; }
  .footer-links { flex-direction: column; gap: 0.75rem; }
  .navbar-inner { padding: 0 1.25rem; }
}
</style>
