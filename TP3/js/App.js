// Inicialização da aplicação quando o DOM estiver carregado
$(document).ready(function () {
  new App();
});

// Classe principal da aplicação
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
    this.setDefaultVisualization();
    console.log("App inicializada");
  }

  startMicrophone() {
    this.uiManager.setButtonStates(true);
    this.audioProcessor
      .startMicrophone()
      .then(() => {
        this.visualizationEngine.start();
      })
      .catch((error) => {
        this.uiManager.updateAudioInfo(error, true);
        this.uiManager.setButtonStates(false);
      });

    console.log("Iniciando microfone...");
  }

  loadAudioFile(file) {
    this.uiManager.setButtonStates(true);
    this.audioProcessor
      .loadAudioFile(file)
      .then(() => {
        this.visualizationEngine.start();
      })
      .catch((error) => {
        this.uiManager.updateAudioInfo(error, true);
        this.uiManager.setButtonStates(false);
      });
    console.log("Carregando ficheiro de áudio...");
  }

  stopAudio() {
    this.uiManager.setButtonStates(false);
    console.log("Parando áudio...");
    this.visualizationEngine.stop();
    // Remove the file from the input
    this.uiManager.clearAudioInput();
  }

  setDefaultVisualization() {
    this.setVisualization("spectrum");
  }

  setVisualization(type) {
    this.uiManager.clearPropertyControls();
    if (this.visualizationEngine.setVisualization(type)) {
      console.log(`Definindo visualização: ${type}`);
      // Displays the current visualizations properties handlers
      this.uiManager.updatePropertiesPanel(type);
    } else {
      this.uiManager.showError(
        `Visualização ${type} inexistente. \n A selecionar visualização "Spectrum"`
      );
      this.setDefaultVisualization();
    }

    console.log(this.visualizationEngine.currentVisualization.getProperties());
  }

  destroy() {
    // TODO: limpar recursos
    console.log("Destruindo aplicação...");
  }

  updateUIInfo() {
    let info = {
      // Puts the volume level on the label at 0 when the visualization ends
      level: this.visualizationEngine.isRunning
        ? parseInt(this.audioProcessor.calculateAudioLevel())
        : 0,
      status: this.visualizationEngine.isRunning ? "Ativo" : "Parado",
    };
    this.uiManager.updateAudioInfo(info, false);
  }
}
