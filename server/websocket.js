const webSocket = require('ws');

const PORT = 5200;

const getDate = () => {
  const date = new Date();

  const addZero = value => parseInt(value, 10) < 10 ? `0${value}` : value;

  const day = `${addZero(date.getDate())}`;
  const month = `${addZero(date.getMonth() + 1)}`;
  const year = `${addZero(date.getFullYear())}`;
  const hours = `${addZero(date.getHours())}`;
  const minutes = `${addZero(date.getMinutes())}`;
  const seconds = `${addZero(date.getSeconds())}`;

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

const server = new webSocket.Server({
  port: PORT
}, () => {
  console.log(`Server started on port ${PORT}`);
});

server.on('connection', function connection(ws) {
  ws.id = Date.now();

  ws.on('message', message => {
    message = JSON.parse(message);

    switch(message.event) {
      case 'message': {
        broadcastMessage(message);
        break;
      }
      case 'connection': {
        broadcastMessage(message);
        break;
      }
    }
  });
});

function broadcastMessage(message) {
  server.clients.forEach(client => {
    client.send(JSON.stringify({
      ...message,
      date: getDate(),
    }));
  });
}