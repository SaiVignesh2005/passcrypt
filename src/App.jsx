import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Footer from './components/Footer'
import MasterPassword from './components/MasterPassword'

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');

  const handleUnlock = (enteredPassword) => {
    setUnlocked(true);
    setPassword(enteredPassword);
  }

 return (
  <div className="app-container">
    <Navbar />
    <div className="main-content">
      {unlocked ? (
        <Homepage masterPassword={password} />
      ) : (
        <MasterPassword onUnlock={handleUnlock}/>
      )}
    </div>
    <Footer />
  </div>
);

}

export default App
