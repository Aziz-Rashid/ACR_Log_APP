import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row } from "../components/orders/OrdersRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Select } from 'antd'
import { useAuthState } from "react-firebase-hooks/auth";
import { Alert, Skeleton } from "@material-ui/lab";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import firebase, { auth } from "../config/firebase";
import EnhancedTableToolbar from "../components/orders/EnhancedTableToolbar";


function Rows({ filters, orders2, search,
  ordersNew,
  orderstransit,
  cenceled,
  ordersdelivered,
  orderspaid, rowsPerPage, page, statuss, user, refresh, deleteCallback }) {
  const currentDate = new Date();
  const currentDateTime = currentDate.getTime();
  const last30DaysDate = new Date(currentDate.setDate(currentDate.getDate() - 90));
  const last30DaysDateTime = last30DaysDate.getTime();
  const last30DaysList = orderspaid?.filter(x => {
    const elementDateTime = new Date(x?.date?.seconds * 1000).getTime();
    if (elementDateTime <= currentDateTime && elementDateTime > last30DaysDateTime) {
      return true;
    } else {
      return false
    }
  }).sort((a, b) => {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  })

  // (elementDateTime < last30DaysDateTime)

  const currentDate2 = new Date();
  orderspaid?.sort(function (a, b) {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  });
  const currentDateTime2 = currentDate2.getTime();
  const last30DaysDate2 = new Date(currentDate2.setDate(currentDate2.getDate() - 90));
  const last30DaysDateTime2 = last30DaysDate2.getTime();
  const last30DaysList2 = orderspaid?.filter(x => {
    const elementDateTime2 = new Date(x?.date?.seconds * 1000).getTime();
    if (elementDateTime2 < last30DaysDateTime2) {
      return true;
    } else {
      return false
    }
  }).sort((a, b) => {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  })
  ordersNew?.sort(function (a, b) {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  });
  orderstransit?.sort(function (a, b) {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  });
  ordersdelivered?.sort(function (a, b) {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  });

  orders2?.sort(function (a, b) {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  });
  const newdata = orders2?.filter(row => {
    if (row.id.toLowerCase().includes(search.toLowerCase()) && filters == "Order ID") {
      return true
    }
    else if (row.driver.name?.toLowerCase()?.includes(search.toLowerCase()) && filters == "Driver name") {
      return true
    }
    else if (row.broker.name?.toLowerCase()?.includes(search.toLowerCase()) && filters == "Broker name") {
      return true
    }
    else if (row.pickup.name?.toLowerCase()?.includes(search.toLowerCase()) && filters == "Pickup name") {
      return true
    }
    else if (row.delivery.name?.toLowerCase()?.includes(search.toLowerCase()) && filters == "Delivery name") {
      return true
    }
    else if (row.pickup.address?.toLowerCase()?.includes(search.toLowerCase())) {
      return true
    }
    else if (row.pickup.city?.toLowerCase()?.includes(search.toLowerCase())) {
      return true
    }
    else if (row.pickup.state?.toLowerCase()?.includes(search.toLowerCase())) {
      return true
    }
    else if (row.pickup.zip?.toLowerCase()?.includes(search.toLowerCase()) && filters == "Pickup address") {
      return true
    }
    else if (row.delivery.address?.toLowerCase()?.includes(search.toLowerCase())) {
      return true
    }
    else if (row.delivery.city?.toLowerCase()?.includes(search.toLowerCase())) {
      return true
    }
    else if (row.delivery.state?.toLowerCase()?.includes(search.toLowerCase())) {
      return true
    }
    else if (row.delivery.zip?.toLowerCase()?.includes(search.toLowerCase()) && filters == "Delivery address") {
      return true
    }
    else {
      return false
    }
  })
  newdata?.sort(function (a, b) {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  });

  cenceled?.sort(function (a, b) {
    return new Date(b?.date?.seconds) - new Date(a?.date?.seconds);
  });
  return (
    <>
      {search !== "" ? (
        <>
          {newdata && newdata?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
            return (
              <Row
                key={`${row.id}-${new Date().getTime()}`}
                rowObj={row}
                level={user.accessLevel}
                refresh={refresh}
                deleteCallback={deleteCallback}
                archeive={false}
              />
            )
          }
          )}
        </>
      ) : null}
      {statuss === "New" && search === '' ? (
        <>
          {ordersNew && ordersNew.map((row) => {
            if (row?.status == "New" && row?.cancelTonuStatus == false || row.cancelTonuStatus == undefined || row?.cancelTonuStatus == null) {
              return (
                <Row
                  key={`${row.id}-${new Date().getTime()}`}
                  rowObj={row}
                  level={user.accessLevel}
                  refresh={refresh}
                  deleteCallback={deleteCallback}
                  archeive={false}
                />
              )
            };
          }
          )}
        </>
      ) : null}

      {statuss === "In Transit" && search === '' ? (
        <>
          {orderstransit && orderstransit.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
            if (row?.status == "In Transit" && row?.cancelTonuStatus == false || row.cancelTonuStatus == undefined || row?.cancelTonuStatus == null) {
              return (
                <Row
                  key={`${row.id}-${new Date().getTime()}`}
                  rowObj={row}
                  level={user.accessLevel}
                  refresh={refresh}
                  deleteCallback={deleteCallback}
                  archeive={false}
                />
              )

            };
          }
          )}
        </>
      ) : null}
      {statuss === "Delivered" && search === '' ? (
        <>
          {/* {ordersdelivered && ordersdelivered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => { */}
          {ordersdelivered && ordersdelivered.map((row) => {
            if (row?.status == "Delivered" && row?.invoiced == null) {
              if (row.removePaymentStatus == true || row.removePaymentStatus == false || row.removePaymentStatus == undefined || row.removePaymentStatus == null) {
                return (
                  <Row
                    key={`${row.id}-${new Date().getTime()}`}
                    rowObj={row}
                    level={user.accessLevel}
                    refresh={refresh}
                    deleteCallback={deleteCallback}
                    archeive={false}
                  />
                )
              }
            };
          }
          )}
        </>
      ) : null}
      {statuss === "Invoiced" && search === '' ? (
        <>
          {ordersdelivered && ordersdelivered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
            if (row.status == "Delivered" && row.invoiced == true) {
                return (
                  <Row
                    key={`${row.id}-${new Date().getTime()}`}
                    rowObj={row}
                    level={user.accessLevel}
                    refresh={refresh}
                    deleteCallback={deleteCallback}
                    archeive={false}
                  />
                )
            };
          }
          )}
        </>
      ) : null}
      {statuss === "Canceled/TONU" && search === '' ? (
        <>
          {cenceled && cenceled.map((row) => {
            if (row?.cancelTonuStatus == true) {
              return (
                <Row
                  key={`${row.id}-${new Date().getTime()}`}
                  rowObj={row}
                  level={user.accessLevel}
                  refresh={refresh}
                  deleteCallback={deleteCallback}
                  archeive={false}
                />
              )
            };
          }
          )}
        </>
      ) : null}

      {statuss == "Paid" && search === '' ? (
        <>
          {last30DaysList && last30DaysList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
            if (row.status == "Paid" && row?.cancelTonuStatus == false || row.cancelTonuStatus == undefined || row?.cancelTonuStatus == null) {
              return (
                <Row
                  key={`${row.id}-${new Date().getTime()}`}
                  rowObj={row}
                  level={user.accessLevel}
                  refresh={refresh}
                  deleteCallback={deleteCallback}
                  archeive={false}
                />
              )
            };
          }
          )}
        </>
      ) : null}


      {statuss == "oldPaid" && search === '' ? (
        <>
          {last30DaysList2 && last30DaysList2?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
            if (row.status == "Paid" && row?.cancelTonuStatus == false || row.cancelTonuStatus == undefined || row?.cancelTonuStatus == null) {
              return (
                <Row
                  key={`${row.id}-${new Date().getTime()}`}
                  rowObj={row}
                  level={user.accessLevel}
                  refresh={refresh}
                  deleteCallback={deleteCallback}
                  archeive={true}
                />
              )
            };
          }
          )}
        </>
      ) : null}
    </>
  );
}

