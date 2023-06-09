import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'


const firebaseConfig = {
  apiKey: "AIzaSyBv96kdXT-Q_8A26m0XqyE_8PTTVdsIa3g",
  authDomain: "photo-uploader-3ca69.firebaseapp.com",
  databaseURL: "https://photo-uploader-3ca69-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "photo-uploader-3ca69",
  storageBucket: "photo-uploader-3ca69.appspot.com",
  messagingSenderId: "780868910769",
  appId: "1:780868910769:web:7164502a36e2572e92ac90",
  measurementId: "G-Z29RD22VS5"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage
        block.style.width = percentage
      }, error => {
        console.log(error)
      }, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log('Download URL', url)
        })
      })
    })
  }
})