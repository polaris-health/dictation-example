# Dictation Example
This repo contains a minimal example of how to produce a dictation and send it to the Cavell API for processing.
Batteries are included:
- Retry functionality
- Volume measurements to easily identify microphone issues
- State tracking to dynamically adjust the UI based on the state of the audio processing (active, inactive, finishing)

# Install instructions (npm)
```
npm install
```

Also, please include a valid token in `src/utils/dictateObservation.jsx` where indicated.

# Run development mode locally (npm)
```
npm run dev
```

# Dependencies
Several dependencies are required to make this example work:
`extendable-media-recorder`
`extendable-media-recorder-wav-encoder`
`axios`
