
class Motor {
  constructor(board, pins) {
    if (!pins.speed || !pins.in1 || !pins.in2) {
      throw new Error('specify proper pins object {speed, in1, in2}');
    }
    this.board = board;
    this.pins = pins;
    this.board.pinMode(pins.speed, this.board.MODES.PWM);
  }

  // speed = -1..1
  start(speed) {
    let pwm = speed * 255;
    pwm = Math.max(Math.min(255, Math.abs(pwm)), 0);
    if (speed > 0) {
      this.board.digitalWrite(this.pins.in1, this.board.LOW);
      this.board.digitalWrite(this.pins.in2, this.board.HIGH);
    } else {
      this.board.digitalWrite(this.pins.in1, this.board.HIGH);
      this.board.digitalWrite(this.pins.in2, this.board.LOW);
    }
    this.board.analogWrite(this.pins.speed, pwm);
  }

  stop() {
    this.board.analogWrite(this.pins.speed, 0);
    this.board.digitalWrite(this.pins.in1, this.board.LOW);
    this.board.digitalWrite(this.pins.in2, this.board.LOW);
  }
}

module.exports = Motor;

