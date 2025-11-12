class ReactiveBallVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Bola Reativa";
  }

  draw() {
    this.clearCanvas();
  }

  update() {
    super.update();
  }

  getProperties() {
    return super.getProperties();
  }
}
