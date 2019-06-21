import { Task } from "../concurrency../task";
import unbounded from "./external/scheduler/policies/unbounded-policy";
import restartable from "./external/scheduler/policies/restartable-policy";
import enqueued from "./external/scheduler/policies/enqueued-policy";
import drop from "./external/scheduler/policies/drop-policy";
import keepLatest from "./external/scheduler/policies/keep-latest-policy";
import SvelteScheduler from "./scheduler";

class TaskBuilder {
  constructor(options) {
    this.options = options;
  }

  restartable() {
    return this._clone({ policy: restartable });
  }

  enqueued() {
    return this._clone({ policy: enqueued });
  }

  drop() {
    return this._clone({ policy: drop });
  }

  keepLatest() {
    return this._clone({ policy: keepLatest });
  }

  unbounded() {
    return this._clone({ policy: unbounded });
  }

  maxConcurrency(maxConcurrency) {
    return this._clone({ maxConcurrency });
  }

  onState(onState) {
    return this._clone({
      onState: whenMounted(onState)
    });
  }

  onStateRaw(onState) {
    return this._clone({ onState });
  }

  trackState() {
    return this._clone({ trackState: true });
  }

  _clone(options) {
    return new TaskBuilder(Object.assign({}, this.options, options));
  }

  bind(instance) {
    let Policy = this.options.policy || drop;
    let schedulerPolicy = new Policy(this.options.maxConcurrency);
    let taskFn = this.options.perform;
    let onState = this.options.trackState ?
      whenMounted(updateTaskAndReRender) :
      this.options.onState;

    return new Task({
      generatorFactory: (args) => () => taskFn.apply(instance, args),
      context: instance,
      group: null,
      scheduler: new SvelteScheduler(schedulerPolicy, true),
      hasEnabledEvents: false,
      onState,
    });
  }

  get perform() {
    forgotBindError();
  }

  get isRunning() {
    forgotBindError();
  }
}

function whenMounted(callback) {
  return (state, task) => {
    if (task.context.__rcIsUnmounting__) {
      return;
    }
    callback(state, task);
  };
}

function forgotBindError() {
  throw new Error(`It looks like you trying to use a task, but you haven't called .bind(this) on it.`);
}

function updateTaskAndReRender(state, task) {
  Object.assign(task, state);
  task.context.setState({});
}

export function task(...args) {
  if (args.length === 2) {
    return new TaskBuilder(args[1]).bind(args[0]);
  } else {
    return new TaskBuilder(args[0]);
  }
}

export {
  restartable,
  enqueued,
  drop,
  keepLatest,
  unbounded,
};
