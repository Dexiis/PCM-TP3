class ReactiveBallVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Bola Reativa";

    this.LEFT = true;
    this.RIGHT = false;

    this.addProperty("color", 1);
  }

  draw() {
    this.clearCanvas();

    this.CENTER_X = this.canvas.clientWidth / 2;
    this.CENTER_Y = this.canvas.clientHeight / 2;

    const aspectRatio = this.canvas.clientHeight / this.canvas.clientWidth;

    this.INITIAL_RADIUS = 75 * (aspectRatio / 0.375);

    const radius =
      this.INITIAL_RADIUS *
      ((this.audioProcessor.calculateAudioLevel() / 100) * 0.2 + 1);

    this.mainCircle(radius);

    const scales = [0.8, 0.85, 0.9, 0.95, 1 ];
    const colors = [
      `rgba(255, 255, 255, 1)`,

      `rgba(0, 191, 255, 1)`,

      `rgba(160, 32, 240, 1)`,

      `rgba(255, 20, 147, 1)`,

      `rgba(220, 210, 0, 1)`,
    ];

    for (let i = 4; i >= 0; i--) {
      this.drawFrequencyBars(radius, colors[i], scales[i]);
    }
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
    data = this.getLogFrequencyData(data, data.length);
    data = this.movingAverage(data, 75);

    const angleStep = Math.PI / data.length;

    for (let i = 0; i < data.length; i++) {
      const value = data[i] / 255;

      const index = i < 125 ? 125 : i;
      const attenuation = (index / data.length) ** 0.2 + 0.2;

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
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(xEnd, yEnd);
      this.ctx.stroke();
    }
  }

  movingAverage(data, windowSize) {
    // WINDOWSIZE MUST BE ODD

    // Calculate the half-window size (radius)
    const radius = Math.floor(windowSize / 2);
    const smoothedData = [];

    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;

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

  update() {
    super.update();
  }

  getProperties() {
    return super.getProperties();
  }

  resetProperties() {}
}
