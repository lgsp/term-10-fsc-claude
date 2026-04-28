const PI = Math.PI;
const R4 = v => isFinite(v) ? Math.round(v * 10000) / 10000 : '∞';

// ── HEADER WAVE ──────────────────────────────────────
(function() {
  const c = document.getElementById('header-wave');
  if (!c) return;
  const ctx = c.getContext('2d');
  let t = 0;
  function draw() {
    const W = c.parentElement.offsetWidth, H = 60;
    c.width = W; c.height = H;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= W; i++) {
      const x = i, y = H/2 - 18*Math.sin(2*PI*i/W*3 + t);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.strokeStyle = '#ff2d78'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= W; i++) {
      const x = i, y = H/2 - 12*Math.cos(2*PI*i/W*5 + t*1.3);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── CERCLE TRIGONOMÉTRIQUE ───────────────────────────
let circAnimId = null, circRunning = false, circTheta = PI/6;

function drawCircle(theta) {
  const canvas = document.getElementById('canvas-circ');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 880, H = canvas.offsetHeight || 380;
  canvas.width = W; canvas.height = H;

  const cx = W * 0.38, cy = H / 2, R = Math.min(cx, cy) - 30;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0a101e'; ctx.fillRect(0, 0, W, H);

  // Grid faint
  ctx.strokeStyle = 'rgba(14,30,48,0.9)'; ctx.lineWidth = 0.5;
  for (let i = -4; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(cx + i*R/2, cy - R - 10); ctx.lineTo(cx + i*R/2, cy + R + 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - R - 10, cy + i*R/2); ctx.lineTo(cx + R + 10, cy + i*R/2); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(0,229,255,0.3)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(cx - R - 20, cy); ctx.lineTo(cx + R + 20, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - R - 20); ctx.lineTo(cx, cy + R + 20); ctx.stroke();
  ctx.fillStyle = 'rgba(0,229,255,0.5)'; ctx.font = '11px Fira Code, monospace';
  ctx.fillText('x', cx + R + 22, cy + 4);
  ctx.fillText('y', cx + 4, cy - R - 22);
  ctx.fillText('O', cx + 5, cy + 14);
  ctx.fillText('1', cx + R - 4, cy + 14);
  ctx.fillText('-1', cx - R - 18, cy + 14);
  ctx.fillText('1', cx + 4, cy - R + 4);
  ctx.fillText('-1', cx + 4, cy + R + 12);

  // Unit circle
  ctx.strokeStyle = 'rgba(0,229,255,0.35)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2*PI); ctx.stroke();

  // Special angle markers
  const specialAngles = [0, PI/6, PI/4, PI/3, PI/2, 2*PI/3, 3*PI/4, 5*PI/6, PI, 7*PI/6, 5*PI/4, 4*PI/3, 3*PI/2, 5*PI/3, 7*PI/4, 11*PI/6];
  specialAngles.forEach(a => {
    const px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
    ctx.fillStyle = 'rgba(0,229,255,0.25)';
    ctx.beginPath(); ctx.arc(px, py, 3, 0, 2*PI); ctx.fill();
  });

  const mx = cx + R * Math.cos(theta), my = cy - R * Math.sin(theta);
  const cosV = Math.cos(theta), sinV = Math.sin(theta);

  // cos projection (horizontal)
  ctx.strokeStyle = 'rgba(0,229,255,0.7)'; ctx.lineWidth = 2; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(mx, cy); ctx.stroke();

  // sin projection (vertical)
  ctx.strokeStyle = 'rgba(255,45,120,0.7)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(mx, cy); ctx.lineTo(mx, my); ctx.stroke();

  // cos dashed to M
  ctx.strokeStyle = 'rgba(0,229,255,0.3)'; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, cy); ctx.stroke();
  ctx.setLineDash([]);

  // Radius
  ctx.strokeStyle = '#ffd040'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(mx, my); ctx.stroke();

  // Arc
  ctx.strokeStyle = 'rgba(255,208,64,0.5)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(cx, cy, 28, 0, -theta, theta < 0); ctx.stroke();
  // θ label
  const midA = theta / 2;
  ctx.fillStyle = '#ffd040'; ctx.font = '11px Fira Code,monospace';
  ctx.fillText('θ', cx + 34*Math.cos(midA) - 4, cy - 34*Math.sin(midA) + 4);

  // M dot
  ctx.fillStyle = '#ffd040';
  ctx.beginPath(); ctx.arc(mx, my, 6, 0, 2*PI); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Fira Code,monospace';
  ctx.fillText('M', mx + 8, my - 6);

  // cos label on x-axis
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath(); ctx.arc(mx, cy, 4, 0, 2*PI); ctx.fill();
  ctx.font = '11px Fira Code,monospace';
  ctx.fillText(`cos θ`, mx - 16, cy + 18);

  // sin label
  ctx.fillStyle = '#ff2d78';
  ctx.beginPath(); ctx.arc(mx, my, 3, 0, 2*PI); ctx.fill();
  ctx.font = '11px Fira Code,monospace';
  ctx.fillText(`sin θ`, cx - R - 5, (cy + my)/2 + 4);
  ctx.beginPath(); ctx.arc(cx, my, 3, 0, 2*PI); ctx.fill();

  // Right panel — numerical values + graph preview
  const px2 = W * 0.7, gW = W - px2 - 20, gH = H - 40;
  const gy = H / 2;

  ctx.fillStyle = '#0c1222'; ctx.fillRect(px2, 20, gW, gH);
  ctx.strokeStyle = var2hex('--border'); ctx.lineWidth = 0.5;
  ctx.strokeRect(px2, 20, gW, gH);

  // Values display
  ctx.font = 'bold 12px Fira Code,monospace';
  ctx.fillStyle = '#ffd040'; ctx.fillText(`θ = ${R4(theta)} rad`, px2 + 10, 50);
  ctx.fillStyle = '#fff';    ctx.fillText(`  = ${R4(theta*180/PI)}°`, px2 + 10, 66);
  ctx.fillStyle = '#00e5ff'; ctx.fillText(`cos θ = ${R4(cosV)}`, px2 + 10, 100);
  ctx.fillStyle = '#ff6fa0'; ctx.fillText(`sin θ = ${R4(sinV)}`, px2 + 10, 118);
  ctx.fillStyle = '#a060ff'; ctx.fillText(`cos²+sin² = ${R4(cosV*cosV+sinV*sinV)}`, px2 + 10, 136);

  // Mini sine/cosine preview
  const miny = 165, maxy = gH + 20 - 10, mHeight = maxy - miny;
  const mW = gW - 20;
  ctx.strokeStyle = 'rgba(0,229,255,0.4)'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i <= mW; i++) {
    const a = -PI + i/mW * 4*PI;
    const y = miny + mHeight/2 - (mHeight/2 - 6)*Math.cos(a);
    i === 0 ? ctx.moveTo(px2+10+i, y) : ctx.lineTo(px2+10+i, y);
  }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,45,120,0.4)'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i <= mW; i++) {
    const a = -PI + i/mW * 4*PI;
    const y = miny + mHeight/2 - (mHeight/2 - 6)*Math.sin(a);
    i === 0 ? ctx.moveTo(px2+10+i, y) : ctx.lineTo(px2+10+i, y);
  }
  ctx.stroke();
  // theta marker on mini graph
  const ti = (theta + PI) / (4*PI) * mW;
  if (ti >= 0 && ti <= mW) {
    const yc = miny + mHeight/2 - (mHeight/2 - 6)*cosV;
    const ys = miny + mHeight/2 - (mHeight/2 - 6)*sinV;
    ctx.fillStyle = '#00e5ff'; ctx.beginPath(); ctx.arc(px2+10+ti, yc, 4, 0, 2*PI); ctx.fill();
    ctx.fillStyle = '#ff2d78'; ctx.beginPath(); ctx.arc(px2+10+ti, ys, 4, 0, 2*PI); ctx.fill();
    ctx.strokeStyle = 'rgba(255,208,64,0.4)'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(px2+10+ti, miny); ctx.lineTo(px2+10+ti, maxy); ctx.stroke();
    ctx.setLineDash([]);
  }

  // Update display
  document.getElementById('circ-vals').textContent =
    `cos=${R4(cosV)}  sin=${R4(sinV)}  θ=${R4(theta*180/PI)}°`;
}

