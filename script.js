const progress = document.getElementById('progressBar');
const statusText = document.getElementById('bootStatus');
const startBtn = document.getElementById('startBtn');
const intro = document.getElementById('intro');
const mainContent = document.getElementById('mainContent');

const messages = ['Cargando recuerdos...', 'Verificando aprendizajes...', 'Compilando experiencias...', 'Sistema listo.'];
let step = 0;
setTimeout(() => progress.style.width = '100%', 100);
const bootTimer = setInterval(() => {
  step++;
  statusText.textContent = messages[Math.min(step, messages.length - 1)];
  if (step >= messages.length - 1) {
    clearInterval(bootTimer);
    startBtn.disabled = false;
    startBtn.classList.add('ready');
  }
}, 650);

// Desbloqueo silencioso al terminar de leer el mensaje
const letterLayout = document.getElementById('letterLayout');
const letterEnd = document.getElementById('letterEnd');
const sideAction = document.getElementById('sideAction');
let diplomaUnlocked = false;
let canUnlockByTime = false;

function unlockDiplomaButton() {
  if (diplomaUnlocked) return;
  diplomaUnlocked = true;
  letterLayout.classList.add('has-diploma');
  sideAction.hidden = false;
  burstParticles();
}

function checkIfFinishedReading() {
  if (diplomaUnlocked || !canUnlockByTime || !mainContent.classList.contains('active')) return;
  const rect = letterEnd.getBoundingClientRect();
  if (rect.top <= window.innerHeight - 20) {
    unlockDiplomaButton();
  }
}

startBtn.addEventListener('click', () => {
  intro.classList.remove('active');
  mainContent.classList.add('active');
  mainContent.setAttribute('aria-hidden', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  burstParticles();

  setTimeout(() => {
    canUnlockByTime = true;
    checkIfFinishedReading();
  }, 25000);
});

window.addEventListener('scroll', checkIfFinishedReading, { passive: true });
window.addEventListener('resize', checkIfFinishedReading);

// Modal del diploma
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const diplomaModal = document.getElementById('diplomaModal');
const studentNameInput = document.getElementById('studentNameInput');
const studentNameDisplay = document.getElementById('studentNameDisplay');

openModalBtn.addEventListener('click', () => {
  diplomaModal.classList.add('open');
  diplomaModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => studentNameInput.focus(), 100);
});

function closeModal() {
  diplomaModal.classList.remove('open');
  diplomaModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);
diplomaModal.addEventListener('click', (e) => {
  if (e.target === diplomaModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && diplomaModal.classList.contains('open')) closeModal();
});

// Actualización en vivo del nombre en el diploma
studentNameInput.addEventListener('input', (e) => {
  const value = e.target.value.trim();
  studentNameDisplay.textContent = value || 'Egresado/a de la Promoción 2026';
});

// Descargar diploma como imagen PNG con estética Desarrollo de Sistemas
const downloadImgBtn = document.getElementById('downloadImgBtn');
const downloadStatus = document.getElementById('downloadStatus');

