const fs = require('fs');
const path = require('path');

const units = ['fgmu', 'leau', 'tasu'];

units.forEach(unit => {
    const UNIT = unit.toUpperCase();
    const basePath = path.join(__dirname, 'src', 'views', 'dashboards');
    
    // Admin Archive file
    const adminArchivePath = path.join(basePath, 'admin', unit, `${UNIT}_Archives.vue`);
    let adminArchiveContent = fs.readFileSync(adminArchivePath, 'utf8');

    // Existing Dispatcher files
    const dispatcherDir = path.join(basePath, 'dispatcher', unit);
    let dispatcherFiles = fs.readdirSync(dispatcherDir).filter(f => f.endsWith('.vue'));

    // The router link to add
    const archiveLink = `
      <router-link to="/dispatcher/${unit}/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>`;

    // For FGMU, we need to extract the sidebar links from FGMU.vue first
    const mainFile = path.join(dispatcherDir, `${UNIT}.vue`);
    let mainContent = fs.readFileSync(mainFile, 'utf8');
    
    // Extract everything between <template #sidebar-links> and </template>
    const sidebarRegex = /<template #sidebar-links>([\s\S]*?)<\/template>/;
    let sidebarMatch = mainContent.match(sidebarRegex);
    
    if (sidebarMatch) {
        let currentSidebar = sidebarMatch[1];
        if (!currentSidebar.includes('/archives"')) {
             let newSidebar = currentSidebar.trimEnd() + archiveLink + '\n    ';
             
             // Update all existing dispatcher files
             dispatcherFiles.forEach(file => {
                 let fp = path.join(dispatcherDir, file);
                 let content = fs.readFileSync(fp, 'utf8');
                 content = content.replace(sidebarRegex, `<template #sidebar-links>\n${newSidebar}</template>`);
                 fs.writeFileSync(fp, content, 'utf8');
             });

             // Create Dispatcher Archive from Admin Archive
             let newAdminArchive = adminArchiveContent.replace(sidebarRegex, `<template #sidebar-links>\n${newSidebar}</template>`);
             // Also replace the header-title FGMU Admin with FGMU Dispatcher
             newAdminArchive = newAdminArchive.replace(/>${UNIT} Admin</, `>${UNIT} Dispatcher</`);
             
             fs.writeFileSync(path.join(dispatcherDir, `${UNIT}_DispatcherArchives.vue`), newAdminArchive, 'utf8');
             console.log(`Created ${UNIT}_DispatcherArchives.vue and updated sidebar links.`);
        } else {
             console.log(`${UNIT} already has archives link.`);
        }
    }
});
