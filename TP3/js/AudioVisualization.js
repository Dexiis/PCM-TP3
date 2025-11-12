// Classe Abstrata Base para Visualizações
class AudioVisualization {
  constructor(canvas, audioProcessor) {
    if (this.constructor === AudioVisualization) {
      throw new Error(
        "AudioVisualization é uma classe abstrata e não pode ser instanciada diretamente."
      );
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.audioProcessor = audioProcessor;
    this.name = "Visualização";
    this.properties = {};
    this.testData = new Uint8Array(256);
    this.frameCount = 0;

    // Inicializar dados de teste
    for (let i = 0; i < this.testData.length; i++) {
      this.testData[i] = Math.sin(i / 10) * 128 + 128;
    }

    const dpr = window.devicePixelRatio || 1;

    // Get the *displayed* size of the canvas
    const rect = this.canvas.getBoundingClientRect();

    // Match internal resolution to display size * dpr
    this.canvas.width = 2 * rect.width * dpr;
    this.canvas.height = 2 * rect.height * dpr;

    // Ensure rendering looks sharp
    this.ctx.scale(dpr, dpr);

    this.addProperty("drawGrid", false);
    this.addProperty("gridWidth", 75);
  }

  // Método abstrato
  draw() {
    throw new Error("Método draw() deve ser implementado pela subclasse.");
  }

  update() {
    this.draw();
    this.frameCount++;
    this.audioProcessor.update();
    // Atualizar de 10 em 10 frames
    if (this.frameCount % 10 === 0) this.audioProcessor.updateUI();
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  addProperty(property, value) {
    this.properties[property] = value;
  }

  getProperties() {
    return this.properties;
  }

  // Reinicia as propriedades da visualização
  resetProperties() {
    throw new Error(
      "Método resetProperties() deve ser implementado pela subclasse."
    );
  }

  updateProperty(property, value) {
    if (this.properties.hasOwnProperty(property)) {
      this.properties[property] = value;
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid() {
    const gridSize = this.getProperties().gridWidth;

    this.ctx.strokeStyle = "#ddd";
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }
}
