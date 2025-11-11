// Motor de Visualização
class VisualizationEngine {
  constructor(canvasId, audioProcessor) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.visualizations = new Map();
    this.currentVisualization = null;
    this.animationId = null;
    this.isRunning = false;
    this.audioProcessor = audioProcessor;

    // Inicializar visualizações
    this.initVisualizations();
    // Inicializa a visualização default "Espectro"
    this.setDefaultVisualization();
  }

  initVisualizations() {
    this.visualizations.set(
      "spectrum",
      new SpectrumVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "waveform",
      new WaveformVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "particles",
      new ParticleVisualization(this.canvas, this.audioProcessor)
    );
  }

  setDefaultVisualization() {
    this.setVisualization("spectrum");
  }

  setVisualization(type) {
    this.currentVisualization = null;
    this.currentVisualization = this.visualizations.get(type);
    console.log(this.currentVisualization);
    console.log(`Definindo visualização: ${type}`);
    return this.currentVisualization; // Devolver boolean indicando sucesso
  }

  start() {
    // Garantir que start não é chamado se o loop já estiver a correr
    if (this.isRunning) return;
    this.isRunning = true;
    // Chama o loop
    this.animationId = requestAnimationFrame(() => this.updateLoop());

    console.log("Iniciando motor de visualização...");
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      // Para o loop
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      // Para o processamento de áudio
      this.audioProcessor.stop();
    }
    this.currentVisualization.clearCanvas();

    console.log("Parando motor de visualização...");
  }

  updateLoop() {
    // Garante que a atualização para se o loop já foi parado
    if (!this.isRunning) return;
    // Recursivamente corre o loop
    this.animationId = requestAnimationFrame(() => this.updateLoop());
    // Atualiza a visualização
    this.currentVisualization.update();
  }

  resize() {}

  fullscreen() {
    this.canvas.requestFullscreen().catch((error) => {
      console.error(`${error.message}`);
    });
  }

  addProperty(property) {
    this.currentVisualization.addProperty(property);
  }

  getVisualizationProperties() {
    return this.currentVisualization.getProperties();
  }

  updateVisualizationProperty(property, value) {
    console.log(`Atualizando propriedade: ${property} = ${value}`);
    this.currentVisualization.updateProperty(property, value);
  }
}
