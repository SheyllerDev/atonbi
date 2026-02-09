/* --- 1. ANIMACIÓN DE RAYOS REALISTAS --- */
const canvas = document.getElementById('lightningCanvas');
const ctx = canvas.getContext('2d');
let width, height, lightnings = [];
let mouseX = 0, mouseY = 0, isMouseMoving = false, mouseTimer;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY; isMouseMoving = true;
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => { isMouseMoving = false; }, 200);
});

class Lightning {
    constructor(targetX = null, targetY = null) {
        this.startX = Math.random() * width;
        this.startY = -10;
        this.targetX = targetX !== null ? targetX : (this.startX + (Math.random() - 0.5) * 500);
        this.targetY = targetY !== null ? targetY : height + 10;
        this.alpha = 1;
        this.path = [];
        this.createPath();
    }
    createPath() {
        let currX = this.startX; let currY = this.startY;
        this.path.push({x: currX, y: currY});
        let totalDist = Math.sqrt(Math.pow(this.targetX - this.startX, 2) + Math.pow(this.targetY - this.startY, 2));
        let currentDist = totalDist;
        const segmentLength = 15;
        while (currentDist > segmentLength) {
            const dx = this.targetX - currX; const dy = this.targetY - currY;
            const ratio = segmentLength / currentDist;
            let nextX = currX + dx * ratio; let nextY = currY + dy * ratio;
            const jitterAmount = (currentDist / totalDist) * 40;
            nextX += (Math.random() - 0.5) * jitterAmount;
            nextY += (Math.random() - 0.5) * (jitterAmount / 2);
            this.path.push({x: nextX, y: nextY});
            currX = nextX; currY = nextY;
            currentDist = Math.sqrt(Math.pow(this.targetX - currX, 2) + Math.pow(this.targetY - currY, 2));
        }
        this.path.push({x: this.targetX, y: this.targetY});
    }
    draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = "#dcfce7";
        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = 20;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) ctx.lineTo(this.path[i].x, this.path[i].y);
        ctx.stroke();
        const endPoint = this.path[this.path.length - 1];
        const gradient = ctx.createRadialGradient(endPoint.x, endPoint.y, 0, endPoint.x, endPoint.y, 15);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(103, 232, 249, 0)');
        ctx.fillStyle = gradient; ctx.shadowBlur = 0; ctx.beginPath();
        ctx.arc(endPoint.x, endPoint.y, 25, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        this.alpha -= 0.07;
    }
}

function animate() {
    ctx.fillStyle = "rgba(14, 46, 103, 0.25)";
    ctx.fillRect(0, 0, width, height);
    if (Math.random() < 0.03) lightnings.push(new Lightning());
    if (isMouseMoving && Math.random() < 0.25) lightnings.push(new Lightning(mouseX, mouseY));
    for (let i = lightnings.length - 1; i >= 0; i--) {
        lightnings[i].draw();
        if (lightnings[i].alpha <= 0) lightnings.splice(i, 1);
    }
    requestAnimationFrame(animate);
}
animate();

/* --- 2. LÓGICA DEL BOTÓN (EFECTO BIENVENIDO) --- */
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    
    // Estado 1: Verificando
    btn.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i> VERIFICANDO...';
    btn.style.pointerEvents = 'none'; // Desactiva clicks extra
    btn.style.opacity = '0.8';

    setTimeout(() => {
        // Estado 2: Éxito (Verde + ¡BIENVENIDO!)
        btn.innerHTML = '¡BIENVENIDO!';
        btn.style.background = '#22c55e'; // Verde Esmeralda
        btn.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.6)';
        btn.style.opacity = '1';

        // Redirección
        localStorage.setItem('sesion_iniciada', 'true');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
});