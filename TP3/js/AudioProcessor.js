// Processamento de Áudio
class AudioProcessor {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.frequencyData = new Uint8Array();
    this.waveformData = new Uint8Array();
    this.isPlaying = false;
  }

  async startMicrophone() {
    const audioCtx = new AudioContext();
    console.log("Iniciando captura do microfone...");
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaStream = audioCtx.createMediaStreamSource(stream);
          this.analyser = audioCtx.createAnalyser();
          this.mediaStream.connect(this.analyser);
          this.analyser.connect(audioCtx.destination);
          resolve("Microfone ativado com sucesso");
        })
        .catch((error) => {
          reject(`Erro ao acessar microfone: ${error.message}`);
        });
    });
  }

  async loadAudioFile(file) {
    // TODO: carregar ficheiro de áudio
    console.log("Carregando ficheiro de áudio...");
    // Devolver Promise
  }

  stop() {
    // TODO: finish still
    this.mediaStream = null;

    console.log("Parando processamento de áudio...");
  }

  update() {
    // TODO: atualizar dados de áudio
  }

  getFrequencyData() {
    this.frequencyData = this.analyser.getByteFrequencyData();
    return this.frequencyData;
  }

  getWaveformData() {
    this.waveformData = this.analyser.getByteTimeDomainData();
    return this.waveformData;
  }

  calculateAudioLevel() {
    return 0;
  }
}
