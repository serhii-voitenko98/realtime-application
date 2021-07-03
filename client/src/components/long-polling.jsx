import { useEffect, useState } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';

function LongPolling() {
  const [messages, setMessages] = useState([]);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    try {
      const { data } = await axios.get('http://192.168.0.104:5200/message');
      setMessages(prev => [data, ...prev]);
      await subscribe();
    } catch (error) {
        setTimeout(() => {
          subscribe();
        }, 500)
    }
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

    await axios.post('http://192.168.0.104:5200/message', {
      message: data,
      id: Date.now(),
      username: userName,
    });
  }

  return (
   <div className="d-flex justify-content-center align-items-center h-100">
     <div>
      <div className="d-flex mb-5">
          <TextField
            id="standard-multiline-flexible"
            label="Type a username..."
            multiline
            rowsMax={4}
            className="mr-4"
            value={userName}
            onChange={e => handleUsernameChange(e.target.value)}
          />
      </div>

      <div className="d-flex">
          <TextField
            id="standard-multiline-flexible"
            label="Type a message..."
            multiline
            rowsMax={4}
            className="mr-4"
            value={textFieldValue}
            onChange={e => handleMessageChange(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={sendMessage}>
            Send
          </Button>
        </div>

        <div className="mt-5">
          <List component="nav" aria-label="mailbox folders">
            {messages.map(message =>
              <div key={message.id}>
                <ListItem button>
                  <div className="mr-4">{message.date} <span className="ml-2">{message.username}</span></div>
                  <ListItemText primary={message.message} />
                </ListItem>

                <Divider />
              </div>
            )}
          </List>
        </div>
     </div>
   </div>
  )
}

export default LongPolling;