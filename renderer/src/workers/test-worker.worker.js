import AV from 'av';

onmessage = function(e) {
  console.log('worker got message', e);
  /*setTimeout(
    () => {
        console.log(AV);
    },
    5000
  );*/
  for (let i = 0; i <= 100; i++) {
    postMessage({num: i});
  }
}
