import firebase  from 'firebase'

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyCzN-z645eyo0nJNmPcffsIf4aKmRqleMU",
    authDomain: "cydene-76cfb.firebaseapp.com",
    projectId: "cydene-76cfb",
    storageBucket: "cydene-76cfb.appspot.com",
    messagingSenderId: "978490694849",
    appId: "1:978490694849:web:026496ac2811e816314840",
    measurementId: "G-PEFBMS77PS"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp
