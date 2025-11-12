class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";
    // Inicializar propriedades específicas

    this.addProperty("lineWidth", 4);
  }

  draw() {
    this.clearCanvas();

    // Implementação básica para teste
    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;
    const sliceWidth = this.canvas.width / data.length;

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height / 2);

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * this.canvas.height) / 2;
      const x = i * sliceWidth;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.strokeStyle = "#4cc9f0";
    this.ctx.lineWidth = this.getProperties().lineWidth;
    this.ctx.stroke();
  }

  getProperties() {
    return super.getProperties();
  }
}
