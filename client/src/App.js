import LongPolling from "./components/long-polling";
import EventSourcing from "./components/event-sourcing";
import Websocket from "./components/websocket";

function App() {
  return (
    // <LongPolling />
    // <EventSourcing />
    <div>
      <h1 className="text-center mb-5 mt-5">Веб-чат</h1>
      <Websocket />
    </div>
  );
}

export default App;
