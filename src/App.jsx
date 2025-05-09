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
    <>
      {unlocked ? (
        <>
          <Navbar />
          <Homepage masterPassword={password} />
          <Footer />
        </>
      ) : (
        <>
          <Navbar />
          <MasterPassword onUnlock={handleUnlock}/>
          <Footer />
        </>
      )}
    </>
  );
}

export default App
