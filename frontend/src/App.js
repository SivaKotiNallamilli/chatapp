import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatRoom from "./pages/ChatRoom";
import PrivateChat from "./pages/PrivateChat";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/chat/:roomId/:roomName"
          element={<ChatRoom />}
        />

        <Route
          path="/private/:conversationId"
          element={<PrivateChat />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;