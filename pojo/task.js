const logger = require("winston");

const periods = {
  day : "daily",
  week: "weekly",
  none: "none"
};

class Item {
  constructor(id) {
    if (!id) {
      this.id = Item.guid();
    }
  }

  static guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}

class Task extends item {
  constructor({startTime, endTime, adHoc, repeat, dailyStartTime, dailyEndTime, weekDays, memberId, id}) {
    super(id);
    this.startTime      = startTime || Number.MAX_VALUE;
    this.endTime        = endTime || 0;
    this.adHoc          = adHoc || false;
    this.repeat         = repeat || periods.none;
    this.dailyStartTime = dailyStartTime || 2500;
    this.dailyEndTime   = dailyEndTime || -1;
    // bit arrangement of week days
    this.weekDays       = weekDays || 0;
    this.memberId       = memberId;
  }

  get inDailyTime() {
    const now       = new Date();
    const dailyTime = now.getUTCHours() * 100 + now.getUTCMinutes();
    return dailyTime <= this.dailyEndTime && dailyTime >= this.dailyStartTime;
  }

  get isRepeatingNow() {
    return this.repeat === periods.day && this.inDailyTime ||
      this.repeat === periods.week && this.inDailyTime && (this.weekDays & Math.pow(2, new Date().getDay()));
  }


  get isActive() {
    return this.adHoc && Date.now() >= this.startTime && Date.now() <= this.endTime || isRepeatingNow;
  }
}

class TaskInstance extends item {
  constructor({task, id}) {
    super(id);
    this.taskId   = task.id;
    this.memberId = task.memberId;
  }

  get key() {
    return `${this.memberId}-${this.taskId}`;
  }
}

class Member extends item {
  constructor({taskInstances, id}) {
    super(id);
    this.taskInstances = taskInstances || {};
  }

  addTaskInstance(taskInstance) {
    if (this.taskInstances[taskInstance.id]) {
      logger.warn("Overriding task instance!");
    }
    this.taskInstances[taskInstance.id] = taskInstance;
  }
}

module.exports = {Task, TaskInstance, Member};