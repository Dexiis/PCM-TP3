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
    this.setVisualization("spectrum");
  }

  initVisualizations() {
    // TODO: inicializar tipos de visualização

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

  setVisualization(type) {
    this.currentVisualization = this.visualizations.get(type);
    console.log(`Definindo visualização: ${type}`);
    return this.currentVisualization; // Devolver boolean indicando sucesso
  }

  start() {
    
    console.log(this.currentVisualization);
    this.animationId = requestAnimationFrame(() =>
      this.currentVisualization.update()
    );

    console.log("Iniciando motor de visualização...");
  }

  stop() {
    // TODO: parar animação
    console.log(this.animationId);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    console.log("Parando motor de visualização...");
  }

  resize() {
    // TODO: redimensionar canvas
  }

  getVisualizationProperties() {
    // TODO: obter propriedades da visualização atual
    return {};
  }

  updateVisualizationProperty(property, value) {
    // TODO: atualizar propriedade da visualização
    console.log(`Atualizando propriedade: ${property} = ${value}`);
  }
}
