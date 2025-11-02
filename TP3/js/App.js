// Classe principal da aplicação
// Inicialização da aplicação quando o DOM estiver carregado
$(document).ready(function () {
  const app = new App();

  // Expor app globalmente para debugging (remover em produção)
  window.app = app;
});

class App {
  constructor() {
    this.audioProcessor = new AudioProcessor();
    this.visualizationEngine = new VisualizationEngine("audioCanvas");
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
    this.audioProcessor.startMicrophone();

    console.log("Iniciando microfone...");
  }

  loadAudioFile(file) {
    // TODO: carregar ficheiro de áudio
    console.log("Carregando ficheiro de áudio...");
  }

  stopAudio() {
    this.uiManager.setButtonStates(false);
    // TODO: parar áudio
    console.log("Parando áudio...");
  }

  setVisualization(type) {
    // TODO: definir tipo de visualização
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
}
