onmessage = function(e) {
  console.log('worker got message', e);
  for (let i = 0; i <= 100; i++) {
    //postMessage({num: i});
  }
}
