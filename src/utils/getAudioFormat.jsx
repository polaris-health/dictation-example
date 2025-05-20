export function getAudioFormat() {
    const { userAgent } = window.navigator;
  
    if (userAgent.indexOf("Chrome") > -1) {
      return "webm";
    } else if (userAgent.indexOf("Safari") > -1) {
      return "mp4";
    } else if (userAgent.indexOf("Firefox") > -1) {
      return "webm";
    } else if (userAgent.indexOf("Edge") > -1) {
      return "webm";
    } else {
      return "webm";
    }
}