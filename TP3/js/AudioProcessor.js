// Processamento de Áudio
class AudioProcessor {
  constructor(app) {
    this.app = app;
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
          const mediaSource = audioCtx.createMediaStreamSource(stream);
          this.analyser = audioCtx.createAnalyser();
          this.analyser.fftSize = 2048;
          mediaSource.connect(this.analyser);
          //this.analyser.connect(audioCtx.destination); APENAS ATIVAR PARA OUVIR
          this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
          this.waveformData = new Uint8Array(this.analyser.frequencyBinCount);
          this.mediaStream = stream;
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
    if (this.mediaStream)
      this.mediaStream.getTracks().forEach((track) => track.stop());
    this.app.updateUIInfo();

    console.log("Parando processamento de áudio...");
  }

  update() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.waveformData);
    this.calculateAudioLevel();
    this.app.updateUIInfo();
  }

  getFrequencyData() {
    return this.frequencyData;
  }

  getWaveformData() {
    return this.waveformData;
  }

  calculateAudioLevel() {
    let audioLevel = this.getWaveformData().slice(-1)[0];
    audioLevel = audioLevel - 128;
    audioLevel = (audioLevel * 100) / 128;
    audioLevel = Math.abs(audioLevel);
    return audioLevel;
  }
}
