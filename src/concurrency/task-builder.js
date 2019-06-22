import { Task } from "../concurrency/task";
import unbounded from "./external/scheduler/policies/unbounded-policy";
import restartable from "./external/scheduler/policies/restartable-policy";
import enqueued from "./external/scheduler/policies/enqueued-policy";
import drop from "./external/scheduler/policies/drop-policy";
import keepLatest from "./external/scheduler/policies/keep-latest-policy";
import SvelteScheduler from "./scheduler";
import { onDestroy } from "svelte";

class TaskBuilder {
  constructor(options) {
    this.options = options;
  }

  create(instance) {
    let Policy = this.options.policy || drop;
    let schedulerPolicy = new Policy(this.options.maxConcurrency);
    let taskFn = this.options.perform;

    return new Task({
      generatorFactory: (args) => () => taskFn.apply(instance, args),
      context: instance,
      group: null,
      scheduler: new SvelteScheduler(schedulerPolicy, true),
      hasEnabledEvents: false,
    });
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

export function task(...args) {
  let context = {
    setState: (state, task) => {
      Object.assign(task, state);
      // task.context.setState({});
    }
  };

  // constructor(options) {
  //   super(options);
  //   cleanupOnDestroy(this.context, this, 'componentWillUnmount', 'onHostTeardown', {
  //     reason: 'the object it lives on was destroyed or unrendered',
  //     cancelRequestKind: CANCEL_KIND_LIFESPAN_END,
  //   });
  // }

  let taskObject = new TaskBuilder(args[0]).create(context);

  onDestroy(() => {
    taskObject.onHostTeardown();
  });

  return taskObject;
}

export {
  restartable,
  enqueued,
  drop,
  keepLatest,
  unbounded,
};
