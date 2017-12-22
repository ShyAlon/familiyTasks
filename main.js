const admin                = require('firebase-admin');
const {Task, TaskInstance} = require('./pojo/task');
const serviceAccount       = require("./familytasks2017-firebase-adminsdk-tlpmx-82f97e012a");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function createTaskInstances(tasksToStart) {
  const taskInstances = db.collection('taskInstances');
  for (let i = 0; i < tasksToStart.length; i++) {
    const taskToStart  = tasksToStart[i];
    const taskInstance = new TaskInstance(taskToStart, member);
    const docRef       = taskInstances.doc(taskInstance.key);
    const setAda       = docRef.set(taskInstance);
  }
}

function handleActiveTasks(activeTasks) {
  const taskInstances = db.collection('taskInstances');
  taskInstances.get()
    .then(snapshot => {
      const existingTaskInstances = snapshot.map(t => new TaskInstance(t));
      const activeTasksIds        = new Set(existingTaskInstances.map(x => x.taskId));
      const tasksToStart          = activeTasks.filter(task => !activeTasksIds.has(task.id));
      createTaskInstances(tasksToStart);
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

function setActiveTasks() {
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
  // const citiesRef = db.collection('cities');
  // var query = citiesRef.where('capital', '==', true).get()
  //   .then(snapshot => {
  //     snapshot.forEach(doc => {
  //       console.log(doc.id, '=>', doc.data());
  //     });
  //   })
  //   .catch(err => {
  //     console.log('Error getting documents', err);
  //   });
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
