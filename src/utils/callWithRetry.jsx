const maxRetries = 3;
const retryWaitTime = 1_000;

export default async function callWithRetry(func){
  let result = {};
  for (let count = 0; count < maxRetries; count++) {
    try{
      result = await func();
      return result
    } catch (error) {
      console.error(error);
      await new Promise(r => setTimeout(r, retryWaitTime));
    }
  }
  return result;
}