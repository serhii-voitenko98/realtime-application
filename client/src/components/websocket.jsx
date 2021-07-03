import { useRef, useState } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Alert, ListGroup } from 'react-bootstrap';

function Websocket() {
  const [messages, setMessages] = useState([]);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [username, setUserName] = useState('');
  const socket = useRef();
  const [connection, setConnection] = useState(false);

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
      console.log('Socket opened');
    };

    socket.current.onmessage = event => {
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
      console.log('Socket sent message', message);
    };

    socket.current.onclose = () => {
      setConnection(false);
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

    const message = {
      event: 'message',
      message: data,
      id: Date.now(),
      username: username,
    };

    socket.current.send(JSON.stringify(message));
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

        <div className="mt-5">
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