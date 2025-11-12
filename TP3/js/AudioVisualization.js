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

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";

    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = this.canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    this.ctx.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  // Método abstrato
  draw() {
    throw new Error("Método draw() deve ser implementado pela subclasse.");
  }

  update() {
    // TODO: atualizar estado da visualização
    this.draw();
    this.frameCount++;
    this.audioProcessor.update();
    // Atualizar de 10 em 10 frames
    if (this.frameCount % 10 === 0) this.audioProcessor.updateUI();
  }

  resize(width, height) {
    // TODO: redimensionar visualização
    this.canvas.width = width;
    this.canvas.height = height;
  }

  addProperty(property, value) {
    this.properties[property] = value;
  }

  getProperties() {
    return this.properties;
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
    // DRAW GRID
  }
}
