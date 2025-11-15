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
    this.source = null;

    this.setupAnalyser();
  }

  async startMicrophone() {
    console.log("Iniciando captura do microfone...");
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.ensureRunning();

          const mediaSource = this.audioContext.createMediaStreamSource(stream);
          mediaSource.connect(this.analyser);
          // REMOVE COMMENT TO HEAR INPUT
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
      reader.onload = async (e) => {
        try {
          this.stop();
          this.ensureRunning();

          if (this.source) this.source.disconnect();

          const audioBuffer = await this.audioContext.decodeAudioData(
            e.target.result
          );
          const source = this.audioContext.createBufferSource();
          source.buffer = audioBuffer;

          source.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);

          this.source = source;
          this.source.start();
          this.isPlaying = true;

          this.source.onended = () => {
            console.log("O áudio terminou");
            this.isPlaying = false;
          };

          resolve(e.target.result);
        } catch (error) {
          console.error("Erro ao decodificar ou configurar áudio:", error);
          reject(error);
        }
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

    if (this.source && this.source.stop) this.source.stop();

    if (this.audioContext) this.audioContext.suspend();

    this.updateUI();

    console.log("Parando processamento de áudio...");
  }

  async ensureRunning() {
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
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
    // RMS of the samples in the whole array of the waveform data
    let waveform = this.getWaveformData();
    let sumSquares = 0;
    for (let sample of waveform) {
      let normalizedSample = (sample - 128) / 128;
      sumSquares += normalizedSample * normalizedSample;
    }

    let rms = Math.sqrt(sumSquares / waveform.length);
    return rms * 100;
  }
}