function var2hex(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#0e1e30'; }

function updateCircle() {
  const v = +document.getElementById('circ-theta').value;
  circTheta = v;
  drawCircle(v);
}
window.addEventListener('resize', () => drawCircle(circTheta));
setTimeout(() => drawCircle(circTheta), 100);

function toggleCircAnim() {
  circRunning = document.getElementById('circ-anim').checked;
  if (circRunning) {
    (function loop() {
      if (!circRunning) return;
      circTheta += 0.025;
      document.getElementById('circ-theta').value = R4(circTheta);
      drawCircle(circTheta);
      circAnimId = requestAnimationFrame(loop);
    })();
  } else {
    cancelAnimationFrame(circAnimId);
  }
}

// ── WAVES ────────────────────────────────────────────
function drawWaves() {
  const canvas = document.getElementById('canvas-waves');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 880, H = canvas.offsetHeight || 260;
  canvas.width = W; canvas.height = H;
  const periods = +document.getElementById('wave-per').value || 2;
  const showSin = document.getElementById('show-sin').checked;
  const showCos = document.getElementById('show-cos').checked;
  const xmin = 0, xmax = periods * 2*PI;
  const pad = {l:50,r:20,t:15,b:35};
  const gW = W-pad.l-pad.r, gH = H-pad.t-pad.b;
  const toX = t => pad.l + (t-xmin)/(xmax-xmin)*gW;
  const toY = v => pad.t + gH/2 - v*(gH/2-5);

  ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a101e'; ctx.fillRect(0,0,W,H);

  // Grid
  ctx.strokeStyle='rgba(14,30,48,0.9)'; ctx.lineWidth=0.7;
  for(let k=0;k<=Math.ceil(periods*2);k++){
    const x=toX(k*PI);
    ctx.beginPath();ctx.moveTo(x,pad.t);ctx.lineTo(x,pad.t+gH);ctx.stroke();
    ctx.fillStyle='rgba(120,152,184,0.5)';ctx.font='9px Fira Code,monospace';
    ctx.fillText(k===0?'0':`${k}π`,x-8,pad.t+gH+14);
  }
  for(let v of[-1,-0.5,0,0.5,1]){
    const y=toY(v);
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+gW,y);ctx.stroke();
    ctx.fillStyle='rgba(120,152,184,0.5)';ctx.font='9px Fira Code,monospace';
    ctx.fillText(v,2,y+3);
  }

  // Zero axis
  ctx.strokeStyle='rgba(0,229,255,0.2)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(pad.l,toY(0));ctx.lineTo(pad.l+gW,toY(0));ctx.stroke();

  // sin
  if(showSin){
    ctx.strokeStyle='#ff2d78';ctx.lineWidth=2.2;
    ctx.beginPath();
    for(let i=0;i<=W*2;i++){
      const t=xmin+i/(W*2)*(xmax-xmin);
      const v=Math.sin(t);
      i===0?ctx.moveTo(toX(t),toY(v)):ctx.lineTo(toX(t),toY(v));
    }
    ctx.stroke();
    ctx.fillStyle='#ff6fa0';ctx.font='bold 11px Fira Code,monospace';
    ctx.fillText('sin(x)',pad.l+6,pad.t+14);
  }

  // cos
  if(showCos){
    ctx.strokeStyle='#00e5ff';ctx.lineWidth=2.2;
    ctx.beginPath();
    for(let i=0;i<=W*2;i++){
      const t=xmin+i/(W*2)*(xmax-xmin);
      const v=Math.cos(t);
      i===0?ctx.moveTo(toX(t),toY(v)):ctx.lineTo(toX(t),toY(v));
    }
    ctx.stroke();
    ctx.fillStyle='#00e5ff';ctx.font='bold 11px Fira Code,monospace';
    ctx.fillText('cos(x)',pad.l+6,pad.t+(showSin?28:14));
  }
}
window.addEventListener('resize', drawWaves);
setTimeout(drawWaves, 120);

