import { useEffect, useRef, useState } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Alert, ListGroup } from 'react-bootstrap';
import useSound from 'use-sound';

function Websocket() {
  const [messages, setMessages] = useState([]);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [username, setUserName] = useState('');
  const socket = useRef();
  const [connection, setConnection] = useState(false);
  const [play] = useSound('/sound.mp3', { volume: 0.25 });

  const connect = () => {
    socket.current = new WebSocket('ws://192.168.0.104:5200');

    socket.current.onopen = () => {
      setConnection(true);

      const message = {
        event: 'connection',
        id: Date.now(),
        username,
      }

      socket.current.send(JSON.stringify(message));

      play();
    };

    socket.current.onmessage = event => {
      const message = JSON.parse(event.data);

      setMessages(prev => [message, ...prev]);

      if (message.username !== username) {
        play();
      }

      console.log('Socket sent message', message);
    };

    socket.current.onclose = () => {
      setConnection(false);

      const message = {
        event: 'close',
        id: Date.now(),
        username,
      }

      socket.current.send(JSON.stringify(message));

      console.log('Socket closed');
    };

    socket.current.onerror = () => {
      console.log('Socket has an error');
    };
  }

  const handleMessageChange = value => {
    setTextFieldValue(value);
  }

  const handleUsernameChange = value => {
    setUserName(value);
  }

  const sendMessage = async () => {
    const data = textFieldValue;
    setTextFieldValue('');

    if (data) {
      const message = {
        event: 'message',
        message: data,
        id: Date.now(),
        username: username,
      };

      socket.current.send(JSON.stringify(message));
    }
  }

  if (!connection) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="w-100">
          <div className="d-flex justify-content-center w-100">
              <TextField
                id="standard-multiline-flexible"
                label="Имя пользователя..."
                multiline
                rowsMax={4}
                className="mr-4 w-50"
                value={username}
                onChange={e => handleUsernameChange(e.target.value)}
              />

              <Button variant="contained" color="primary" onClick={connect}>
                Войти
              </Button>
            </div>
        </div>
      </div>
    )
  }

  return (
   <div className="d-flex justify-content-center align-items-center h-100">
     <div className="w-100">
      <div className="d-flex justify-content-center w-100">
        <TextField
          id="standard-multiline-flexible"
          label="Введите сообщение..."
          multiline
          rowsMax={4}
          className="mr-4 w-50"
          value={textFieldValue}
          onChange={e => handleMessageChange(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Отправить
        </Button>
      </div>

      <div className="mt-5" style={{maxHeight: "300px", overflow: 'auto'}}>
        <ListGroup>
          {messages.map(message =>
            <div key={message.id}>
              {message.event === 'connection'
                ? <div>
                    <Alert variant="primary">
                      <span>{message.date}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                      <span>Пользователь <b>{message.username}</b> подключился.</span>
                    </Alert>
                  </div>

                : message.event === 'close'
                  ? <div>
                      <Alert variant="warning">
                        <span>{message.date}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        <span>Пользователь <b>{message.username}</b> покинул чат.</span>
                      </Alert>
                    </div>
                  : <div>
                      <ListGroup.Item>
                        <span>{message.date}&nbsp;&nbsp;|&nbsp;&nbsp;<span><b>{message.username}</b>:</span></span>
                        <span>&nbsp;{message.message}</span>
                      </ListGroup.Item>
                    </div>
              }
            </div>
          )}
        </ListGroup>
      </div>
     </div>
   </div>
  )
}

export default Websocket;