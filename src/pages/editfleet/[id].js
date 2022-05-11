import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import firebase from '../../config/firebase'
import AddFleet from '../addfleet'
const EditEQP = () => {
    const router = useRouter()
    const { id } = router.query
    const [mechanic, setmechanic] = useState([]);
    const getDrivers = () => {
        firebase
            .firestore()
            .collection("EQP")
            .get()
            .then((querySnapshot) => {
                var customersCol = [];
                querySnapshot.forEach((doc) => {
                    customersCol.push(doc.data());
                });
                setmechanic(customersCol);
            });
    };
    useEffect(getDrivers, []);
    const newdata = mechanic.filter(el => Number(el.id) === Number(id) && true )
    return (
        <>
        {newdata.length && newdata.map(el => (
            <AddFleet order={newdata} />
        ))}
        </>
    )
}
export default EditEQP