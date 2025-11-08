// Classe principal da aplicação
// Inicialização da aplicação quando o DOM estiver carregado
$(document).ready(function () {
  const app = new App();

  // Expor app globalmente para debugging (remover em produção)
  window.app = app;
});

class App {
  constructor() {
    this.audioProcessor = new AudioProcessor(this);
    this.visualizationEngine = new VisualizationEngine(
      "audioCanvas",
      this.audioProcessor
    );
    this.uiManager = new UIManager(this);
    this.exportManager = new ExportManager(this.visualizationEngine);

    // Inicialização
    this.init();
  }

  init() {
    // TODO: inicializar a aplicação
    console.log("App inicializada");
  }

  startMicrophone() {
    this.uiManager.setButtonStates(true);
    this.audioProcessor
      .startMicrophone()
      .then((stream) => {
        this.visualizationEngine.start();
      })
      .catch((error) => {
        this.uiManager.updateAudioInfo(error, true);
        this.uiManager.setButtonStates(false);
      });

    console.log("Iniciando microfone...");
  }

  loadAudioFile(file) {
    this.audioProcessor
      .loadAudioFile()
      .then((stream) => {
        this.visualizationEngine.start();
      })
      .catch((error) => {
        this.uiManager.updateAudioInfo(error, true);
      });
    console.log("Carregando ficheiro de áudio...");
  }

  stopAudio() {
    this.uiManager.setButtonStates(false);
    // TODO: parar áudio
    console.log("Parando áudio...");
    this.visualizationEngine.stop();
  }

  setVisualization(type) {
    // TODO: definir tipo de visualização
    this.visualizationEngine.setVisualization(type);
    console.log(`Definindo visualização: ${type}`);
  }

  exportFrame() {
    // TODO: exportar frame atual
    console.log("Exportando frame...");
  }

  destroy() {
    // TODO: limpar recursos
    console.log("Destruindo aplicação...");
  }

  updateUIInfo() {
    let info = {
      level: parseInt(this.audioProcessor.calculateAudioLevel()),
      status: this.visualizationEngine.isRunning ? "Ativo" : "Parado",
    };
    this.uiManager.updateAudioInfo(info, false);
  }
}