// ── EQUATIONS GRAPH ──────────────────────────────────
function drawEqGraph() {
  const canvas = document.getElementById('canvas-eq');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 880, H = canvas.offsetHeight || 340;
  canvas.width = W; canvas.height = H;
  const eqType = document.getElementById('eq-type').value;
  const a = +document.getElementById('eq-a').value;

  const cx = W*0.3, cy = H/2, R = Math.min(cx, cy) - 25;

  ctx.clearRect(0,0,W,H); ctx.fillStyle='#0a101e'; ctx.fillRect(0,0,W,H);

  // Circle
  ctx.strokeStyle='rgba(0,229,255,0.25)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(cx,cy,R,0,2*PI);ctx.stroke();

  // Axes
  ctx.strokeStyle='rgba(0,229,255,0.2)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(cx-R-15,cy);ctx.lineTo(cx+R+15,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-R-15);ctx.lineTo(cx,cy+R+15);ctx.stroke();

  // Reference line and solutions
  let sols = [], lineX1, lineY1, lineX2, lineY2;
  if (eqType === 'cos' && Math.abs(a) <= 1) {
    // cos(θ)=a → vertical line x=a·R
    const px = cx + a*R;
    lineX1=px; lineY1=cy-R-10; lineX2=px; lineY2=cy+R+10;
    ctx.strokeStyle='rgba(255,208,64,0.6)';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);
    ctx.beginPath();ctx.moveTo(lineX1,lineY1);ctx.lineTo(lineX2,lineY2);ctx.stroke();ctx.setLineDash([]);

    const theta0 = Math.acos(a);
    sols = [theta0, -theta0];
  } else if (eqType === 'sin' && Math.abs(a) <= 1) {
    // sin(θ)=a → horizontal line y=a
    const py = cy - a*R;
    lineX1=cx-R-10; lineY1=py; lineX2=cx+R+10; lineY2=py;
    ctx.strokeStyle='rgba(255,208,64,0.6)';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);
    ctx.beginPath();ctx.moveTo(lineX1,lineY1);ctx.lineTo(lineX2,lineY2);ctx.stroke();ctx.setLineDash([]);

    const theta0 = Math.asin(a);
    sols = [theta0, PI - theta0];
  }

  // Mark solutions
  const colors = ['#00e5ff','#ff2d78'];
  sols.forEach((theta, i) => {
    const mx = cx + R*Math.cos(theta), my = cy - R*Math.sin(theta);
    ctx.fillStyle = colors[i];
    ctx.beginPath();ctx.arc(mx,my,7,0,2*PI);ctx.fill();
    // Radius
    ctx.strokeStyle = colors[i];ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(mx,my);ctx.stroke();
    // Label
    ctx.font='bold 11px Fira Code,monospace';ctx.fillStyle=colors[i];
    const labelR = R + 18;
    ctx.fillText(`θ${i+1}≈${R4(theta)}`,cx+labelR*Math.cos(theta)-20,cy-labelR*Math.sin(theta)+4);
  });

  // Right panel — wave
  const px2 = W*0.62, gW2=W-px2-20, gH2=H-40;
  ctx.fillStyle='#0c1222';ctx.fillRect(px2,20,gW2,gH2);

  const xmin2=0,xmax2=2*PI;
  const p2={l:10,r:10,t:10,b:20};
  const tox2=t=>px2+p2.l+(t-xmin2)/(xmax2-xmin2)*(gW2-p2.l-p2.r);
  const toy2=v=>20+p2.t+(gH2-p2.t-p2.b)/2*(1-v);

  // Gridline y=a
  const yLine=toy2(a);
  ctx.strokeStyle='rgba(255,208,64,0.5)';ctx.lineWidth=1;ctx.setLineDash([4,3]);
  ctx.beginPath();ctx.moveTo(px2+p2.l,yLine);ctx.lineTo(px2+gW2-p2.r,yLine);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#ffd040';ctx.font='10px Fira Code,monospace';ctx.fillText(`a=${R4(a)}`,px2+gW2-p2.r-35,yLine-3);

  // Function curve
  const fn = eqType==='cos' ? Math.cos : Math.sin;
  const col = eqType==='cos' ? '#00e5ff' : '#ff2d78';
  ctx.strokeStyle=col;ctx.lineWidth=2;
  ctx.beginPath();
  for(let i=0;i<=gW2*2;i++){
    const t=xmin2+i/(gW2*2)*(xmax2-xmin2);
    const v=fn(t);
    i===0?ctx.moveTo(tox2(t),toy2(v)):ctx.lineTo(tox2(t),toy2(v));
  }
  ctx.stroke();

  // Mark solutions on wave
  sols.forEach((theta,i)=>{
    const ts = ((theta % (2*PI)) + 2*PI) % (2*PI);
    const xs=tox2(ts), ys=toy2(fn(ts));
    ctx.fillStyle=colors[i];ctx.beginPath();ctx.arc(xs,ys,5,0,2*PI);ctx.fill();
    ctx.strokeStyle='rgba(255,208,64,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(xs,yLine);ctx.lineTo(xs,ys);ctx.stroke();ctx.setLineDash([]);
  });

  // Labels
  ctx.fillStyle=col;ctx.font='bold 10px Fira Code,monospace';
  ctx.fillText(eqType==='cos'?'cos(θ)':'sin(θ)',px2+p2.l,20+p2.t+12);
}
window.addEventListener('resize',drawEqGraph);
setTimeout(drawEqGraph,130);

