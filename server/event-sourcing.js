const express = require('express');
const cors = require('cors');
const events = require('events');
const emitter = new events.EventEmitter();

const app = express();
const PORT = 5200;

const getDate = () => {
  const date = new Date();

  const addZero = value => parseInt(value, 10) < 10 ? `0${value}` : value;

  const day = `${addZero(date.getDate())}`;
  const month = `${addZero(date.getMonth())}`;
  const year = `${addZero(date.getFullYear())}`;
  const hours = `${addZero(date.getHours())}`;
  const minutes = `${addZero(date.getMinutes())}`;
  const seconds = `${addZero(date.getSeconds())}`;

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

app.use(cors());
app.use(express.json());

app.get('/connect', (req, res) => {
  res.writeHead(200, {
    'Connection': 'Keep-Alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  emitter.on('message', message => {
    res.write(`data: ${JSON.stringify(message)} \n\n`);
  })
});

app.post('/message', (req, res) => {
  const message = req.body;

  message.date = getDate();

  emitter.emit('message', message);
  res.status(200);
});

app.listen(PORT, '0.0.0.0');
