const Board = require('firmata');
const Sonar = require('./lib/sonar');
const pwait = require('./lib/util').pwait;

const PIN_SONAR = 4;
const PIN_SERVO = 3;

const START = 0;
let STEP = 5;
const MIN = 0, MAX = 180;
let servoPos = START;

const board = new Board('/dev/cu.usbmodem1411', () => {
  console.log('BOARD READY');
  const sonar = new Sonar(board, PIN_SONAR);
  board.servoConfig(PIN_SERVO, 660, 1300);
  const servoTo = board.servoWrite.bind(board, PIN_SERVO);

  servoTo(servoPos);

  const nextPos = () => {
    const tmp = servoPos + STEP;
    if (tmp > MAX || tmp < MIN) {
      STEP *= -1;
    }
    return servoPos += STEP;
  };
  const scan = () => {
    return sonar.multiPing(4)
    .then(arr => arr.reduce((c, p) => p.value < c.value ? p : c, { value: Infinity }))
    .then(data => console.log(`${data.value}(${data.index}) @ ${servoPos}°`))
    .then(() => servoTo(nextPos()))
    .then(pwait.bind(null, 20))
    .then(scan);
  }
  scan();
});
