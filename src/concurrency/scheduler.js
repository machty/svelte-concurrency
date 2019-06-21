import Scheduler from './external/scheduler/scheduler';

const MICROTASK_PROMISE = window.Promise.resolve();

class SvelteScheduler extends Scheduler {
  constructor(...args) {
    super(...args);
    this.isScheduled = false;
  }

  scheduleRefresh() {
    if (this.isScheduled) {
      return;
    }
    
    MICROTASK_PROMISE.then(() => {
      this.isScheduled = false;
      this.refresh();
    });
  }
}

export default SvelteScheduler;
