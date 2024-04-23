import {Routes, Route, Navigate} from 'react-router-dom'
import Chat from './Pages/Chat';
import Login from './Pages/Login'
import Register from './Pages/Register';
import "bootstrap/dist/css/bootstrap.min.css"
import {Container} from "react-bootstrap"
import NavBar from './Components/Navbar';
import { useContext } from 'react';
import { AuthContext } from './Context/AuthContext';
import { ChatContextProvider } from './Context/chatContext';



function App() {
  const {user} = useContext(AuthContext)
  return (
    <ChatContextProvider user={user}>
    <Container>
      <NavBar />
    <Routes>
      <Route path="chat" element={user ? <Chat />: <Login />} />
      <Route path="login" element={user ? <Chat />: <Login />} />
      <Route path="register" element={user ? <Chat />: <Register />}/>
      <Route path="/" element={ <Chat />}/>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </Container>
    </ChatContextProvider>
    )
}

export default App