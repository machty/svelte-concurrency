import { BaseTaskInstance } from './external/task-instance/base';

export class TaskInstance extends BaseTaskInstance {
  setState(state) {
    Object.assign(this, state);
    // this.task.instance.setState(state);
    // setProperties(this, props);
    // let state = this._recomputeState();
    // setProperties(this, {
    //   isRunning: !this.isFinished,
    //   isDropped: state === 'dropped',
    //   state,
    // });
  }

  onStarted() {
    this.triggerEvent("started", this);
  }

  onSuccess() {
    this.triggerEvent("succeeded", this);
  }

  onError(error) {
    this.triggerEvent("errored", this, error);
  }

  onCancel(cancelReason) {
    this.triggerEvent("canceled", this, cancelReason);
  }

  formatCancelReason(reason) {
    return `TaskInstance '${this.getName()}' was canceled because ${reason}. For more information, see: http://ember-concurrency.com/docs/task-cancelation-help`;
  }

  getName() {
    if (!this.name) {
      this.name = this.task.name || "<unknown>";
    }
    return this.name;
  }

  selfCancelLoopWarning(parent) {
    let parentName = `\`${parent.getName()}\``;
    let childName = `\`${this.getName()}\``;
    // eslint-disable-next-line no-console
    console.warn(
      `ember-concurrency detected a potentially hazardous "self-cancel loop" between parent task ${parentName} and child task ${childName}. If you want child task ${childName} to be canceled when parent task ${parentName} is canceled, please change \`.perform()\` to \`.linked().perform()\`. If you want child task ${childName} to keep running after parent task ${parentName} is canceled, change it to \`.unlinked().perform()\``
    );
  }

  triggerEvent(...allArgs) {
    return;

    if (!this.eventsEnabled) {
      return;
    }

    let taskInstance = this;
    let task = taskInstance.task;
    let host = task.context;
    let eventNamespace = task && task._propertyName;

    if (host && host.trigger && eventNamespace) {
      let [eventType, ...args] = allArgs;
      host.trigger(`${eventNamespace}:${eventType}`, ...args);
    }
  }
}

export default TaskInstance;