// ── SIGNAL ───────────────────────────────────────────
function drawSignal() {
  const canvas=document.getElementById('canvas-signal');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const W=canvas.offsetWidth||880,H=canvas.offsetHeight||260;
  canvas.width=W;canvas.height=H;

  const A=+document.getElementById('sig-A').value;
  const w=+document.getElementById('sig-w').value;
  const phi=+document.getElementById('sig-phi').value;
  const showDeriv=document.getElementById('sig-deriv').checked;

  document.getElementById('sig-A-v').textContent=A.toFixed(1);
  document.getElementById('sig-w-v').textContent=w.toFixed(1);
  document.getElementById('sig-phi-v').textContent=phi.toFixed(2);

  const T=2*PI/w;
  const xmax=3*T, xmin=0;
  const pad={l:42,r:20,t:15,b:32};
  const gW=W-pad.l-pad.r,gH=H-pad.t-pad.b;
  const toX=t=>pad.l+(t-xmin)/(xmax-xmin)*gW;
  const toY=v=>pad.t+gH/2-v*(gH/2-6)/Math.max(A,1);

  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a101e';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(14,30,48,0.9)';ctx.lineWidth=0.7;
  for(let k=0;k<=3;k++){
    const x=toX(k*T);
    ctx.beginPath();ctx.moveTo(x,pad.t);ctx.lineTo(x,pad.t+gH);ctx.stroke();
    ctx.fillStyle='rgba(120,152,184,0.5)';ctx.font='9px Fira Code,monospace';
    ctx.fillText(`${k}T`,x-8,pad.t+gH+14);
  }
  for(let v of[-A,-A/2,0,A/2,A]){
    const y=toY(v);
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+gW,y);ctx.stroke();
    ctx.fillStyle='rgba(120,152,184,0.4)';ctx.font='9px Fira Code,monospace';
    ctx.fillText(R4(v),2,y+3);
  }
  ctx.strokeStyle='rgba(0,229,255,0.2)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(pad.l,toY(0));ctx.lineTo(pad.l+gW,toY(0));ctx.stroke();

  // Amplitude lines
  ctx.strokeStyle='rgba(160,96,255,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,3]);
  ctx.beginPath();ctx.moveTo(pad.l,toY(A));ctx.lineTo(pad.l+gW,toY(A));ctx.stroke();
  ctx.beginPath();ctx.moveTo(pad.l,toY(-A));ctx.lineTo(pad.l+gW,toY(-A));ctx.stroke();
  ctx.setLineDash([]);

  // Derivative
  if(showDeriv){
    ctx.strokeStyle='rgba(255,208,64,0.6)';ctx.lineWidth=1.5;
    ctx.beginPath();
    for(let i=0;i<=W*2;i++){
      const t=xmin+i/(W*2)*(xmax-xmin);
      const v=-A*w*Math.sin(w*t+phi);
      i===0?ctx.moveTo(toX(t),toY(v)):ctx.lineTo(toX(t),toY(v));
    }
    ctx.stroke();
  }

  // Signal
  ctx.strokeStyle='#00e5ff';ctx.lineWidth=2.4;
  ctx.beginPath();
  for(let i=0;i<=W*2;i++){
    const t=xmin+i/(W*2)*(xmax-xmin);
    const v=A*Math.cos(w*t+phi);
    i===0?ctx.moveTo(toX(t),toY(v)):ctx.lineTo(toX(t),toY(v));
  }
  ctx.stroke();

  // Period annotation
  const T1=toX(0),T2=toX(T);
  ctx.strokeStyle='rgba(160,96,255,0.5)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(T1,pad.t+4);ctx.lineTo(T2,pad.t+4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(T1,pad.t+1);ctx.lineTo(T1,pad.t+7);ctx.stroke();
  ctx.beginPath();ctx.moveTo(T2,pad.t+1);ctx.lineTo(T2,pad.t+7);ctx.stroke();
  ctx.fillStyle='#a060ff';ctx.font='10px Fira Code,monospace';
  ctx.fillText(`T=${R4(T)}`,((T1+T2)/2)-10,pad.t-1);

  // Labels
  ctx.fillStyle='#00e5ff';ctx.font='bold 11px Fira Code,monospace';
  ctx.fillText(`f(t) = ${A}·cos(${R4(w)}t + ${R4(phi)})`,pad.l+4,pad.t+14);
  if(showDeriv){ctx.fillStyle='#ffd040';ctx.fillText(`f′(t) = −${R4(A*w)}·sin(${R4(w)}t+${R4(phi)})`,pad.l+4,pad.t+28);}
}
window.addEventListener('resize',drawSignal);
setTimeout(drawSignal,140);

