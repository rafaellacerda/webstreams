const API_URL = 'http://localhost:3000'

export const consumeAPI = async (signal: AbortSignal) => {
    const response: any = await fetch(API_URL, {
        signal
      });
      
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(parseNDJSON())

      return reader;
}

function parseNDJSON() {
    let ndjsonBuffer = ''
    return new TransformStream({
      transform(chunk, controller) {
        ndjsonBuffer += chunk
        const items = ndjsonBuffer.split('\n')
        items.slice(0, -1)
          .forEach(item => controller.enqueue(JSON.parse(item)))
        
        ndjsonBuffer = items[items.length -1]
      },
      flush(controller)  {
        if(!ndjsonBuffer) return;
        controller.enqueue(JSON.parse(ndjsonBuffer))
      }
    });
  }