class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espectro de Frequências";
    // Inicializar propriedades específicas

    this.addProperty("color", 1);
  }

  draw() {
    this.clearCanvas();

    if (this.getProperties().drawGrid) this.drawGrid();

    // Implementação básica para teste
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const barWidth = this.canvas.clientWidth / data.length;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * this.canvas.clientHeight;
      const x = i * barWidth;
      const y = this.canvas.clientHeight - barHeight;

      this.ctx.fillStyle = `hsl(${this.getProperties().color}, 100%, 50%)`;
      this.ctx.fillRect(x, y, barWidth, barHeight);
    }
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
