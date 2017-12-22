const periods = {
  day : "daily",
  week: "weekly",
  none: "none"
};

class Task {
  constructor({startTime, endTime, adHoc, repeat, dailyStartTime, dailyEndTime, weekDays}) {
    this.startTime      = startTime || Number.MAX_VALUE;
    this.endTime        = endTime || 0;
    this.adHoc          = adHoc || false;
    this.repeat         = repeat || periods.none;
    this.dailyStartTime = dailyStartTime || 2500;
    this.dailyEndTime   = dailyEndTime || -1;
    // bit arrangement of week days
    this.weekDays       = weekDays || 0;
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

class TaskInstance {
  constructor(task, member) {
    this.taskId = task.id;
    this.memberId = member.id;
  }

  get key() {
    return `${this.memberId}-${this.taskId}`;
  }
}

module.exports = {Task, TaskInstance};