// ── CALCULATEURS ─────────────────────────────────────
const ANGLE_MAP = {
  '0':PI*0,'pi6':PI/6,'pi4':PI/4,'pi3':PI/3,'pi2':PI/2,
  '2pi3':2*PI/3,'3pi4':3*PI/4,'5pi6':5*PI/6,'pi':PI,
  '7pi6':7*PI/6,'5pi4':5*PI/4,'4pi3':4*PI/3,'3pi2':3*PI/2,
  '5pi3':5*PI/3,'7pi4':7*PI/4,'11pi6':11*PI/6,'2pi':2*PI
};
const ANGLE_LABELS = {
  '0':'0','pi6':'π/6','pi4':'π/4','pi3':'π/3','pi2':'π/2',
  '2pi3':'2π/3','3pi4':'3π/4','5pi6':'5π/6','pi':'π',
  '7pi6':'7π/6','5pi4':'5π/4','4pi3':'4π/3','3pi2':'3π/2',
  '5pi3':'5π/3','7pi4':'7π/4','11pi6':'11π/6','2pi':'2π'
};
function calcAngle() {
  const key=document.getElementById('ang-val').value;
  const theta=ANGLE_MAP[key]||0;
  const el=document.getElementById('ang-res');
  const c=Math.cos(theta),s=Math.sin(theta);
  el.innerHTML=`θ = ${ANGLE_LABELS[key]} = ${R4(theta)} rad = ${R4(theta*180/PI)}°\ncos(θ) = ${R4(c)}\nsin(θ) = ${R4(s)}\ncos²+sin² = ${R4(c*c+s*s)}`;
  if(window.MathJax)MathJax.typeset([el]);
}
calcAngle();

function calcFormule() {
  const a=+document.getElementById('fa-a').value;
  const b=+document.getElementById('fa-b').value;
  const el=document.getElementById('fa-res');
  const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
  const results = [
    `cos(a+b) = ${R4(Math.cos(a+b))}  =  cos(a)cos(b)-sin(a)sin(b) = ${R4(ca*cb-sa*sb)}`,
    `sin(a+b) = ${R4(Math.sin(a+b))}  =  sin(a)cos(b)+cos(a)sin(b) = ${R4(sa*cb+ca*sb)}`,
    `cos(2a)  = ${R4(Math.cos(2*a))}  =  2cos²(a)-1 = ${R4(2*ca*ca-1)}`,
    `sin(2a)  = ${R4(Math.sin(2*a))}  =  2sin(a)cos(a) = ${R4(2*sa*ca)}`,
  ];
  el.textContent = results.join('\n');
}
calcFormule();

