import firebase from '../../config/firebase'

export default async (req, res) => {
  try{
    const {status} = req.body
    console.log(status)
    var newdata = []
    const citiesRef = firebase.firestore().collection('orders');
    const snapshot = await citiesRef.where('status', '==', status).get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }  
    snapshot.forEach(doc => {
      newdata.push(doc.data());
    });
    console.log(newdata)

   res.status(200).send(JSON.stringify(newdata))
  }
  catch(err){
    console.log(err)
    return res.status(405)
  }
}
