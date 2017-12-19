const admin = require('firebase-admin');

const serviceAccount = require("./familytasks2017-firebase-adminsdk-tlpmx-82f97e012a");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function setActiveTasks() {
  const tasks = db.collection('tasks');
  var query = tasks.where('capital', '==', true).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
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
