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
      if (type === "waveform") {
        const lineWidth = this.uiManager.createPropertyControl(
          "Largura de Linha",
          "lineWidth",
          4,
          2,
          8,
          1
        );
        this.uiManager.displayPropertyControl(lineWidth);
      } else {
        const color = this.uiManager.createPropertyControl(
          "Cor da Visualização",
          "color",
          1,
          1,
          360,
          1
        );
        this.uiManager.displayPropertyControl(color);
      }
      const drawGrid = this.uiManager.createRadioPropertyControl(
        "Desenhar Grelha",
        "drawGrid",
        true
      );
      this.uiManager.displayPropertyControl(drawGrid);

      const gridWidth = this.uiManager.createPropertyControl(
        "Largura de Linha da Grelha",
        "gridWidth",
        75,
        50,
        150,
        1
      );
      this.uiManager.displayPropertyControl(gridWidth);
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
      level: parseInt(this.audioProcessor.calculateAudioLevel()),
      status: this.visualizationEngine.isRunning ? "Ativo" : "Parado",
    };
    this.uiManager.updateAudioInfo(info, false);
  }
}
