import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from '../../config/firebase'
import NewRepair from '../newRepair'

export default function EuipmentPage({classes}){
    const router = useRouter()
    const {id} = router.query
    console.log(id,"aaaaaaaaaa")
    var order
    const [orders, loading, error] = useCollectionData(
        firebase.firestore().collection('New Repair'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )
 
    useEffect(()=>{

    },[orders])
    if(!loading){
        if(orders.length && id){
            orders.map(item=>{
                console.log(item)
                if(item.milage == id.toString()) order = item;
            })
        }
    }
console.log(order)
    if (order!= undefined )return <NewRepair order={order} classes={classes} />
    else return <></>
}