export function OrdersTable({
  ordersNew,
  orderstransit,
  ordersdelivered,
  orderspaid,
  classes,
  cenceled,
  user,
  orders2,
  refresh,
  setstatuss,
  statuss,
  drivers,
}) {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [sort, setSort] = React.useState("DESC");
  const [search, setSearch] = useState('')
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
    firebase
      .firestore()
      .collection("orders")
      .doc(name)
      .delete()
      .then(() => {
        var arr = ordersNew.filter((item) => item.name != name);
        setCustomers(arr);
      });
  };
  const filawa = ordersdelivered?.filter(row => {
    if(row?.status == "Delivered" && row?.invoiced == null){
      if(row.removePaymentStatus == true || row.removePaymentStatus == false || row.removePaymentStatus == undefined || row.removePaymentStatus == null){
        return true 
      }
    }
  })
  const filawa2 = ordersdelivered?.filter(row => {
    if(row.status == "Delivered" && row.invoiced == true){
      return true
    }
  })
  
  const datalength = statuss == "New" ? ordersNew?.length : statuss == "In Transit" ? orderstransit?.length : statuss == "Delivered" ? filawa?.length : statuss == "Paid" ? orderspaid?.length : statuss == "Invoiced" ? filawa2?.length : 0
  return (
    <Paper className={classes.paper2}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EnhancedTableToolbar
            drivers={drivers}
            numSelected={selected.length}
            handleSort={setSort}
            refresh={refresh}
            statuss={statuss}
            orders={orders2}
            handleSearch={handleSearch}
            setstatuss={setstatuss}
          />
          {/* after toolbar */}
          <Divider style={{ marginBottom: "1rem", marginTop: "1rem" }} />
          <TableContainer
            style={user.accessLevel == "Admin" ? null : { marginTop: 20 }}
          >
            <Table aria-label="collapsible table" size="small">
              {/* dashboard rows */}
              <TableBody>
                <Rows
                  refresh={refresh}
                  user={user}
                  ordersNew={ordersNew}
                  orderstransit={orderstransit}
                  ordersdelivered={ordersdelivered}
                  orderspaid={orderspaid}
                  statuss={statuss}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  cenceled={cenceled}
                  orders2={orders2}
                  deleteCallback={deleteCallback}
                  search={search}
                  filters={filters}
                />
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className={classes.pagination}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 300, 500]}
            component="div"
            count={datalength}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function OrdersPage({ classes, user }) {
  const [ordersnew, setOrdersnew] = useState([]);
  const [users, loadinga, errora] = useAuthState(auth);
  const [orderstransit, setOrderstransit] = useState([]);
  const [ordersdeliver, setOrdersdeliver] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const router = useRouter();
  const [statuss, setstatuss] = useState('')
  const [formStatus, setStatus] = useState("");
  const [orders2, setOrders2] = useState([]);

  let status = localStorage.getItem('status')
  if (status == null) {
    status = "New"
  }
  if (status == "Invoiced") {
    status = "Delivered"
  }
  if (status == "oldPaid") {
    status = "Paid"
  }
  useEffect(() => setStatus(router.query.status), []);
  const [order_Newaa, loading2aa, erroraa2] = useCollectionData(
    firebase.firestore().collection("orders")
  );
  const getneworder = order_Newaa?.filter(el => el.status == "New" ? true : false)
  const gettranistorder = order_Newaa?.filter(el => el.status == "In Transit" ? true : false)
  const getdeliveryorder = order_Newaa?.filter(el => el.status == "Delivered" ? true : false)
  const getpaidorder = order_Newaa?.filter(el => el.status == "Paid" ? true : false)
  const getpaidordercencel = order_Newaa?.filter(el => el.cancelTonuStatus == true ? true : false)

  const datafetch = () => {
    const nes = getneworder && getneworder?.filter(el => {
      if (user.accessLevel == "Admin") {
        return true
      } else if (el.driver.email == users.email) {
        return true
      }
    })
    setOrdersnew(nes)
  }
  const datafetchdelivery = () => {
    const nes2 = getdeliveryorder && getdeliveryorder?.filter(el => {
      if (user.accessLevel == "Admin") {
        return true
      } else if (el.driver.email == users.email) {
        return true
      }
    })
    setOrdersdeliver(nes2)
  }
  const datafetchtransit = () => {
    const nes3 = gettranistorder && gettranistorder?.filter(el => {
      if (users.accessLevel == "Admin") {
        return true
      } else if (el.driver.email == users.email) {
        return true
      }
    })
    setOrderstransit(nes3)
  }
  const refreshHook = () => {
    console.log("working")
  };
  useEffect(() => {
    datafetch()
    datafetchdelivery()
    datafetchtransit()
  }, [order_Newaa])

  const getOrders2 = (callback) => {
    var customersCol = [];
    firebase
      .firestore()
      .collection("orders")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (user.accessLevel == "Admin") customersCol.push(doc.data());
          else if (doc.data().driver.email == users.email) {
            customersCol.push(doc.data());
          }
        });
        var driversarr = drivers;
        customersCol.map((order) => {
          if (!driversarr.includes(order.driver.name)) {
            driversarr.push(order.driver.name);
          }
        });
        callback([driversarr, customersCol]);
      });
  };

  const refreshHook2 = () => {
    setOrders2([]);
    getOrders2(([dr, or]) => {
      setDrivers(dr);
      setOrders2(or);
    });
  };
  useEffect(refreshHook2, []);
  useEffect(refreshHook2, [status]);
  useEffect(() => {
    if (user.accessLevel === 'Sales') {
      router.push('/customers')
    }
  }, [])
  return (
    <>
      {user.accessLevel === 'Sales' ?
        <>
        </> : (
          <>
            {formStatus != "" && formStatus != undefined ? (
              <Alert
                color={formStatus != "success" ? "error" : "success"}
                onClose={() => {
                  setStatus("");
                }}
                style={{ marginBottom: "0.5em" }}
              >
                {formStatus == "success" ? "Order added!" : "Error"}
              </Alert>
            ) : null}
            <div style={{ display: "flex" }}>
              <Typography component="h4" variant="h5" gutterBottom style={{ marginBottom: 0, color: '#3d4052' }}>
                <i><b>{status} Orders</b></i>
              </Typography>

            </div>
            {order_Newaa?.length >= 0 ? (
              <OrdersTable
                drivers={drivers}
                ordersNew={ordersnew}
                orderstransit={orderstransit}
                ordersdelivered={ordersdeliver}
                orderspaid={getpaidorder}
                user={users}
                orders2={orders2}
                cenceled={getpaidordercencel}
                setstatuss={setstatuss}
                statuss={statuss}
                classes={classes}
                refresh={refreshHook}
              ></OrdersTable>
            ) : (
                <>
                  <Paper className={classes.paper}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Skeleton variant={"text"} animation={"pulse"} />
                        <Skeleton variant={"text"} animation={"wave"} />
                        <Skeleton variant={"text"} animation={"pulse"} />
                      </Grid>
                    </Grid>
                  </Paper>
                  <div style={{ marginTop: '30px' }}>
                    <Paper className={classes.paper}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Skeleton variant={"text"} animation={"pulse"} />
                          <Skeleton variant={"text"} animation={"pulse"} />
                          <Skeleton variant={"text"} animation={"wave"} />
                          <Skeleton variant={"text"} animation={"pulse"} />
                          <Skeleton variant={"text"} animation={"pulse"} />
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                </>
              )}
          </>
        )}
    </>
  );
}
