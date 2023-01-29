/// <reference lib="webworker" />

function start() {
  return 1;
}

addEventListener('message', ({ data }) => {
  const response = start();
  setInterval(() => {
    postMessage(response);
  }, 1000);
});
