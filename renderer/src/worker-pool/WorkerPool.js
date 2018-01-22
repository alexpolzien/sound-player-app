export default class WorkerPool {
  constructor(newWorkerCallback, messageHandler, numWorkers, isDoneCallback, sleepTime) {
    this.jobQ = []; // FILO queue of job messages to do
    this.newWorkerCallback = newWorkerCallback; // function that returns new worker instance
    this.messageHandler = messageHandler; // called when message received from workers
    this.isDoneCallback = isDoneCallback; // takes a message from a worker and returns true if the job is done
    this.workers = [];

    const onmessage = this._onmessage.bind(this);

    for (let i = 0; i < numWorkers; i++) {
      const worker = this.newWorkerCallback();
      worker.onmessage = onmessage.bind(null, i);
      this.workers.push({
        worker: worker,
        assignedJob: null,
        startTime: null
      });
    }
    this.lastWorkerUsed = null;
    this.sleepTime = sleepTime; // how long to wait if all workers are busy
  }

  assignToNextIdleWorker(jobMessage) {
    // round-robin workers and assign the job message, return false if all busy
    if (this.workers.length === 0) {
      return false;
    }

    let numWorkersChecked = 0;
    let index = this.lastWorkerUsed || 0;
    while (numWorkersChecked < this.workers.length) {
      // increment
      if (index === this.workers.length - 1) {
        index = 0;
      } else {
        index++;
      }

      const worker = this.workers[index];
      if (!worker.assignedJob) {
        console.log(`assigning to worker ${index}`);
        worker.assignedJob = jobMessage;
        worker.startTime = new Date();
        worker.worker.postMessage(jobMessage);
        this.lastWorkerUsed = index;
        return true;
      } else {
        numWorkersChecked++;
      }
    }

    return false;
  }

  requestJob(jobMessage) {
    // add to the end of the queue
    this.requestWorkAndStartProcessing(q => {q.unshift(jobMessage)});
  }

  requestJobPriority(jobMessage) {
    // add to the front of the queue
    this.requestWorkAndStartProcessing(q => {q.push(jobMessage)});
  }

  requestWorkAndStartProcessing(requestCallback) {
    // queue will be processed until it is empty, so it needs to be restarted
    const wasEmpty = this.jobQ.length === 0;
    requestCallback(this.jobQ); // put work somewhere in the queue
    if (wasEmpty) {
      this.processJobQ();
    }
  }

  processJobQ() {
    let allWorkersBusy = false;
    while (this.jobQ.length && !allWorkersBusy) {
      const nextJob = this.jobQ.pop();

      const success = this.assignToNextIdleWorker(nextJob);
      if (!success) {
        // push the job back on the queue
        this.jobQ.push(nextJob);
        allWorkersBusy = true;

        // sleep and try again
        setTimeout(this.processJobQ.bind(this), this.sleepTime);
      }
    }
  }

  _onmessage(workerIndex, event) {
    const isDone = this.isDoneCallback(event);
    // clear the assigned job if the job is done
    if (isDone) {
      this.workers[workerIndex].assignedJob = null;
      const worker = this.workers[workerIndex];
      worker.assignedJob = null;
      worker.startTime = null; // TODO: Performance timings
    }
    this.messageHandler(event);
  }

  // TODO: handle worker error and timeout
}