import './App.css'
import TranscriptionButton from './dictation/DictationButton'
import { AudioContextProvider } from './contexts/AudioContext'

function App() {

  return (
    <AudioContextProvider>
      <TranscriptionButton />
    </AudioContextProvider>
  )
}

export default App
