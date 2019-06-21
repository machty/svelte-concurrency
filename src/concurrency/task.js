import { Task as BaseTask } from './external/task/task';
import { TaskInstance } from "./task-instance";
import { TaskInstanceExecutor } from "./external/task-instance/executor";
import { SVELTE_ENVIRONMENT } from './environment';
import { CANCEL_KIND_LIFESPAN_END } from './external/task-instance/cancelation';
import { cleanupOnDestroy } from './external/lifespan';

export class Task extends BaseTask {
  constructor(options) {
    super(options);
    cleanupOnDestroy(this.context, this, 'componentWillUnmount', 'onHostTeardown', {
      reason: 'the object it lives on was destroyed or unrendered',
      cancelRequestKind: CANCEL_KIND_LIFESPAN_END,
    });
  }

  onHostTeardown() {
    this.isDestroying = true;
    this.context.__rcIsUnmounting__ = true;
    this.cancelAll();
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

    if (this.isDestroying || this.context.__rcIsUnmounting__) {
      taskInstance.cancel();
    }

    this.scheduler.perform(taskInstance);
    return taskInstance;
  }

  get isRunning() {
    assertTrackingState(this, 'isRunning');
    return this.numRunning > 0;
  }

  get isIdle() {
    assertTrackingState(this, 'isIdle');
    return this.numRunning == 0;
  }
}

function assertTrackingState(task, key) {
  if (!task.onState) {
    throw new Error(`You tried to access a task's ${key} property, but you haven't enabled state tracking on this task. Please use 'trackState: true' or '.trackState()' to enable state tracking on this task.`);
  }
}
