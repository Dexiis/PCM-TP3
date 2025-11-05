// Processamento de Áudio
class AudioProcessor {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.frequencyData = null;
    this.waveformData = null;
    this.isPlaying = false;
  }

  async startMicrophone() {
    const audioCtx = new AudioContext();
    console.log("Iniciando captura do microfone...");
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.audioContext = audioCtx;
          this.mediaStream = audioCtx.createMediaStreamSource(stream);
          this.analyser = audioCtx.createAnalyser();
          this.analyser.fftSize = 2048;
          this.mediaStream.connect(this.analyser);
          this.analyser.connect(audioCtx.destination);
          this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
          this.waveformData = new Uint8Array(this.analyser.frequencyBinCount);
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
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  getWaveformData() {
    this.analyser.getByteTimeDomainData(this.waveformData);
    return this.waveformData;
  }

  calculateAudioLevel() {
    console.log(this.waveformData[127]);
    return this.waveformData[127];
  }
}