function calcDeriv() {
  const key=document.getElementById('der-func').value;
  const x0=+document.getElementById('der-x').value;
  const el=document.getElementById('der-res');
  const fns={
    sin3x:    {f:x=>Math.sin(3*x),    fp:x=>3*Math.cos(3*x),              s:'sin(3x)',     sp:"3·cos(3x)"},
    cosx2:    {f:x=>Math.cos(x*x),    fp:x=>-2*x*Math.sin(x*x),           s:'cos(x²)',     sp:"-2x·sin(x²)"},
    sin2x:    {f:x=>Math.sin(x)**2,   fp:x=>2*Math.sin(x)*Math.cos(x),    s:'sin²(x)',     sp:"2sin(x)cos(x)=sin(2x)"},
    esinx:    {f:x=>Math.exp(Math.sin(x)), fp:x=>Math.cos(x)*Math.exp(Math.sin(x)), s:'e^(sin x)', sp:"cos(x)·e^(sin x)"},
    xcosxv:   {f:x=>x*Math.cos(x),    fp:x=>Math.cos(x)-x*Math.sin(x),    s:'x·cos(x)',   sp:"cos(x)-x·sin(x)"},
    sin2xcos3x:{f:x=>Math.sin(2*x)*Math.cos(3*x), fp:x=>2*Math.cos(2*x)*Math.cos(3*x)-3*Math.sin(2*x)*Math.sin(3*x), s:'sin(2x)·cos(3x)', sp:"2cos(2x)cos(3x)-3sin(2x)sin(3x)"},
    lnsinx:   {f:x=>Math.log(Math.sin(x)), fp:x=>Math.cos(x)/Math.sin(x), s:'ln(sin x)',  sp:"cos(x)/sin(x)=cot(x)"},
    sqrtcosx: {f:x=>Math.sqrt(Math.cos(x)), fp:x=>-Math.sin(x)/(2*Math.sqrt(Math.cos(x))), s:'√(cos x)', sp:"-sin(x)/(2√(cos x))"},
  };
  const d=fns[key];if(!d){el.textContent='Erreur';return;}
  try{
    const fx=d.f(x0),fpx=d.fp(x0);
    el.innerHTML=`f(x) = ${d.s}\nf'(x) = ${d.sp}\nf(${R4(x0)}) = ${R4(fx)}\nf'(${R4(x0)}) = ${R4(fpx)}`;
    if(window.MathJax)MathJax.typeset([el]);
  }catch{el.textContent='Valeur hors domaine';}
}
calcDeriv();

function calcEq() {
  const type=document.getElementById('eq-sel').value;
  const a=+document.getElementById('eq-aval').value;
  const el=document.getElementById('eq-res');
  if(Math.abs(a)>1){el.textContent=`Pas de solution (|a|=${Math.abs(a).toFixed(2)}>1)`;return;}
  const sols2pi = [];
  if(type==='cos'){
    const t0=Math.acos(a);
    sols2pi.push(t0);
    if(Math.abs(t0)>1e-9)sols2pi.push(2*PI-t0);
  }else{
    const t0=Math.asin(a);
    const t1=PI-t0;
    const s0=((t0%(2*PI))+2*PI)%(2*PI);
    const s1=((t1%(2*PI))+2*PI)%(2*PI);
    sols2pi.push(s0);if(Math.abs(s0-s1)>1e-9)sols2pi.push(s1);
  }
  sols2pi.sort((a,b)=>a-b);
  const solsStr=sols2pi.map(s=>`${R4(s)} ≈ ${R4(s*180/PI)}°`).join('\n');
  el.textContent=`${type}(θ) = ${a}\nSolutions sur [0;2π]:\n${solsStr}\nForme générale : θ = ${type==='cos'?`±arccos(${a}) + 2kπ`:`arcsin(${a}) + 2kπ  ou  π-arcsin(${a}) + 2kπ`}`;
}
calcEq();

// ── PYODIDE ──────────────────────────────────────────
let pyodide=null,pyoLoad=false;
const origC={};
document.querySelectorAll('.py-code').forEach(ta=>{origC[ta.id]=ta.value;});
async function loadPyo(){
  if(pyodide)return true;if(pyoLoad)return false;pyoLoad=true;
  const st=document.getElementById('py-status');st.textContent='⏳ Chargement Python…';
  try{
    const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
    document.head.appendChild(s);await new Promise((res,rej)=>{s.onload=res;s.onerror=rej;});
    pyodide=await window.loadPyodide();
    st.textContent='✓ Python prêt';st.classList.add('ready');setTimeout(()=>st.classList.add('hidden'),3000);return true;
  }catch(e){st.textContent='✗ Erreur Python';return false;}
}
async function runPy(id){
  const code=document.getElementById(id+'-code').value;
  const out=document.getElementById(id+'-out');
  out.className='py-out active';out.textContent='⏳ Exécution…';out.style.color='#888';
  const ok=await loadPyo();
  if(!ok){out.className='py-out active error';out.textContent='Python non disponible.';return;}
  try{let stdout='';pyodide.setStdout({batched:s=>stdout+=s+'\n'});await pyodide.runPythonAsync(code);out.className='py-out active';out.style.color='#a6e3a1';out.textContent=stdout||'(aucune sortie)';}
  catch(e){out.className='py-out active error';out.textContent='⚠ '+e.message;}
}
function dlPy(id){const code=document.getElementById(id+'-code').value;const fname=document.getElementById(id+'-code').closest('.py-block').querySelector('.py-title').textContent.trim();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([code],{type:'text/plain'}));a.download=fname;a.click();}
function rstPy(id){document.getElementById(id+'-code').value=origC[id+'-code'];const out=document.getElementById(id+'-out');out.className='py-out';out.textContent='';}

