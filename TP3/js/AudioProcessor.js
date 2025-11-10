// Processamento de Áudio
class AudioProcessor {
  constructor(app) {
    this.app = app;
    this.audioContext = new AudioContext();
    this.analyser = null;
    this.mediaStream = null;
    this.frequencyData = null;
    this.waveformData = null;
    this.isPlaying = false;
  }

  async startMicrophone() {
    console.log("Iniciando captura do microfone...");
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.setupAnalyser();
          const mediaSource = this.audioContext.createMediaStreamSource(stream);
          mediaSource.connect(this.analyser);
          // Ativar para ouvir input
          //this.analyser.connect(this.audioContext.destination);
          this.mediaStream = stream;
          resolve("Microfone ativado com sucesso");
        })
        .catch((error) => {
          reject(`Erro ao acessar microfone: ${error.message}`);
        });
    });
  }

  async loadAudioFile(file) {
    console.log("Carregando ficheiro de áudio...");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setupAnalyser();

        resolve(e.target.result);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  setupAnalyser() {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.waveformData = new Uint8Array(this.analyser.frequencyBinCount);
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
  }

  updateUI() {
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
