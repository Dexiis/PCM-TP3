// Gestão de UI
class UIManager {
  constructor(app) {
    this.app = app;
    this.visualizationEngine = app.visualizationEngine;
    this.audioProcessor = app.audioProcessor;

    // Inicializar interface
    this.setupEventListeners();
  }

  updatePropertiesPanel() {
    // TODO: atualizar painel de propriedades
    console.log("Atualizando painel de propriedades...");
  }

  updateAudioInfo(info, isError = false) {
    const $audioStatus = $("#audioStatus");
    const $audioLevel = $("#audioLevel");

    if (isError) {
      $audioStatus.text(`Erro: ${info}`);
      $audioStatus.css("color", "#f72585");
    } else {
      $audioStatus.text(`Áudio: ${info.status || "Ativo"}`);
      $audioStatus.css("color", "#e6e6e6");
      $audioLevel.text(`Nível: ${info.level || 0}%`);
    }
  }

  setButtonStates(playing) {
    const $startMicBtn = $("#startMic");
    const $stopAudioBtn = $("#stopAudio");

    $startMicBtn.prop("disabled", playing);
    $stopAudioBtn.prop("disabled", !playing);
  }

  showError(message) {
    // TODO: mostrar mensagem de erro
    const $errorModal = $("#errorModal");
    const $errorMessage = $("#errorMessage");

    $errorMessage.text(message);
    $errorModal.removeClass("hidden");

    // Fechar modal ao clicar no X
    $(".close").on("click", () => $errorModal.addClass("hidden"));

    // Fechar modal ao clicar fora
    $(window).on("click", (event) => {
      if ($(event.target).is($errorModal)) {
        $errorModal.addClass("hidden");
      }
    });
  }

  setupEventListeners() {
    // TODO: configurar event listeners
    $("#startMic").on("click", () => this.app.startMicrophone());
    $("#stopAudio").on("click", () => this.app.stopAudio());
    $("#fullscreenButton").on("click", () =>
      this.visualizationEngine.fullscreen()
    );

    $("#audioFile").on("change", (e) => {
      if (e.target.files.length > 0) {
        this.app.loadAudioFile(e.target.files[0]);
      }
    });

    $("#visualizationType").on("change", (e) => {
      this.app.setVisualization(e.target.value);
    });

    $("#exportPNG").on("click", () => this.app.exportManager.exportAsPNG());
    $("#exportJPEG").on("click", () =>
      this.app.exportManager.exportAsJPEG(0.9)
    );
  }

  clearAudioInput() {
    $("#audioFile").val("");
  }

  setupAudioLevels() {
    // TODO: configurar monitorização de níveis de áudio
  }

  createPropertyControl(property, value, min, max, step) {
    // TODO: criar controlo de propriedade
    const $container = $("<div>");
    $container.attr("class", "property-control");

    const $label = $("<label>");
    $label.text(property);
    $label.attr("for", `prop-${property}`);

    const $input = $("<input>");
    $input.attr({
      type: "range",
      id: `prop-${property}`,
      min,
      max,
      step,
      value,
    });

    $input.on("input", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        parseFloat(e.target.value)
      );
    });

    $container.append($label);
    $container.append($input);

    return $container;
  }

  displayPropertyControl(propertyControl) {
    $("#properties-container").append(propertyControl);
  }
}
