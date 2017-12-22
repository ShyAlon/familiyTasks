const admin                = require('firebase-admin');
const {Task, TaskInstance, Member} = require('./pojo/task');
const serviceAccount       = require("./familytasks2017-firebase-adminsdk-tlpmx-82f97e012a");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function createTaskInstances(tasksToStart) {
  const members = db.collection('members');
  for (let i = 0; i < tasksToStart.length; i++) {
    const taskToStart     = tasksToStart[i];
    const taskInstance    = new TaskInstance(taskToStart);
    const docRef          = members.doc(taskToStart.memberId);
    docRef.get().then(m => {
      const member = new Member(m);
      member.addTaskInstance(taskInstance);
      docRef.set(docRef);
    });
  }
}

function handleActiveTasks(activeTasks) {
  const members = db.collection('members');
  members.get()
    .then(snapshot => {
      const existingTaskInstances = snapshot.map(m => m.taskInstances).reduce((accumulator, currentValue) => {
          return accumulator.concat(currentValue);
        }, []).map(t => new TaskInstance(t));
      const activeTasksIds        = new Set(existingTaskInstances.map(x => x.taskId));
      const tasksToStart          = activeTasks.filter(task => !activeTasksIds.has(task.id));
      createTaskInstances(tasksToStart);
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

function startNewTasks() {
  const tasks = db.collection('tasks');
  tasks.get()
    .then(snapshot => {
      const activeTasks = snapshot.map(t => new Task(t)).filter(task => task.isActive);
      handleActiveTasks(activeTasks);
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

setInterval(() => {
  startNewTasks();
  finalizeFinishedTasks
}, 2000);


// router.get('/add', function(req, res, next) {
//   res.send('adding user');
//   const docRef = db.collection('users').doc('alovelace');
//   const setAda = docRef.set({
//     first: 'Ada',
//     last : 'Lovelace',
//     born : 1815
//   });
// });
