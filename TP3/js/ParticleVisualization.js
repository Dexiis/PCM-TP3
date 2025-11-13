class ParticleVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Partículas";
    this.particles = [];

    // Inicializar partículas
    this.initParticles();

    this.addProperty("color", 1);
  }

  draw() {
    // TODO: desenhar partículas
    this.clearCanvas();

    if (this.getProperties().drawGrid) this.drawGrid();

    this.drawConnections();
    this.drawParticles();
  }

  update() {
    // TODO: atualizar partículas
    super.update();
    this.updateParticles();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }

  resetProperties() {
    this.getProperties().color = 1;
  }

  initParticles() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.clientWidth,
        y: Math.random() * this.canvas.clientHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius:
          (Math.random() * this.canvas.clientWidth) / 200 +
          this.canvas.clientHeight / 200,
        color: `rgba(255, 0, 0)`,
      });
    }
  }

  updateParticles() {
    // TODO: atualizar estado das partículas
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const audioLevel = this.audioProcessor
      ? this.audioProcessor.calculateAudioLevel() / 100
      : 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.color = `hsl(${this.getProperties().color}, 100%, 50%)`;

      // Mover partícula
      p.x += p.vx;
      p.y += p.vy;

      // Rebater nas bordas
      if (p.x < 0 || p.x > this.canvas.clientWidth) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.clientHeight) p.vy *= -1;

      // Aplicar influência do áudio
      if (data.length > 0) {
        const freqIndex = Math.floor((i / this.particles.length) * data.length);
        const intensity = data[freqIndex] / 255;

        p.vx += (Math.random() - 0.5) * intensity * 5;
        p.vy += (Math.random() - 0.5) * intensity * 5;

        // Limitar velocidade
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 0.5 + audioLevel * 15;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
      }
    }
  }

  drawParticles() {
    // TODO: desenhar partículas
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
  }

  drawConnections() {
    const maxDistance = 100;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(76, 201, 240, ${opacity * 0.8})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }
}
