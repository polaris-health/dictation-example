import { useRef, useState } from 'react';
import useAudioActions from '../hooks/useAudioActions';
import useAudio from '../hooks/useAudio';
import { getAudioFormat } from '../utils/getAudioFormat';
import dictateObservation from '../utils/dictateObservation';

const audioBitsPerSecond = 256_000; // 256 kbps
const audioFormat = getAudioFormat();
const maxDictationTime = 10 * 60; // 10 minutes
const chunkSize = 1_000; // 1 second
const defaultParameters = {
  output_language: "nl",
  patient_first_name: "John",
  patient_last_name: "Doe",
  medication_list: [
    { cti_e: "204565-02"}
  ],
  dictation_style: "free",
  contact_id: "contact-1"
};

function DictationButton() {

  const { closeAudioStream, getAudioStream } = useAudioActions();
  const { volumeOk } = useAudio();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const responseCharacterCountRef = useRef(0);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleDownloadProgress = (event) => {
    const eventFullPayload = event.event.target.response;
    // The output is continuously updated, so we need to slice the payload to get only the new data.
    const eventRawPayload = eventFullPayload.slice(responseCharacterCountRef.current).split("\n");
    responseCharacterCountRef.current = eventFullPayload.length;
    for (let i = 0; i < eventRawPayload.length; i++) {
      const trimmedPayload = eventRawPayload[i].trim();
      if (trimmedPayload.length > 0) {
        const eventPayload = JSON.parse(trimmedPayload);
        if (eventPayload.type === "observation.note.delta") {
          // Your logic to handle the note delta.
          console.log('Note delta:', eventPayload.delta);
        } else if (eventPayload.type === "observation.parameters") {
          // Your logic to handle the observation parameters.
          console.log('Observation parameters:', eventPayload.content);
        }
      }
    }
  }

  const stopRecording = async () => {
        setRecording(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            await mediaRecorderRef.current.stop();
            closeAudioStream();
        }
      };

  const startRecording = async () => {
      setRecording(true);
      audioChunksRef.current = [];
      try {
          const stream = await getAudioStream();
          mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/"+audioFormat, audioBitsPerSecond: audioBitsPerSecond });
          const startUnixTime = Math.floor(Date.now() / 1000);

          mediaRecorderRef.current.ondataavailable = (event) => {
              const currentUnixTime = Math.floor(Date.now() / 1000);
              if (currentUnixTime - startUnixTime > maxDictationTime) {
                  stopRecording();
                  return;
              }
              if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
              }
          };
  
          mediaRecorderRef.current.onstop = async () => {
              responseCharacterCountRef.current = 0;
              setProcessing(true);
              const audioBlob = new Blob(audioChunksRef.current);
              const formData = new FormData();
              formData.append('audio', audioBlob);
              formData.append('parameters', JSON.stringify(defaultParameters));
              await dictateObservation(formData, handleDownloadProgress);
              setProcessing(false);
          };
      
          mediaRecorderRef.current.start(chunkSize);
      } catch (error) {
          console.error('Error accessing microphone:', error);
      }
    };

  const handleClick = async (e) => {
    if (recording) {
      await stopRecording(false);
    } else if (!processing) {
      await startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
    >
      {processing ? (
          "Finishing..."
          ) : recording ? (
              volumeOk ? (
                "Stop Recording"
              ) : (
                "Volume not OK"
              )
          ) : 
          "Start Recording"
      }
    </button>
  );
}

export default DictationButton;
