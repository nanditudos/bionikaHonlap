// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTr7kWUxXB-M9e0T5T6U5yuJwpWaHx0gI",
  authDomain: "bionikahonlap.firebaseapp.com",
  projectId: "bionikahonlap",
  storageBucket: "bionikahonlap.firebasestorage.app",
  messagingSenderId: "633221608543",
  appId: "1:633221608543:web:34211d37c78ce9755117ea",
  measurementId: "G-G19M8RMWRP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function addItem(data) {
  db.collection("comments").add({"timestamp":new Date().getTime(),"data":data})
}

let savedcomments = null
async function getAllItems(forceReload=false) {
  if (savedcomments != null && !forceReload) return savedcomments
  const snapshot = await db.collection("comments").get();
  let comments = []
  snapshot.forEach(doc => {
    const data = doc.data();
    comments.push({ id: doc.id, name: data.name, data: data.data ,timestamp: data.timestamp});
  });
  savedcomments=comments
  return comments
}

async function getRatingOf(c) {
	const allComments = await getAllItems()
	let out = 0
	allComments.forEach(function (e) {
		if (e["data"]["type"]=="class"&&e["data"]["for"]==c) {
			out+=Number(e["data"]["rating"])
		}
	});
	return out
}

