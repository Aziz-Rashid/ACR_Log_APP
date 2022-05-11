import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from '../../config/firebase'

import { Grid, Paper, Table, TableContainer, TableBody } from '@material-ui/core'

import { Rows } from '../../components/orders/row'
export default function OrderPage({ classes, user }) {
    const router = useRouter()
    const { order_id } = router.query
    const [orders, loading, error] = useCollectionData(
        firebase.firestore().collection('orders').where('id', '==', `${order_id}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table aria-label="collapsible table">
                            <TableBody>
                                {/* <Row order_id={order_id} row={{ name: order.id, ...order }} user={user} level={user.accessLevel} classes={classes} refresh={
                                    () => router.push(`/orders/${order_id}`)
                                } /> */}
                                <h1>{order_id} Order Detail</h1>
                                {orders?.length && orders?.map((row) => {
                                    return (
                                        <Rows
                                            key={`${row.id}-${new Date().getTime()}`}
                                            rowObj={row}
                                            level={user.accessLevel}
                                            archeive={false}
                                        />
                                    )
                                }
                                )}
                            </TableBody></Table></TableContainer></Grid></Grid></Paper>
    )
}