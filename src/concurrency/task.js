import { Task as BaseTask } from './external/task/task';
import { TaskInstance } from "./task-instance";
import { TaskInstanceExecutor } from "./external/task-instance/executor";
import { SVELTE_ENVIRONMENT } from './environment';
import { writable } from 'svelte/store';
import { CancelRequest } from './external/task-instance/cancelation';
import { CANCEL_KIND_LIFESPAN_END } from './external/task-instance/cancelation';

export class Task extends BaseTask {
  constructor(options) {
    super(options);
    this._state = {};
    this._store = writable(null);
    this.onState({ numRunning: 0, numQueued: 0 });
  }

  onHostTeardown() {
    if (this.isDestroying) { return; }
    this.isDestroying = true;
    let cancelRequest = new CancelRequest(CANCEL_KIND_LIFESPAN_END,
                                          'the component it lives on was unrendered');
    this.scheduler.cancelAll(this.guid, cancelRequest)
  }

  _perform(...args) {
    let executor = new TaskInstanceExecutor({
      generatorFactory: this.generatorFactory(args),
      env: SVELTE_ENVIRONMENT,
    });

    let taskInstance = new TaskInstance({
      task: this,
      executor,
      hasEnabledEvents: false,
    });

    if (this.isDestroying) {
      taskInstance.cancel();
    }

    this.scheduler.perform(taskInstance);
    return taskInstance;
  }

  subscribe(v) {
    return this._store.subscribe(v);
  }

  onState(state) {
    Object.assign(this._state, state);
    this._state.isRunning = this._state.numRunning > 0;
    this._store.set(this._state);
  }
}

function assertTrackingState(task, key) {
  if (!task.onState) {
    throw new Error(`You tried to access a task's ${key} property, but you haven't enabled state tracking on this task. Please use 'trackState: true' or '.trackState()' to enable state tracking on this task.`);
  }
}
