import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import firebase, { auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { FormControlLabel, Switch, Typography } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { notification, Modal } from 'antd'
import PDF from '../pdf'
export default function Details({
  row,
  edit,
  callback,
  level,
  refresh
}) {

  const dateFormat = (date) => {
    if (!date) return;
    const dateString = date.split("T")[0].split("-").reverse();
    const timeString = date.split("T")[1];
    const day = dateString[0];
    const mounth = dateString[1];
    const newDate = [mounth, day, dateString[2]].join("/");
    return `${newDate} ${timeString}`; //${timeString}
  };
  const openNotification2 = (placement, status) => {
    notification.success({
      message: `Notification Delete PDF File`,
      description:
        `Deleting PDF file Successfully Thank You!!!`,
      placement,
    });
  };
  const dateFormat2 = (date) => {
    if (!date) return;
    const dateString = date.split("T")[0].split("-").reverse();
    const timeString = date.split("T")[1];
    const day = dateString[0];
    const mounth = dateString[1];
    const newDate = [mounth, day, dateString[2]].join("/");
    return `${newDate} ${timeString}`; //${timeString}
  };

  const parse = (t) => {
    return ""
      .concat(t)
      .replace(/[^/]\d\d\d\d/g, (h) => `${h.slice(0, 3)}:${h.slice(3)}`);
  };
  const detailStyles = makeStyles((theme) => ({
    root: {},
    item: {
      margin: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    li: {
      fontSize: "14px",
      textAlign: "left",
      margin: "0px",
      padding: "0px",
      border: ".2px solid lightgray",
    },
  }));
  const classes = detailStyles();
  const [state, setVals] = React.useState(row);
  const [update, setUpdate] = React.useState("");
  const handleChange = (key, val) => {
    state[key] = val;
    setUpdate(val);
    setVals(state);
  };
  React.useEffect(() => callback(state), [update]);


  function getListMarkup(row, key, label) {
    if (label) {
      if (
        row[key] != "" &&
        key != "factoring" &&
        key != "estTime" &&
        key != "estTime2" &&
        key != "datn" &&
        key != "datnTime" &&
        key != "estTimest" &&
        key != "estTime2st" &&
        key != "reference" &&
        key != "po"

      ) {
        return (
          // info content
          <>
            {key != "pdfurl" && key != "pdfurl2" && key != "pdfurl3" && (
              <ListItemText
                className={classes.li}
                primary={key != "date" ? row[key] : null}
                secondary={row[key] !== null && key == 'weight' ? `LBS` : ""}
              />
            )}
            {key == "pdfurl" && row[key] != "undefined" ? <b onClick={showModal} >View PDF 1</b> : null}
            {key == "pdfurl2" && row[key] != "undefined" ? <b onClick={showModal}>View PDF 2</b> : null}
            {key == "pdfurl3" && row[key] != "undefined" ? <b onClick={showModal}>View PDF 3</b> : null}

          </>
        );
      } else if (key == "factoring")
        return (
          <ListItemText
            className={classes.li}
            primary={row[key] ? "Yes" : "No"}
            secondary={"Accepts factoring?"}
          />
        );

      else if (key == "reference") {
        return (
          <>
            <ListItemText
              className={classes.li}
              primary={row[key]}
              secondary={row[key] !== "" && 'Pickup PO#'}
            />
          </>
        );
      }

      else if (key == "po") {
        return (
          <ListItemText
            className={classes.li}
            primary={row[key]}
            secondary={row[key] !== "" && 'Delivery PO#'}
          />
        );
      }
    }
    else {
      if (
        row[key] != "" &&
        key != "factoring" &&
        key != "estTime" &&
        key != "estTime2" &&
        key != "datn" &&
        key != "datnTime" &&
        key != "estTimest" &&
        key != "estTime2st" &&
        key != "reference" &&
        key != "po"
      ) {
        return (
          <>
            {key != "phone" && key != "phoneNo" && key != "email" && (
              <ListItemText
                className={classes.li}
                primary={key != "date" ? row[key] : null}
                secondary={key}
              />
            )}
            {key == "phone" && (
              <a style={{ color: '#0000ffbd', fontWeight: 'bold' }} href={"tel:" + row[key]}> + {row[key]} <PhoneIcon /></a>
            )}
            {key == "phoneNo" && (
              <a style={{ color: '#0000ffbd', fontWeight: 'bold' }} href={"tel:" + row[key]}> + {row[key]} <PhoneIcon /></a>
            )}
            {key == "email" && (
              <a style={{ color: '#0000ffbd', fontWeight: 'bold' }} href={"mailto:" + row[key]}>{row[key]} <MailIcon /></a>
            )}
          </>
        );
      } else if (key == "factoring") {
        return (
          <ListItemText
            className={classes.li}
            primary={row[key] ? "Yes" : "No"}
            secondary={"Accepts factoring?"}
          />
        );
      }
      else if (key == "pdfurl") {
        return (
          <>
            <ListItemText
              className={classes.li}
              primary={row[key]}
              secondary={row[key] !== "" && 'Pickup PO#'}
            />
          </>
        );
      }

    }
  }

  const sortArr = (arr) => {
    var ret = [];
    if (arr.includes("phone")) ret = ["name", "address", "phone"];
    else if (arr.includes("phoneNo")) ret = ["name", "address", "phoneNo"];
    arr.map((key) => {
      if (!ret?.includes(key)) ret.push(key);
    });
    return ret;
  };
  const getMap = (stateObj, label = true) =>
    sortArr(Object.keys(stateObj)).map((key) => {
      if (
        key != "orderNotes" &&
        key != "verified" &&
        key != "dets" &&
        key != "news" &&
        key != "lumper" &&
        key != "history" &&
        key != "id" &&
        key != "broker" &&
        key != "pickup" &&
        key != "pickup2" &&
        key != "delivery2" &&
        key != "delivery" &&
        key != "useremail" &&
        key != "driver" &&
        key != "files" &&
        key != "removePayment" &&
        key != "CanceledTonu" &&
        key != "CanceledTonuUndo" &&
        key != "deliveruser" &&
        key != "city" &&
        key != "state" &&
        key != "usercreateorder" &&
        key != "daws" &&
        key != "zip" &&
        key != "address" &&
        key != "pTime" &&
        key != "dTime" &&
        key != "paidTime" &&
        key != "paiduser" &&
        key != "status" &&
        key != "dispatcher" &&
        key != "price"
      ) {
        return (
          <ListItem key={key} className={classes.li}>
            {!edit ? (
              getListMarkup(stateObj, key, label)
            ) : key != "factoring" ? (
              <TextField
                variant={"outlined"}
                label={key}
                value={stateObj[key]}
                onChange={(event) => handleChange(key, event.target.value)}
              />
            ) : (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={stateObj[key]}
                        onChange={(event) =>
                          handleChange(key, event.target.checked)
                        }
                      ></Switch>
                    }
                    label={key}
                  />
                )}
          </ListItem>
        );
        // }
      } else if (key == "address") {
        let item = "",
          item1 = "";
        [("address", "city", "state", "zip", "po")].map((key) => {
          if (stateObj[key] != "") {
            const obj = stateObj;
            if (obj) {
              item1 += obj.address;
              item += `${obj.city},${obj.state}, ${obj.zip}`;
            }
          }
        });
        return (
          <>
            <ListItem style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.open(`http://maps.google.com?q=${item1},${item}`)} className={classes.li}>{item1}</ListItem>
            <ListItem style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.open(`http://maps.google.com?q=${item1},${item}`)} className={classes.li}>{item}</ListItem>
          </>
        );
      } else return <></>;
    });
  const removeDets = () => {
    let o = state;
    o.pdf_Order_1 = null;
    o.pdf_Order_Name_1 = null;
    firebase
      .firestore()
      .collection('orders')
      .doc(state?.id)
      .set(o)
      .then(() => {
        openNotification2("bottonRight")
        refresh();
      });
  };
  const removeDets2 = () => {
    let o = state;
    o.pdf_Order_2 = null;
    o.pdf_Order_Name_2 = null;
    firebase
      .firestore()
      .collection('orders')
      .doc(state?.id)
      .set(o)
      .then(() => {
        openNotification2("bottonRight")
        refresh();
      });
  };
  const removeDets3 = () => {
    let o = state;
    o.pdf_Order_3 = null;
    o.pdf_Order_Name_3 = null;
    firebase
      .firestore()
      .collection('orders')
      .doc(state?.id)
      .set(o)
      .then(() => {
        openNotification2("bottonRight")
        refresh();
      });
  };
  const removeDets4 = () => {
    let o = state;
    o.pdf_Order_4 = null;
    o.pdf_Order_Name_4 = null;
    firebase
      .firestore()
      .collection('orders')
      .doc(state?.id)
      .set(o)
      .then(() => {
        openNotification2("bottonRight")
        refresh();
      });
  };
  const [driverss, loading2, error2] = useCollectionDataOnce(
    firebase.firestore().collection("drivers")
  );
  const [userss, loadissng, errossr] = useAuthState(auth);
  const newfilterdata = driverss?.filter(e => {
    if (e.email === userss.email) {
      return true
    }
  })
  let dem = 0;
  let hr = 0;
  state?.dets?.map(el => {
    dem = parseFloat(dem) + parseFloat(el.price)
    if (el?.hours != undefined) {
      hr = parseFloat(hr) + parseFloat(el?.hours)
    }
  })

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [isModalVisible2, setIsModalVisible2] = React.useState(false);

  const showModal2 = () => {
    setIsModalVisible2(true);
  };

  const handleOk2 = () => {
    setIsModalVisible2(false);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };
  const [isModalVisible3, setIsModalVisible3] = React.useState(false);

  const showModal3 = () => {
    setIsModalVisible3(true);
  };

  const handleOk3 = () => {
    setIsModalVisible3(false);
  };

  const handleCancel3 = () => {
    setIsModalVisible3(false);
  };
  const [isModalVisible4, setIsModalVisible4] = React.useState(false);

  const showModal4 = () => {
    setIsModalVisible4(true);
  };

  const handleOk4 = () => {
    setIsModalVisible4(false);
  };

  const handleCancel4 = () => {
    setIsModalVisible4(false);
  };
  const [isModalVisible5, setIsModalVisible5] = React.useState(false);

  const showModal5 = () => {
    setIsModalVisible5(true);
  };

  const handleOk5 = () => {
    setIsModalVisible5(false);
  };

  const handleCancel5 = () => {
    setIsModalVisible(false);
  };
  const [isModalVisible6, setIsModalVisible6] = React.useState(false);

  const showModal6 = () => {
    setIsModalVisible6(true);
  };

  const handleOk6 = () => {
    setIsModalVisible6(false);
  };

  const handleCancel6 = () => {
    setIsModalVisible6(false);
  };
  const [isModalVisible7, setIsModalVisible7] = React.useState(false);

  const showModal7 = () => {
    setIsModalVisible7(true);
  };

  const handleOk7 = () => {
    setIsModalVisible7(false);
  };

  const handleCancel7 = () => {
    setIsModalVisible(false);
  };
  const [isModalVisible8, setIsModalVisible8] = React.useState(false);

  const showModal8 = () => {
    setIsModalVisible8(true);
  };

  const handleOk8 = () => {
    setIsModalVisible8(false);
  };

  const handleCancel8 = () => {
    setIsModalVisible8(false);
  };
  return (
    <Grid container>
      <Grid item xs={10} lg={3}>
        <div className={classes.item}>
          <Typography
            variant={"button"}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <span style={{ paddingRight: '40px' }}> Info</span>
            <span
              style={{
                justifySelf: "left",
                marginRight: "6em",
                alignSelf: "left",
              }}
            >
              {new Date(state?.date?.seconds * 1000).toLocaleDateString()}
            </span>{" "}
          </Typography>
          {/* {getMap(state)} */}
          {state?.reference !== "" && (
            <ListItemText
              style={{ width: '100%' }}
              className={classes.li}
              primary={state?.reference}
              secondary="Pickup PO#"
            />
          )}
          {state?.po !== "" && (
            <ListItemText
              style={{ width: '100%' }}
              className={classes.li}
              primary={state?.po}
              secondary="Delivery PO#"
            />
          )}
          {state?.description !== "" && (
            <ListItemText
              style={{ width: '100%' }}
              className={classes.li}
              primary={state?.description}
              secondary="Description"
            />
          )}
          {state?.weight !== "" && state?.weight !== null && (
            <ListItemText
              style={{ width: '100%' }}
              className={classes.li}
              primary={state?.weight}
              secondary="LBS"
            />
          )}
          {state?.temprature !== "" && state.temprature != undefined && state.temprature != null && (
            <ListItemText
              style={{ width: '100%' }}
              className={classes.li}
              primary={`${state?.temprature}℉`}
              secondary="Temperature"
            />
          )}
          {state?.dryload !== "" && state.dryload != undefined && state.dryload != null && state.dryload != false && (
            <ListItemText
              style={{ width: '100%' }}
              className={classes.li}
              primary={`Dry Load`}
              secondary="Dry Load"
            />
          )}

          {state?.usercreateorder !== "" && state.usercreateorder != undefined && state.usercreateorder != null && (
            <ListItemText
              style={{ width: '100%' }}
              className={classes.li}
              primary={`${state.usercreateorder}  ${new Date(state.daws.seconds * 1000).toLocaleString()}`}
              secondary="Created By"
            />
          )}
          {state?.notes !== "" && (
            <ListItemText
              style={{ width: '100%' }}
              className={classes.li}
              primary={state?.notes}
              secondary="Notes"
            />
          )}
          {userss.accessLevel == "Admin" ? (
            <>
              {state?.pdfurl !== "undefined" && (
                <a style={{ color: 'blue', fontWeight: 'bold', border: '2px solid lightgray', width: '100%', cursor: 'pointer' }} href={state?.pdfurl} target="blank" ><b>View PDF 1</b></a>
              )}
              {state?.pdfurl2 !== "undefined" && (
                <a style={{ color: 'blue', fontWeight: 'bold', border: '2px solid lightgray', width: '100%', cursor: 'pointer' }} href={state?.pdfurl2} target="blank" ><b>View PDF 2</b></a>
              )}
              {state?.pdfurl3 !== "undefined" && (
                <a style={{ color: 'blue', fontWeight: 'bold', border: '2px solid lightgray', width: '100%', cursor: 'pointer' }} href={state?.pdfurl3} target="blank" ><b>View PDF 3</b></a>
              )}
              {state?.pdf_Order_1 !== "undefined" && state?.pdf_Order_3 !== undefined && state?.pdf_Order_1 !== null && (
                <div style={{ width: '100%', border: '2px solid lightgray', display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
                  <a style={{ color: 'blue', fontWeight: 'bold', width: '100%', cursor: 'pointer' }} href={state?.pdf_Order_1} target="blank" ><b>{state.pdf_Order_Name_1}</b></a>
                  <DeleteIcon onClick={() => removeDets()} />
                </div>
              )}
              {state?.pdf_Order_2 !== "undefined" && state?.pdf_Order_3 !== undefined && state?.pdf_Order_2 !== null && (
                <div style={{ width: '100%', border: '2px solid lightgray', display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
                  <a style={{ color: 'blue', fontWeight: 'bold', width: '100%', cursor: 'pointer' }} href={state?.pdf_Order_2} target="blank" ><b>{state.pdf_Order_Name_2} </b></a>
                  <DeleteIcon onClick={() => removeDets2()} />
                </div>
              )}
              {state?.pdf_Order_3 !== "undefined" && state?.pdf_Order_3 !== undefined && state?.pdf_Order_3 !== null && (
                <div style={{ width: '100%', border: '2px solid lightgray', display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
                  <a style={{ color: 'blue', fontWeight: 'bold', width: '100%', cursor: 'pointer' }} href={state?.pdf_Order_3} target="blank" ><b>{state.pdf_Order_Name_3}  </b></a>
                  <DeleteIcon onClick={() => removeDets3()} />
                </div>
              )}
              {state?.pdf_Order_4 !== "undefined" && state?.pdf_Order_4 !== undefined && state?.pdf_Order_4 !== null && (
                <div style={{ width: '100%', border: '2px solid lightgray', display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
                  <a style={{ color: 'blue', fontWeight: 'bold', width: '100%', cursor: 'pointer' }} href={state?.pdf_Order_4} target="blank" ><b>{state.pdf_Order_Name_4}  </b></a>
                  <DeleteIcon onClick={() => removeDets4()} />
                </div>
              )}
            </>
          ) : (
              <>
                {userss?.accessLevel == "User" && (
                  <>
                    {newfilterdata?.length && newfilterdata?.map(el => {
                      if (el.approve === false) {
                        return (
                          <>
                            {state?.pdfurl !== "undefined" && (
                              <a style={{ color: 'blue', fontWeight: 'bold', border: '2px solid lightgray', width: '100%', cursor: 'pointer' }} href={state?.pdfurl} target="blank" ><b>View PDF 1</b></a>
                            )}
                            {state?.pdfurl2 !== "undefined" && (
                              <a style={{ color: 'blue', fontWeight: 'bold', border: '2px solid lightgray', width: '100%', cursor: 'pointer' }} href={state?.pdfurl2} target="blank" ><b>View PDF 2</b></a>
                            )}
                            {state?.pdfurl3 !== "undefined" && (
                              <a style={{ color: 'blue', fontWeight: 'bold', border: '2px solid lightgray', width: '100%', cursor: 'pointer' }} href={state?.pdfurl3} target="blank" ><b>View PDF 3</b></a>
                            )}
                            {state?.pdf_Order_1 !== "undefined" && state?.pdf_Order_3 !== undefined && state?.pdf_Order_1 !== null && (
                              <div style={{ width: '100%', border: '2px solid lightgray', display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
                                <a style={{ color: 'blue', fontWeight: 'bold', width: '100%', cursor: 'pointer' }} href={state?.pdf_Order_1} target="blank" ><b>{state.pdf_Order_Name_1}</b></a>
                                <DeleteIcon onClick={() => removeDets()} />
                              </div>
                            )}
                            {state?.pdf_Order_2 !== "undefined" && state?.pdf_Order_3 !== undefined && state?.pdf_Order_2 !== null && (
                              <div style={{ width: '100%', border: '2px solid lightgray', display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
                                <a style={{ color: 'blue', fontWeight: 'bold', width: '100%', cursor: 'pointer' }} href={state?.pdf_Order_2} target="blank" ><b>{state.pdf_Order_Name_2} </b></a>
                                <DeleteIcon onClick={() => removeDets2()} />
                              </div>
                            )}
                            {state?.pdf_Order_3 !== "undefined" && state?.pdf_Order_3 !== undefined && state?.pdf_Order_3 !== null && (
                              <div style={{ width: '100%', border: '2px solid lightgray', display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
                                <a style={{ color: 'blue', fontWeight: 'bold', width: '100%', cursor: 'pointer' }} href={state?.pdf_Order_3} target="blank" ><b>{state.pdf_Order_Name_3}  </b></a>
                                <DeleteIcon onClick={() => removeDets3()} />
                              </div>
                            )}
                            {state?.pdf_Order_4 !== "undefined" && state?.pdf_Order_4 !== undefined && state?.pdf_Order_4 !== null && (
                              <div style={{ width: '100%', border: '2px solid lightgray', display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
                                <a style={{ color: 'blue', fontWeight: 'bold', width: '100%', cursor: 'pointer' }} href={state?.pdf_Order_4} target="blank" ><b>{state.pdf_Order_Name_4}  </b></a>
                                <DeleteIcon onClick={() => removeDets4()} />
                              </div>
                            )}
                          </>
                        )
                      }
                    })}
                  </>
                )}
              </>
            )}

          {state?.dets?.length > 0 ? (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                secondary={"Detentions"}
                primary={`${(() => {
                  var r = 0;
                  state?.dets.map(
                    (det) => (r = `${det.item} - $${dem} ${" "} ${det.hours == undefined ? "" : hr + 'Hours'}`)
                  );
                  return r;
                })()}`}
              />
            </ListItem>
          ) : null}
          {state?.news?.length > 0 ? (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                secondary={"Layover"}
                primary={`${(() => {
                  var r = 0;
                  state?.news.map(
                    (det) => (r = `${det.desc} - $${+parseFloat(det.layprice)}`)
                  );
                  return r;
                })()}`}
              />
            </ListItem>
          ) : null}
          {state?.lumper?.length > 0 ? (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                secondary={"Lumper Fee"}
                primary={`${(() => {
                  var r = 0;
                  state?.lumper.map(
                    (det) => (r = `${det.desc} - $${+parseFloat(det.lumperprice)}`)
                  );
                  return r;
                })()}`}
              />
            </ListItem>
          ) : null}
          {state?.pTime !== null && state?.pTime !== null && (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                secondary={"Pickup Time"}
                primary={`Order marked as picked up by ${state?.useremail} at ${new Date(state?.pTime?.seconds * 1000).toLocaleString()}`}
              />
            </ListItem>
          )}
          {state?.dTime !== null && state?.deliveruser !== null && state?.dTime !== null && (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                secondary={"Delivery Time"}
                primary={`Order marked as Delivered by ${state?.deliveruser} at ${new Date(state?.dTime?.seconds * 1000).toLocaleString()}`}
              />
            </ListItem>
          )}
          {state?.invoiceCreated != undefined && state?.invoiceCreated !== null && state?.invoicedTime !== null && (
            <ListItem className={classes.li}>
              <ListItemText
                style={{ color: 'red' }}
                className={classes.li}
                secondary={"Invoiced Time"}
                primary={`Order marked as Invoiced by ${state?.invoiceCreated} at ${new Date(state?.invoicedTime?.seconds * 1000).toLocaleString()}`}
              />
            </ListItem>
          )}
          {state?.removePayment != undefined && state?.removePayment !== null && (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                secondary={"Remove Payment"}
                primary={`${state?.removePayment?.RemovePayment} ${state?.removePayment.user} at ${new Date(state?.removePayment?.time?.seconds * 1000).toLocaleString()}`}
              />
            </ListItem>
          )}

          {state?.CanceledTonu != undefined && state?.CanceledTonu != null && (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                primary={state?.CanceledTonu?.cencelNotes}
                secondary={`Order marked as Canceled/Tonu by ${state?.CanceledTonu?.userEmail} at ${new Date(state?.CanceledTonu?.date?.seconds * 1000).toLocaleString()}`}
              />
            </ListItem>
          )}
          {state?.CanceledTonuUndo != undefined && state?.CanceledTonuUndo != null && (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                primary={state?.CanceledTonuUndo?.UndoNotes}
                secondary={`Order marked as Canceled/Tonu by ${state?.CanceledTonuUndo?.userEmail} at ${new Date(state?.CanceledTonuUndo?.date?.seconds * 1000).toLocaleString()}`}
              />
            </ListItem>
          )}

          {state?.partial !== undefined && state?.partial !== "" && (
            state?.partial.map(el => (
              <>
                <ListItem className={classes.li}>
                  <ListItemText
                    className={classes.li}
                    secondary={"Partially Paid"}
                    primary={`Order marked as PartiallyPaid by ${el.whoPaid} at ${el.currentTime} and Paid $${el.partialprice} using ${el.paymentMethod}`}
                  />
                </ListItem>
                {el.paymentnot != "" && (
                  <ListItem className={classes.li}>
                    <ListItemText
                      className={classes.li}
                      secondary={"Partially Notes"}
                      primary={`${el.paymentnot}`}
                    />
                  </ListItem>
                )}
              </>

            ))
          )}
          {state?.paidTime !== null && state?.paiduser !== null && state?.paidTime !== undefined && (
            <ListItem className={classes.li}>
              <ListItemText
                className={classes.li}
                secondary={"Paid Time"}
                primary={`Order marked as paid by ${state?.paiduser} at ${new Date(state?.paidTime?.seconds * 1000).toLocaleString()}`}
              />
            </ListItem>
          )}
        </div>
      </Grid>
      <Grid item xs={10} lg={3}>
        <>
          <div className={classes.item}>
            <Typography variant={"button"} style={{ width: '100%' }}>
              {" "}
              <span style={{ paddingRight: '10px', fontWeight: 'bold' }}> Pickup 1</span>
              <span
                style={{ fontWeight: 'bold' }}
              >
                {state?.pickup?.datn == undefined ? (
                  <>
                    {state?.pickup?.estTime?.seconds !== undefined ? new Date(state?.pickup?.estTime?.seconds * 1000).toLocaleDateString() : dateFormat(state?.pickup?.estTime)}{" - "}
                  </>
                ) : (
                    <>
                      {state?.pickup?.datn}{' - '}
                    </>
                  )}
                {state?.pickup?.datnTime == undefined ? (
                  <>
                    {state?.pickup?.estTime2?.seconds !== undefined ? new Date(state?.pickup?.estTime2.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : state.pickup.estTime2}
                  </>
                ) : (
                    <>
                      {state?.pickup?.datnTime}
                    </>
                  )}
                {" "}
              </span>{" "}
            </Typography>
            {getMap(state.pickup, false)}
          </div>
          <div>
            {Array.isArray(state.pickup2) &&
              state.pickup2.map((pickup, index) => {
                return (
                  <Grid key={index} item xs={10} lg={12}>
                    <div className={classes.item}>
                      <Typography variant={"button"} style={{ width: '100%' }}>
                        <span style={{ paddingRight: '20px', fontWeight: 'bold' }}>Pickup - {index + 2}</span>
                        <span
                          style={{
                            justifySelf: "left",
                            marginRight: "6em",
                            alignSelf: "left",
                            fontWeight: 'bold'
                          }}
                        >
                          {pickup?.estTimest == undefined ? (
                            <>
                              {pickup?.estTime?.seconds !== undefined ? new Date(pickup?.estTime?.seconds * 1000).toLocaleDateString() : dateFormat(pickup?.estTime)}{" - "}
                            </>
                          ) : (
                              <>
                                {pickup?.estTimest} {' - '}
                              </>
                            )}
                          {pickup?.estTime2st == undefined ? (
                            <>
                              {pickup?.estTime2?.seconds !== undefined ? new Date(pickup?.estTime2.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : pickup.estTime2}
                            </>
                          ) : (
                              <>
                                {pickup?.estTime2st} {' - '}
                              </>
                            )}
                          {/* {pickup?.estTime?.seconds !== undefined ? new Date(pickup?.estTime?.seconds * 1000).toLocaleDateString() : dateFormat(pickup?.estTime)}{" - "} */}
                          {/* {pickup?.estTime2?.seconds !== undefined ? new Date(pickup?.estTime2.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : pickup.estTime2} */}
                        </span>{" "}
                        <br />
                      </Typography>
                      {getMap(pickup, false)}
                    </div>
                    <br />
                  </Grid>
                );
              })}
          </div>
        </>
      </Grid>
      {/* )} */}
      <Grid item xs={10} lg={3}>
        <>
          <div className={classes.item}>
            <Typography variant={"button"} style={{ width: '100%' }}>
              {" "}
              <span style={{ paddingRight: '10px', fontWeight: 'bold' }}>Delivery-1</span>
              <span
                style={{
                  fontWeight: 'bold'
                }}
              >
                {state?.delivery?.datn == undefined ? (
                  <>
                    {state?.delivery?.estTime?.seconds !== undefined ? new Date(state?.delivery?.estTime?.seconds * 1000).toLocaleDateString() : dateFormat(state.delivery.estTime)}{" - "}
                  </>
                ) : (
                    <>
                      {state?.delivery?.datn} {' - '}
                    </>
                  )}
                {state?.delivery?.datnTime == undefined ? (
                  <>
                    {state?.delivery?.estTime2?.seconds !== undefined ? new Date(state?.delivery?.estTime2.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : state.delivery.estTime2}

                  </>
                ) : (
                    <>
                      {state?.delivery?.datnTime}
                    </>
                  )}

              </span>{" "}
            </Typography>
            {getMap(state.delivery, false)}
          </div>
          <div>
            {Array.isArray(state.delivery2) &&
              state.delivery2.map((delivery, index) => {
                return (
                  <Grid item xs={10} lg={12}>
                    <div className={classes.item}>
                      <Typography variant={"button"} style={{ width: '100%' }}>
                        {" "}
                        <span style={{ paddingRight: '20px', fontWeight: 'bold' }}>Delivery {index + 2}</span>
                        <span
                          style={{
                            justifySelf: "left",
                            marginRight: "2em",
                            alignSelf: "left",
                            fontWeight: 'bold'
                          }}
                        >
                          {delivery?.estTimest == undefined ? (
                            <>
                              {delivery?.estTime?.seconds !== undefined ? new Date(delivery?.estTime?.seconds * 1000).toLocaleDateString() : dateFormat(delivery.estTime)}{" - "}
                            </>
                          ) : (
                              <>
                                {delivery?.estTimest} {' - '}
                              </>
                            )}
                          {delivery?.estTime2st == undefined ? (
                            <>
                              {delivery?.estTime2?.seconds !== undefined ? new Date(delivery?.estTime2.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : delivery.estTime2}
                            </>
                          ) : (
                              <>
                                {delivery?.estTime2st}
                              </>
                            )}
                          {/* {delivery?.estTime?.seconds !== undefined ? new Date(delivery?.estTime?.seconds * 1000).toLocaleDateString() : dateFormat(delivery.estTime)}{" - "}
                          {delivery?.estTime2?.seconds !== undefined ? new Date(delivery?.estTime2.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : delivery.estTime2} */}
                        </span>{" "}

                      </Typography>
                      {getMap(delivery, false)}
                    </div>
                  </Grid>
                );
              })}
          </div>
        </>
      </Grid>
      <Grid item xs={10} lg={3}>
        <div className={classes.item}>
          <Typography style={{ paddingRight: '250px' }} variant={"button"}>Broker</Typography>
          {getMap(state.broker, false)}
        </div>
      </Grid>
      <Grid item xs={10} lg={3}>
        <div className={classes.item}>
          {state?.orderNotes?.length != 0 && (
            <Typography variant={"button"} style={{ color: '#3c2d2d', fontWeight: 'bolder' }}>Internal Notes</Typography>
          )}
          {Array.isArray(state?.orderNotes) ? (
            <>
              {state?.orderNotes !== [] && state?.orderNotes?.map(el => (
                <>
                  <ListItem>
                    <ListItemText className={classes.li}
                      primary={el.orderNotes}
                      secondary={`By ${el?.userEmail} on ${el?.date} ${el?.time}`} />
                  </ListItem>
                </>
              ))}
            </>
          ) : (
              <ListItem>
                <ListItemText className={classes.li} primary={state?.orderNotes} />
              </ListItem>
            )}
        </div>
      </Grid>
    </Grid>
  );
}

