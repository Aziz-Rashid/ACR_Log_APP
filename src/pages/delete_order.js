import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Row } from '../components/orders/OrdersRow'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { Skeleton, Alert } from '@material-ui/lab';
import { Toolbar, Tooltip, IconButton, Table, TableBody, TableContainer, TextField, useMediaQuery, TablePagination } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import clsx from 'clsx'
import AddCustomerForm from '../components/customers/AddCustomerForm'
import { makeStyles, lighten } from '@material-ui/core/styles';
import firebase from '../config/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import EnhancedTableToolbar from '../components/orders/EnhancedTableToolbar'
import { Input } from 'antd'

function OrdersTable({ orders, classes, user, refresh, search }) {
    const [selected, setSelected] = useState([])
    const [ordersList, setOrders] = useState(orders)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);


    const [statuss, setstatuss] = useState('New')
    const [filters, setfilters] = useState('')

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearch = async (searchVal, filter) => {
        setSearch(searchVal)
        setfilters(filter)
    };

    const deleteCallback = (name) => {
        firebase.firestore().collection('orders').doc(name).delete().then(() => {
            var arr = ordersList.filter(item => item.name != name)
            setCustomers(arr)
        })
    }
    return (
        <Paper className={classes.paper2}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table aria-label="collapsible table">
                            <TableBody>
                                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    if (row.id.toLowerCase().includes(search.toLowerCase())) {
                                        return (
                                            <Row deletorder="delete" refresh={refresh} key={row.name} order_id={row.id} rowObj={row} level={user.accessLevel} deleteCallback={deleteCallback} />
                                        )
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className={classes.pagination}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={ordersList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default function OrdersPage({ classes, user }) {
    const [orders, setOrders] = useState([]);
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [refresh, setRefresh] = useState(0)
    const getOrders = () => {
        firebase.firestore().collection('Delete_Orders').get().then(
            (querySnapshot) => {
                var customersCol = []
                querySnapshot.forEach(doc => {
                    if (user.accessLevel == "Admin") customersCol.push(doc.data());
                    else if (doc.driver.email == user.email) {
                        customersCol.push(doc.data())
                    }
                })
                setOrders(customersCol)
            }

        )
    }
    const refreshHook = () => setRefresh(refresh + 1)
    useEffect(getOrders, [refresh])
    const [formStatus, setStatus] = useState('')
    useEffect(() => setStatus(router.query.status), [])
    return (
        <React.Fragment>
            {formStatus != '' && formStatus != undefined ?
                <Alert color={formStatus != 'success' ? "error" : "success"} onClose={() => { setStatus('') }} style={{ marginBottom: '0.5em' }}>{formStatus == 'success' ? "Order added!" : "Error"}</Alert>
                : null
            }
            <div style={{ display: 'flex', marginBottom: '0.5em', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography component="h4" variant="h5" gutterBottom style={{ marginBottom: 0, color: '#3d4052' }}>
                    <i><b> Delete Orders</b></i>
                </Typography>
                <div>
                    <Input value={search} style={{ marginBottom: '20px' }} placeholder="Enter Your OrderID..." onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            {
                orders.length ?
                    <OrdersTable search={search} orders={orders} user={user} classes={classes} refresh={refreshHook}></OrdersTable>
                    :
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Skeleton variant={"text"} animation={"pulse"} />
                                <Skeleton variant={"text"} animation={"wave"} />
                                <Skeleton variant={"text"} animation={"pulse"} />
                            </Grid>
                        </Grid>
                    </Paper>


            }

        </React.Fragment>
    );
}