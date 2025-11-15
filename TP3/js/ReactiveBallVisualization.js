class ReactiveBallVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Bola Reativa";

    this.particles = [];

    this.scales = [0.8, 0.85, 0.9, 1, 1.15];
    this.colors = [
      `rgba(255, 255, 255, 1)`,

      `rgba(0, 191, 255, 1)`,

      `rgba(255, 32, 40, 1)`,

      `rgba(255, 250, 17, 1)`,

      `rgba(15, 210, 0, 1)`,
    ];

    this.LEFT = true;
    this.RIGHT = false;

    this.addProperty("color", 1);
  }

  draw() {
    this.clearCanvas();

    if (this.getProperties().drawGrid) this.drawGrid();

    this.CENTER_X = this.canvas.clientWidth / 2;
    this.CENTER_Y = this.canvas.clientHeight / 2;

    const aspectRatio = this.canvas.clientHeight / this.canvas.clientWidth;

    this.INITIAL_RADIUS = 75 * (aspectRatio / 0.375);

    const radius =
      this.INITIAL_RADIUS *
      ((this.audioProcessor.calculateAudioLevel() / 100) * 0.2 + 1);

    this.createParticles();
    this.updateParticles();
    this.drawParticles();

    this.mainCircle(radius);

    /* for (let i = 4; i >= 0; i--) {
      this.drawFrequencyBars(radius, this.colors[i], this.scales[i]);
    } */

    this.drawFrequencyBars(radius, this.colors[0], this.scales[4]);
  }

  mainCircle(radius) {
    this.ctx.beginPath();
    this.ctx.arc(this.CENTER_X, this.CENTER_Y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `hsl(${this.getProperties().color}, 100%, 50%)`;
    this.ctx.fill();
  }

  drawFrequencyBars(radius, color, scale) {
    this.frequencyBars(radius, this.RIGHT, color, scale);
    this.frequencyBars(radius, this.LEFT, color, scale);
  }

  frequencyBars(radius, side, color, scale) {
    let data = this.audioProcessor.getFrequencyData();

    const dataLength = data.length;

    data = this.getLogFrequencyData(data, dataLength);
    data = this.movingAverage(data, 25);

    const angleStep = Math.PI / dataLength;

    for (let i = 0; i < dataLength; i++) {
      const value = data[i] / 255;

      const attenuation = ((i + 50) / dataLength) ** 0.2 + 0.2;

      const barHeight = (value * attenuation * 3) ** 4 * scale;

      const angle = side
        ? i * angleStep + Math.PI / 2
        : (i * angleStep - Math.PI / 2) * -1;

      const x = this.CENTER_X + Math.cos(angle) * radius;
      const y = this.CENTER_Y + Math.sin(angle) * radius;

      const xEnd = this.CENTER_X + Math.cos(angle) * (radius + barHeight);
      const yEnd = this.CENTER_Y + Math.sin(angle) * (radius + barHeight);

      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1;
      //this.ctx.lineCap = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(xEnd, yEnd);
      this.ctx.stroke();
    }
  }

  movingAverage(data, windowSize) {
    const smoothedData = [];

    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;

      let currentWindowSize = windowSize;

      // Increase window size for lower frequencies
      currentWindowSize = -i / data.length + 3 * windowSize + 1;

      // Calculate the half-window size (radius)
      const radius = Math.floor(currentWindowSize / 2);

      // Iterate through the window centered at index i
      for (let j = i - radius; j <= i + radius; j++) {
        // Check boundaries to handle edges
        if (j >= 0 && j < data.length) {
          sum += data[j];
          count++;
        }
      }

      // Calculate the average and push to the result array
      smoothedData.push(sum / count);
    }

    return smoothedData;
  }

  getLogFrequencyData(data, bands) {
    const logData = new Array(bands);

    // Avoid log(0)
    const minIndex = 1;
    const maxIndex = data.length;

    for (let i = 0; i < bands; i++) {
      const t = i / (bands - 1);

      // Logarithmic index into the FFT array
      const logIndex = Math.round(minIndex * Math.pow(maxIndex / minIndex, t));

      logData[i] = data[logIndex];
    }

    return logData;
  }

  createParticles() {
    if (this.particles.length < 150) {
      this.particles.push({
        x: this.CENTER_X,
        y: this.CENTER_Y,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() - 0.5,
        radius: Math.random() * 2 + 1,
        color: `rgba(255, 255, 255, 1)`,
        initialFrame: this.frameCount,
        xToCenter: 0,
        yToCenter: 0,
      });
    }
  }

  updateParticles() {
    const audioLevel = this.audioProcessor.calculateAudioLevel();

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x = p.xToCenter + this.CENTER_X;
      p.y = p.yToCenter + this.CENTER_Y;

      if (
        p.x > this.canvas.clientWidth ||
        p.y > this.canvas.clientHeight ||
        p.x < 0 ||
        p.y < 0
      ) {
        this.particles.splice(i, 1);
        i--;
        continue;
      }

      const current_vx = p.vx * (audioLevel / 15 + 0.5);
      const current_vy = p.vy * (audioLevel / 15 + 0.5);

      p.x += current_vx;
      p.y += current_vy;

      p.xToCenter = p.x - this.CENTER_X;
      p.yToCenter = p.y - this.CENTER_Y;
    }
  }

  drawParticles() {
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
  }

  update() {
    super.update();
  }

  getProperties() {
    return super.getProperties();
  }

  resetProperties() {
    this.getProperties().color = 1;
    this.getProperties().drawGrid = false;
    this.getProperties().gridWidth = 75;
  }
}