function loadImageSafe(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

downloadImgBtn.addEventListener('click', async () => {
  const rawName = studentNameInput.value.trim();
  const studentName = rawName || 'Egresado/a de la Promoción 2026';
  const safeFileName = rawName
    ? `Diploma_Sistemas_${rawName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '').replace(/\s+/g, '_')}_2026.png`
    : 'Diploma_Desarrollo_Sistemas_2026.png';

  downloadImgBtn.disabled = true;
  downloadImgBtn.textContent = 'COMPILANDO IMAGEN...';

  try {
    await document.fonts.ready;

    const W = 1600;
    const H = 1120;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');

    // Fondo oscuro tecnológico
    const bgGrad = ctx.createRadialGradient(W / 2, H * 0.3, 100, W / 2, H / 2, W * 0.7);
    bgGrad.addColorStop(0, '#0d233f');
    bgGrad.addColorStop(1, '#050f1d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Cuadrícula sutil de fondo
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Carga segura de imágenes
    const [logoImg, gradImg] = await Promise.all([
      loadImageSafe('logo.png'),
      loadImageSafe('graduacion.jpg')
    ]);

    if (gradImg) {
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.drawImage(gradImg, 0, 72, W, H - 72);
      ctx.restore();
    }

    // Barra superior estilo IDE / Terminal
    ctx.fillStyle = '#0d213b';
    ctx.fillRect(0, 0, W, 72);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 72);
    ctx.lineTo(W, 72);
    ctx.stroke();

    // Botones de ventana (rojo, amarillo, verde)
    const dotColors = ['#ff5f56', '#ffbd2e', '#27c93f'];
    dotColors.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(46 + i * 32, 36, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px "DM Mono", monospace';
    ctx.fillText('~/desarrollo-de-sistemas/egresado_2026.exe', W / 2, 43);

    // Badge versión derecha
    drawRoundedRect(ctx, W - 260, 18, 220, 36, 18);
    ctx.fillStyle = 'rgba(0, 255, 136, 0.14)';
    ctx.fill();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#00ff88';
    ctx.font = '700 17px "DM Mono", monospace';
    ctx.fillText('v2026.11 STABLE', W - 150, 42);

    // Borde exterior cian neón
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, W - 6, H - 6);

    // Encabezado institucional + logos
    if (logoImg) {
      drawRoundedRect(ctx, 90, 105, 124, 124, 18);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.drawImage(logoImg, 100, 115, 104, 104);
    }

    if (gradImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(W - 152, 167, 60, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(gradImg, W - 212, 107, 120, 120);
      ctx.restore();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(W - 152, 167, 60, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#00ff88';
    ctx.font = '700 19px "DM Mono", monospace';
    ctx.fillText('// ESPACIO CURRICULAR: DESARROLLO DE SISTEMAS', W / 2, 135);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 34px "Space Grotesk", sans-serif';
    ctx.fillText('INSTITUTO NUESTRA SEÑORA DE FÁTIMA', W / 2, 178);

    ctx.fillStyle = '#67e8f9';
    ctx.font = '500 19px "DM Mono", monospace';
    ctx.fillText('6.º AÑO · TÉCNICO EN COMPUTACIÓN · BUENOS AIRES', W / 2, 214);

    // Línea punteada separadora
    ctx.save();
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 255);
    ctx.lineTo(W - 90, 255);
    ctx.stroke();
    ctx.restore();

    // Badge BUILD SUCCESSFUL
    drawRoundedRect(ctx, W / 2 - 240, 285, 480, 38, 8);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#00f0ff';
    ctx.font = '700 18px "DM Mono", monospace';
    ctx.fillText('✔ BUILD SUCCESSFUL · CICLO LECTIVO 2026', W / 2, 310);

    // Título principal
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 54px "Space Grotesk", sans-serif';
    ctx.fillText('CERTIFICADO DE COMPILACIÓN FINAL', W / 2, 382);

    // Caja terminal del alumno
    const boxW = 1140;
    const boxH = 145;
    const boxX = (W - boxW) / 2;
    const boxY = 415;

    drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 14);
    ctx.fillStyle = 'rgba(13, 33, 59, 0.92)';
    ctx.fill();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Borde izquierdo grueso verde neón
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(boxX, boxY + 8, 10, boxH - 16);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 19px "DM Mono", monospace';
    ctx.fillText('> developer --certified-name:', W / 2, boxY + 42);

    ctx.fillStyle = '#00ff88';
    ctx.font = '700 56px "Space Grotesk", sans-serif';
    ctx.fillText(studentName, W / 2, boxY + 110);

    // Texto descriptivo
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '400 23px "DM Mono", monospace';
    wrapText(
      ctx,
      'Por haber planificado, codificado, depurado y superado con éxito cada desafío técnico de Desarrollo de Sistemas, demostrando que cada error resuelto es la base para desplegar su mejor versión en producción.',
      W / 2,
      615,
      1180,
      36
    );

    // Panel de métricas (Estado / Stack / Commit)
    const statY = 755;
    const statH = 95;
    drawRoundedRect(ctx, 160, statY, W - 320, statH, 12);
    ctx.fillStyle = 'rgba(6, 18, 34, 0.95)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 15px "DM Mono", monospace';
    ctx.fillText('ESTADO DEL SISTEMA', 380, statY + 34);
    ctx.fillText('STACK ADQUIRIDO', W / 2, statY + 34);
    ctx.fillText('PRÓXIMO COMMIT', W - 380, statY + 34);

    ctx.fillStyle = '#67e8f9';
    ctx.font = '700 20px "DM Mono", monospace';
    ctx.fillText('DEPLOYED (100%)', 380, statY + 68);
    ctx.fillText('LÓGICA · CÓDIGO · CRITERIO', W / 2, statY + 68);
    ctx.fillText('UN NUEVO COMIENZO', W - 380, statY + 68);

    // Sello central tipo badge tech
    const sealY = 975;
    ctx.fillStyle = '#0d213b';
    ctx.beginPath();
    ctx.arc(W / 2, sealY, 74, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(W / 2, sealY, 74, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#00ff88';
    ctx.font = '700 14px "DM Mono", monospace';
    ctx.fillText('PROMOCIÓN', W / 2, sealY - 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 34px "Space Grotesk", sans-serif';
    ctx.fillText('2026', W / 2, sealY + 12);
    ctx.fillStyle = '#00ff88';
    ctx.font = '700 14px "DM Mono", monospace';
    ctx.fillText('6.º TÉCNICA', W / 2, sealY + 36);

    // Firmas izquierda y derecha
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 26px "Space Grotesk", sans-serif';
    ctx.fillText('Prof. Muñoz Laura', 360, 955);
    ctx.fillText('18 de noviembre de 2026', W - 360, 955);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(160, 972);
    ctx.lineTo(560, 972);
    ctx.moveTo(W - 560, 972);
    ctx.lineTo(W - 160, 972);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.font = '700 18px "DM Mono", monospace';
    ctx.fillText('Docente / Tech Lead', 360, 1002);
    ctx.fillText('Fecha de Release', W - 360, 1002);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 16px "DM Mono", monospace';
    ctx.fillText('Desarrollo de Sistemas', 360, 1028);
    ctx.fillText('Villa Soldati, Buenos Aires', W - 360, 1028);

    // Descarga directa
    const link = document.createElement('a');
    link.download = safeFileName;
    link.href = c.toDataURL('image/png');
    link.click();

    downloadStatus.textContent = '¡Diploma compilado y descargado!';
  } catch (err) {
    console.error(err);
    downloadStatus.textContent = 'Hubo un problema al generar la imagen. Intentá nuevamente.';
  } finally {
    downloadImgBtn.disabled = false;
    downloadImgBtn.innerHTML = '⤓ DESCARGAR DIPLOMA (IMAGEN PNG)';
  }
});

// Fondo de partículas liviano
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: Math.min(75, Math.floor(innerWidth / 15)) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.6 + .4,
    v: Math.random() * .35 + .08,
    a: Math.random() * .45 + .12
  }));
}
function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of particles) {
    p.y -= p.v;
    if (p.y < -5) { p.y = innerHeight + 5; p.x = Math.random() * innerWidth; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 240, 255, ${p.a})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
function burstParticles() {
  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * innerWidth,
      y: innerHeight * .35 + Math.random() * innerHeight * .3,
      r: Math.random() * 2 + 1,
      v: Math.random() * 1.5 + .5,
      a: .65
    });
  }
  particles = particles.slice(-130);
}
window.addEventListener('resize', resize);
resize();
draw();