// ── QCM ──────────────────────────────────────────────
const allQ=[
  {q:"\\(\\cos(\\pi/3)\\) vaut :",
   opts:["\\(\\dfrac{\\sqrt{3}}{2}\\)","\\(\\dfrac{1}{2}\\)","\\(\\dfrac{\\sqrt{2}}{2}\\)","\\(0\\)"],ans:1,
   exp:"\\(\\cos(\\pi/3)=1/2\\). Valeur à mémoriser : côté adjacent sur hypoténuse dans le triangle \\(30°\\text{-}60°\\text{-}90°\\)."},
  {q:"\\(\\sin(3\\pi/4)\\) vaut :",
   opts:["\\(-\\dfrac{\\sqrt{2}}{2}\\)","\\(\\dfrac{\\sqrt{2}}{2}\\)","\\(-\\dfrac{1}{2}\\)","\\(1\\)"],ans:1,
   exp:"\\(\\sin(3\\pi/4)=\\sin(\\pi-\\pi/4)=\\sin(\\pi/4)=\\sqrt{2}/2\\)."},
  {q:"La dérivée de \\(f(x)=\\sin(3x)\\) est :",
   opts:["\\(\\cos(3x)\\)","\\(3\\cos(3x)\\)","\\(-3\\cos(3x)\\)","\\(\\sin(3)\\cos(x)\\)"],ans:1,
   exp:"\\(u=3x\\), \\(u'=3\\) → \\((\\sin u)'=u'\\cos u=3\\cos(3x)\\)."},
  {q:"\\(\\cos(-\\theta)=\\)",
   opts:["\\(-\\cos\\theta\\)","\\(\\cos\\theta\\)","\\(\\sin\\theta\\)","\\(-\\sin\\theta\\)"],ans:1,
   exp:"\\(\\cos\\) est <em>paire</em> : \\(\\cos(-\\theta)=\\cos\\theta\\) pour tout \\(\\theta\\)."},
  {q:"Les solutions de \\(\\cos\\theta=1/2\\) sont :",
   opts:["\\(\\theta=\\pi/3+2k\\pi\\)","\\(\\theta=\\pm\\pi/3+2k\\pi\\)","\\(\\theta=\\pi/6+2k\\pi\\)","\\(\\theta=\\pi/3+k\\pi\\)"],ans:1,
   exp:"\\(\\cos\\theta=a\\Rightarrow\\theta=\\pm\\arccos(a)+2k\\pi\\). Ici \\(\\arccos(1/2)=\\pi/3\\)."},
  {q:"\\(\\sin(2a)=\\)",
   opts:["\\(2\\sin^2 a\\)","\\(\\sin^2 a-\\cos^2 a\\)","\\(2\\sin a\\cos a\\)","\\(\\cos(2a)\\)"],ans:2,
   exp:"Formule de duplication : \\(\\sin(a+a)=\\sin a\\cos a+\\cos a\\sin a=2\\sin a\\cos a\\)."},
  {q:"La dérivée de \\(f(x)=\\cos^2 x\\) est :",
   opts:["\\(2\\cos x\\)","\\(-2\\cos x\\sin x\\)","\\(-\\sin(2x)\\)","B et C sont identiques"],ans:3,
   exp:"\\(f'(x)=2\\cos x\\cdot(-\\sin x)=-2\\cos x\\sin x=-\\sin(2x)\\). Les réponses B et C sont bien identiques."},
  {q:"\\(\\cos(2a)=\\)",
   opts:["\\(2\\cos^2a\\)","\\(\\cos^2a-\\sin^2a\\)","\\(2\\cos^2a-1\\)","B et C sont identiques, et aussi \\(1-2\\sin^2a\\)"],ans:3,
   exp:"\\(\\cos(2a)=\\cos^2a-\\sin^2a=2\\cos^2a-1=1-2\\sin^2a\\). Ces trois formes sont équivalentes."},
  {q:"La période de \\(f(t)=\\cos(3t)\\) est :",
   opts:["\\(3\\)","\\(2\\pi\\)","\\(\\pi/3\\)","\\(2\\pi/3\\)"],ans:3,
   exp:"\\(T=2\\pi/\\omega=2\\pi/3\\). La pulsation est \\(\\omega=3\\), donc \\(T=2\\pi/3\\)."},
  {q:"\\(\\sin(\\pi/2-\\theta)=\\)",
   opts:["\\(\\sin\\theta\\)","\\(-\\sin\\theta\\)","\\(\\cos\\theta\\)","\\(-\\cos\\theta\\)"],ans:2,
   exp:"Relation de complémentarité : \\(\\sin(\\pi/2-\\theta)=\\cos\\theta\\)."},
  {q:"Pour \\(f(x)=3\\cos(2x+\\pi/4)\\), l'amplitude est :",
   opts:["\\(2\\)","\\(\\pi/4\\)","\\(3\\)","\\(1/2\\)"],ans:2,
   exp:"L'amplitude d'un signal \\(A\\cos(\\omega t+\\varphi)\\) est \\(|A|=3\\). La pulsation est \\(\\omega=2\\) et la phase \\(\\varphi=\\pi/4\\)."},
  {q:"\\(\\cos(a+b)+\\cos(a-b)=\\)",
   opts:["\\(2\\cos a\\cos b\\)","\\(2\\sin a\\sin b\\)","\\(2\\cos(a+b)\\)","\\(\\cos^2a-\\sin^2b\\)"],ans:0,
   exp:"\\(\\cos(a+b)=\\cos a\\cos b-\\sin a\\sin b\\) et \\(\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b\\). La somme vaut \\(2\\cos a\\cos b\\)."},
];

