import { useState, useEffect } from "react";
import { Button, Grid, Paper } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import firebase from "../config/firebase";
import { DatePicker, Space, Select as Selets, Button as Btns, Radio, Switch } from 'antd';
import Tables from '../components/table'
import RepairTable from '../components/reporttable'

import {
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";

export default function Data({ classes }) {
  const [orders, loading0, error0] = useCollectionDataOnce(
    firebase.firestore().collection("orders")
  );
  const [loadin, setloadin] = useState(false)
  const [dispatchers, loading1, error1] = useCollectionDataOnce(
    firebase.firestore().collection("dispatchers")
  );
  const [drivers, loading2, error2] = useCollectionDataOnce(
    firebase.firestore().collection("drivers")
  );
  const [brokers, loading3, error3] = useCollectionDataOnce(
    firebase.firestore().collection("brokers")
  );
  const [customers, loading4, error4] = useCollectionDataOnce(
    firebase.firestore().collection("customers")
  );
  const [vehicle, loading0s, errors0] = useCollectionDataOnce(
    firebase.firestore().collection("EQP")
  );
  const [Repairss, loading0ss, errors0s] = useCollectionDataOnce(
    firebase.firestore().collection("Repairs")
  );
  if (!loading0 && !loading1 && !loading2 && !loading3 && !loading4) {
    dispatchers.push({ name: "Admin" }, { name: "Any" });
    brokers.push({ name: "Any" });
    drivers.push({ name: "Any" });
    customers.push({ name: "Any" });
  }
  const [val, setval] = useState('Load')
  const [val2, setval2] = useState('Any')
  const [vehicleset, setvehicles] = useState('Any')
  const [vehiclestatus, setvehiclestatus] = useState('Any')
  const { Option } = Selets
  const newss = vehicleset.split(',')
  const [togle, settogle] = useState(false)
  const date = new Date()
  const onChange = e => {
    setval(e.target.value);
  };
  const onChange2 = e => {
    setval2(e.target.value);
  };
  function onChangeSwitch(checked) {
    settogle(checked);
  }
  date.setDate(1)
  const [from, setFrom] = useState(new Date(date));
  const [to, setTo] = useState(new Date());
  const filterrepair = Repairss?.filter(el => {
    if (vehicleset == "Any" && vehiclestatus == "Any" && new Date(el?.createdDate?.seconds * 1000) >= new Date(from) && new Date(el?.createdDate?.seconds * 1000) <= new Date(to)) {
      return true
    } else if (vehiclestatus == "Any" && new Date(el?.createdDate?.seconds * 1000) >= new Date(from) && new Date(el?.createdDate?.seconds * 1000) <= new Date(to) && el.vehicle.vinNumber == newss[0] && el.vehicle.year == newss[1] && el.vehicle.make == newss[2] && el.vehicle.modle == newss[3]) {
      return true
    } else if (vehiclestatus == el.status && new Date(el?.createdDate?.seconds * 1000) >= new Date(from) && new Date(el?.createdDate?.seconds * 1000) <= new Date(to) && el.vehicle.vinNumber == newss[0] && el.vehicle.year == newss[1] && el.vehicle.make == newss[2] && el.vehicle.modle == newss[3]) {
      return true
    } else if (vehiclestatus == el.status && vehicleset == "Any" && new Date(el?.createdDate?.seconds * 1000) >= new Date(from) && new Date(el?.createdDate?.seconds * 1000) <= new Date(to)) {
      return true
    }
    else {
      return false
    }
  })
  filterrepair?.sort(function (a, b) {
    return new Date(b?.createdDate.seconds * 1000) - new Date(a?.createdDate.seconds * 1000);
  });
  const generateReport = (reportOrders) => {
    if (reportOrders.length) {
      if (window) {
        setloadin(true)
        fetch(`/api/get_m_report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportOrders: reportOrders,
          }),
        }).then(async (res) => {
          if (res.status === 200) {
            const blob = await res.blob();
            const fileSaver = require("file-saver");
            fileSaver.saveAs(blob, "report.xlsx");
            setloadin(false)
          }
        });
      }
    } else {
      console.log('error 71')
      setloadin(false)
    }
  };

  const dateFormatList = 'MM/DD/YYYY'
  const vehiclefilter = vehicle && vehicle.filter(el => val2 == "Any" ? true : val2 == el.type ? true : false)
  return (
    <>
      <h1 style={{ color: '#3d4052', fontWeight: 'bold', fontStyle: 'normal' }}>Report <Radio.Group onChange={onChange} value={val}>
        <Radio value={"Load"}>Load Report</Radio>
        <Radio value={"Repair"}>Repair Report</Radio>
      </Radio.Group></h1>

      {val == 'Load' ? (
        <>
          {!loading0 && !loading1 && !loading2 && !loading3 && !loading4 ? (
            <Reports
              classes={classes}
              orders={orders}
              dispatchers={dispatchers}
              drivers={drivers}
              customers={customers}
              brokers={brokers}
            ></Reports>
          ) : null}
        </>
      ) : (
          <Paper style={{ marginTop: '30px' }} className={classes.paper}>
            <div className="jawaw">
              <div style={{ marginBottom: '20px' }}>
                <Radio.Group onChange={onChange2} value={val2}>
                  <Radio value={"Any"}>Any</Radio>
                  <Radio value={"Truck"}>Truck</Radio>
                  <Radio value={"Trailer"}>Trailer</Radio>
                </Radio.Group>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '48%' }}>
                  <p style={{ margin: '0px', fontWeight: 'bold' }}>Select Status <span className="optional">(Optional)</span></p>
                  <Selets defaultValue={vehiclestatus} onChange={(e) => setvehiclestatus(e)}>
                    <Option value="Any">Any</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="done">Completed</Option>
                  </Selets>
                </div>
                <div style={{ width: '48%' }}>
                  <p style={{ margin: '0px', fontWeight: 'bold' }}>Select Vehicle <span className="optional">(Optional)</span></p>
                  <Selets defaultValue={vehicleset} onChange={(e) => setvehicles(e)}>
                    <Option value="Any">Any</Option>
                    {vehiclefilter?.sort((a, b) => new Date(b?.data?.seconds * 1000) - new Date(a?.data?.seconds * 1000))?.map(el => (
                      <Option key={Math.random() * 6} value={`${el.vinNumber}${el.year},${el.make},${el.modle}`}>{el.vinNumber} {" "} {el.year} {" "} {el.make}  {" "} {el.modle}</Option>
                    ))}
                  </Selets>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', marginBottom: '30px' }}>
                <div style={{ width: '48%' }}>
                  <p style={{ margin: '0px', fontWeight: 'bold' }}>From <span className="optional">(Optional)</span></p>
                  <DatePicker format={dateFormatList} placeholder="Start-Date" style={{ height: '45px', width: '100%' }} onChange={(evt) => setFrom(evt?._d)} /></div>
                <div style={{ width: '48%' }}>
                  <p style={{ margin: '0px', fontWeight: 'bold' }}>To <span className="optional">(Optional)</span></p>
                  <DatePicker format={dateFormatList} placeholder="End-Date" style={{ height: '45px', width: '100%' }} onChange={(evt) => setTo(evt?._d)} /></div>
              </div>
              <Btns onClick={() => generateReport(filterrepair)} className="btn" type="primary" loading={loadin}>
                Generate Report
              </Btns>
              Show Repairs Data
            <Switch style={{ marginLeft: '20px' }} defaultChecked={togle} onChange={onChangeSwitch} />
            </div>
            {togle && (
              <div className="jwawaw">
                <RepairTable filterrepair={filterrepair} />
              </div>
            )}
          </Paper>
        )}
    </>
  );
}

function Reports({
  classes,
  orders,
  dispatchers,
  drivers,
}) {
  const [alert, setAlert] = useState(false);
  const [dispatcher, setDispatcher] = useState("Any");
  const [driver, setDriver] = useState("Any");
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const date = new Date()
  const datewa = new Date().setDate(1)
  const [from2, setFrom2] = useState(datewa);
  date.setDate(1)
  const [to2, setTo2] = useState(new Date());
  const newdata = [...orders];
  const dateFormatList = 'MM/DD/YYYY'
  const generateReport = () => {
    const yesterday = new Date(from)
    yesterday.setDate(yesterday.getDate() - 1)
    let reportOrders = orders
      .filter((order) => {
        const newdatess = order?.pickup?.estTime?.seconds != null || order?.pickup?.estTime?.seconds != undefined ? order.pickup.estTime.seconds * 1000 : order.pickup.estTime;
        if (order?.dispatcher?.name === dispatcher && driver === "Any" && new Date(newdatess) >= new Date(yesterday) && new Date(newdatess) <= new Date(to)) {
          console.log("A")
          return order
        } else if (order?.driver?.name === driver && dispatcher === "Any" && new Date(newdatess) >= new Date(yesterday) && new Date(newdatess) <= new Date(to)) {
          console.log("Bee")
          return order
        } else if (dispatcher !== "Any" && driver === "Any" && order?.driver?.name === driver && new Date(newdatess) >= new Date(yesterday) && new Date(newdatess) <= new Date(to)) {
          console.log("Bwww")
          return order
        }
        else if (driver !== "Any" && dispatcher === "Any" && order?.dispatcher?.name === dispatcher && new Date(newdatess) >= new Date(yesterday) && new Date(newdatess) <= new Date(to)) {
          console.log("Baaa")
          return order
        } else if (driver === "Any" && dispatcher === "Any" && new Date(newdatess) >= new Date(yesterday) && new Date(newdatess) <= new Date(to)) {
          console.log("Bdadwa")
          return order
        }
        else if (driver !== "Any" && dispatcher !== "Any" && order?.dispatcher?.name === dispatcher && order?.driver?.name === driver && new Date(newdatess) >= new Date(yesterday) && new Date(newdatess) <= new Date(to)) {
          console.log("Bdas")
          return order
        }
      }).sort(
        (a, b) =>
          new Date(a?.date?.seconds * 1000) - new Date(b?.date?.seconds * 1000)
      );
    if (reportOrders.length) {
      if (window) {
        setAlert(false);
        fetch(`https://young-waters-85175.herokuapp.com/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportOrders: reportOrders,
          }),
        }).then(async (res) => {
          if (res.status === 200) {
            const blob = await res.blob();
            const fileSaver = require("file-saver");
            fileSaver.saveAs(blob, "report.xlsx");
          }
        });
      }
    } else setAlert(true);
  };
  const so = newdata?.filter(el => {
    const yesterday = new Date(from2)
    yesterday.setDate(yesterday.getDate() - 1)
    if (yesterday === undefined && to2 === undefined) {
      if (new Date(el?.pickup?.estTime?.seconds * 1000) >= new Date(date) && new Date(el?.pickup?.estTime?.seconds * 1000) <= new Date()) {
        return el
      }
    }
    else if (yesterday !== undefined && to2 !== undefined) {
      if (new Date(el?.pickup?.estTime?.seconds * 1000) >= new Date(yesterday) && new Date(el?.pickup?.estTime?.seconds * 1000) <= new Date(to2)) {
        return el
      }
    }

  })
  useEffect(() => {
  }, [so])
 
  return (
    <>
      {alert ? (
        <Alert
          severity="error"
          onClose={() => setAlert(false)}
          style={{ marginBottom: "0.5em" }}
        >
          No matching orders.
        </Alert>
      ) : null}
      <div className="la">
        <div className="las">
          <div style={{ marginBottom: 10 }}>
            <InputLabel className={classes.label}>Dispatcher</InputLabel>
            <Select
              variant={"outlined"}
              value={dispatcher}
              fullWidth
              onChange={(event) => setDispatcher(event.target.value)}
            >
              {dispatchers.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <InputLabel className={classes.label}>Driver</InputLabel>
            <Select
              variant={"outlined"}
              value={driver}
              fullWidth
              onChange={(event) => setDriver(event.target.value)}
            >
              {drivers.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <DatePicker format={dateFormatList} placeholder="Start-Date" style={{ height: '35px', width: "46%", marginRight: '10px' }} onChange={(evt) => setFrom(evt?._d)} />
            <DatePicker format={dateFormatList} placeholder="End-Date" style={{ height: '35px', width: "50%" }} onChange={(evt) => setTo(evt?._d)} />
          </div>
          <Btns onClick={generateReport} className="btn" type="primary"><b>Generate Report</b></Btns>
        </div>
        <div className="lalaa">
          <Tables drivers={drivers} so={so} from2={from2} setFrom2={setFrom2} to2={to2} setTo2={setTo2} />
        </div>
      </div>
    </>
  );
}


