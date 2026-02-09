/* --- 1. SEGURIDAD --- */
if (!localStorage.getItem('sesion_iniciada')) {
    window.location.href = 'index.html';
}

document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
    if(e.keyCode == 123) return false; 
    if(e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) return false;
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
}

function cerrarSesion() {
    localStorage.removeItem('sesion_iniciada');
    window.location.href = 'index.html';
}

/* --- 2. GESTIÓN DE TEMAS (MODO OSCURO) --- */
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    // Guardar preferencia
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
    const sun = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');
    
    if (isDark) {
        if(sun) sun.classList.remove('hidden');
        if(moon) moon.classList.add('hidden');
    } else {
        if(sun) sun.classList.add('hidden');
        if(moon) moon.classList.remove('hidden');
    }
}

// Cargar tema al iniciar
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcons(true);
    } else {
        updateThemeIcons(false);
    }
}

/* --- 3. LÓGICA DEL DASHBOARD --- */
const reports = {
    efectividad: { title: "Efectividad BO", url: "https://app.powerbi.com/view?r=eyJrIjoiZDkxYTFiNDctNDFjYS00NThjLWExYjgtMzQ5M2Y0NzZjZGUzIiwidCI6ImM5YTUyNjg2LTFhYzMtNDBlZi05Yzk3LWEyZWYyOWIyOTdmYyIsImMiOjR9" },
    matriz: { title: "Matriz General", url: "https://app.powerbi.com/view?r=eyJrIjoiNjIyYmJjNzQtYjI4My00MjdkLWE0ZmUtNWJkNjhiN2E0NmIyIiwidCI6ImM5YTUyNjg2LTFhYzMtNDBlZi05Yzk3LWEyZWYyOWIyOTdmYyIsImMiOjR9" },
    calidad: { title: "Reporte de Calidad", url: "https://app.powerbi.com/view?r=eyJrIjoiNzhmYWM2OWMtZmJlMy00ZjgxLTgwYmMtNTcyNDcwNWYyMmM0IiwidCI6ImM5YTUyNjg2LTFhYzMtNDBlZi05Yzk3LWEyZWYyOWIyOTdmYyIsImMiOjR9" }
};

let frame, loader, pageTitle, sidebar, mobileOverlay;

function initElements() {
    frame = document.getElementById('powerbi-frame');
    loader = document.getElementById('loader');
    pageTitle = document.getElementById('page-title');
    sidebar = document.getElementById('sidebar');
    mobileOverlay = document.getElementById('mobile-overlay');
}

function loadReport(reportKey) {
    const report = reports[reportKey];
    if (!report) return;

    if(loader) loader.style.display = 'flex';
    if(pageTitle) pageTitle.innerText = `${report.title}`; 

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('bg-brand-accent', 'text-white', 'shadow-md', 'border', 'border-brand-accent');
        btn.classList.add('text-gray-400', 'hover:bg-gray-800', 'hover:text-white');
    });

    const activeBtn = document.getElementById(`btn-${reportKey}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-400', 'hover:bg-gray-800', 'hover:text-white');
        activeBtn.classList.add('bg-brand-accent', 'text-white', 'shadow-md', 'border', 'border-brand-accent');
    }

    if(frame) {
        frame.src = report.url;
        frame.onload = function() { setTimeout(() => { loader.style.display = 'none'; }, 1000); };
    }
    setTimeout(() => { if(loader) loader.style.display = 'none'; }, 3000);
    if (window.innerWidth < 1024) closeMobileSidebar();
}

function handleMenuClick() {
    if (window.innerWidth >= 1024) toggleDesktopSidebar(); else toggleMobileSidebar();
}

function toggleMobileSidebar() {
    sidebar.classList.toggle('-translate-x-full');
    if (sidebar.classList.contains('-translate-x-full')) mobileOverlay.classList.add('hidden');
    else mobileOverlay.classList.remove('hidden');
}

function closeMobileSidebar() {
    if(sidebar) sidebar.classList.add('-translate-x-full');
    if(mobileOverlay) mobileOverlay.classList.add('hidden');
}

function toggleDesktopSidebar() {
    if (sidebar.classList.contains('w-0')) {
        sidebar.classList.remove('w-0'); sidebar.classList.add('w-64');
    } else {
        sidebar.classList.remove('w-64'); sidebar.classList.add('w-0');
    }
}

function refreshFrame() {
    if(!loader || !frame) return;
    loader.style.display = 'flex';
    const currentSrc = frame.src;
    frame.src = '';
    setTimeout(() => { frame.src = currentSrc; }, 100);
}

window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initElements();
    initTheme(); // Inicializar el tema guardado
    loadReport('efectividad');
});

window.addEventListener('resize', () => {
    if (!sidebar || !mobileOverlay) return;
    if (window.innerWidth >= 1024) {
        mobileOverlay.classList.add('hidden'); sidebar.classList.remove('-translate-x-full'); 
    } else {
        sidebar.classList.add('-translate-x-full'); sidebar.classList.remove('w-0'); sidebar.classList.add('w-64');
    }
});