let curQ=[],answered={},cSec=0,cPaused=false,cIntv=null;
function shuf(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function pad2(n){return String(n).padStart(2,'0');}
function newQCM(){answered={};curQ=shuf(allQ).slice(0,8);document.getElementById('qcm-r').classList.remove('active');document.getElementById('sc-v').textContent='0 / 0';resetC();startC();renderQ();}
function renderQ(){
  const c=document.getElementById('qcm-c');
  c.innerHTML=curQ.map((q,qi)=>`
    <div class="qcm-q" id="qq-${qi}">
      <div class="qcm-question">${qi+1}. ${q.q}</div>
      <div class="qcm-opts">
        ${q.opts.map((o,oi)=>`
          <div class="qcm-opt" id="opt-${qi}-${oi}" onclick="selO(${qi},${oi})">
            <span class="opt-l">${String.fromCharCode(65+oi)}</span><span>${o}</span>
          </div>`).join('')}
      </div>
      <div class="qcm-fb" id="fb-${qi}"></div>
    </div>`).join('');
  if(window.MathJax)MathJax.typeset([c]);
}
function selO(qi,oi){if(answered[qi]!==undefined)return;document.querySelectorAll(`#qq-${qi} .qcm-opt`).forEach(e=>e.classList.remove('selected'));document.getElementById(`opt-${qi}-${oi}`).classList.add('selected');answered[qi]=oi;}
function submitQCM(){
  let sc=0,tot=curQ.length;
  curQ.forEach((q,qi)=>{
    const ch=answered[qi];
    const qEl=document.getElementById(`qq-${qi}`),fb=document.getElementById(`fb-${qi}`);
    q.opts.forEach((_,oi)=>{const el=document.getElementById(`opt-${qi}-${oi}`);el.classList.add('disabled');if(oi===q.ans)el.classList.add('correct');if(ch===oi&&ch!==q.ans)el.classList.add('wrong');});
    if(ch===q.ans){sc++;qEl.classList.add('correct');fb.innerHTML=`✓ Correct ! ${q.exp}`;}
    else{qEl.classList.add('wrong');fb.innerHTML=`✗ ${ch===undefined?'Non répondu. ':''}Réponse : <strong>${q.opts[q.ans]}</strong>. ${q.exp}`;}
    fb.classList.add('active');
  });
  document.getElementById('sc-v').textContent=`${sc} / ${tot}`;
  const pct=Math.round(sc/tot*100);
  const msg=pct>=87?'🌊 Excellent — maîtrise parfaite des fonctions trigo !':pct>=62?'⚡ Bien ! Quelques formules à consolider.':'📐 À retravailler — relire le cercle et les formules.';
  document.getElementById('r-sc').textContent=`${sc} / ${tot} — ${pct} %`;
  document.getElementById('r-msg').textContent=msg;
  document.getElementById('qcm-r').classList.add('active');
  if(window.MathJax)MathJax.typeset([document.getElementById('qcm-r'),document.getElementById('qcm-c')]);
  stopC();
}
function startC(){stopC();cPaused=false;document.getElementById('btn-c').textContent='Pause';cIntv=setInterval(()=>{if(!cPaused){cSec++;document.getElementById('c-d').textContent=`${pad2(Math.floor(cSec/60))}:${pad2(cSec%60)}`;}},1000);}
function stopC(){clearInterval(cIntv);cIntv=null;}
function resetC(){stopC();cSec=0;cPaused=false;document.getElementById('c-d').textContent='00:00';document.getElementById('btn-c').textContent='Pause';}
function toggleC(){cPaused=!cPaused;document.getElementById('btn-c').textContent=cPaused?'Reprendre':'Pause';}
newQCM();

// ── SCROLL REVEAL & NAV ──────────────────────────────
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.07});
document.querySelectorAll('section').forEach(s=>io.observe(s));
const navLinks=document.querySelectorAll('nav a');
window.addEventListener('scroll',()=>{let cur='';document.querySelectorAll('main section').forEach(s=>{if(window.scrollY>=s.offsetTop-130)cur=s.id;});navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));},{passive:true});