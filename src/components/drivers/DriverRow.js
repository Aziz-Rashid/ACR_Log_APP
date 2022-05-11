import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { FormControlLabel, Switch } from '@material-ui/core'
import Card from "@material-ui/core/Card";
import { useAuthState } from "react-firebase-hooks/auth";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import DeleteIcon from "@material-ui/icons/Delete";
import firebase,{auth} from "../../config/firebase";
import Details from "./DriverRowDetails";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "",
      height: '10px'
    },
  },
});

export function Row(props) {
  let { row, deleteCallback, getDrivers } = props;
  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState(1);
  const classes = useRowStyles();

  const handleSave = (row, target) => {
    const data = row
    data.approve = target
    firebase.firestore().collection('drivers').doc(data.name).set(data).then(
      () => {
        getDrivers()
      }
    )
  }
  const adm = process.env.ADMIN_EMAILS.includes(user?.email);
  return (
    <React.Fragment>
      {row.name ? (
        <TableRow className={classes.root}>
          <TableCell
            component="th"
            style={{ display: "flex", border: "none" }}
            scope="row"
            onClick={() => setOpen(!open)}
          >
            <h5 style={{ width: '200px', color: row?.approve === true ? "red" : "", fontWeight: row?.approve === true ? "bold" : "" }}>{row.username}</h5>
            {row.verified ? (
              <Chip style={{ width: '100px', marginLeft: 8 }} label="Verified" />
            ) : null}
          </TableCell>
          <TableCell align={"right"}>
            {adm ? (
              <FormControlLabel
                control={<Switch
                  style={{color:row?.approve === true ? "red": "green"}}
                  checked={row?.approve}
                  onChange={(event) => handleSave(row, event.target.checked)}
                ></Switch>}
                label={row?.approve === true ? "Not Approved" : "Approved"}
              />
            ): null}
            {msg == 2 ? "Are you sure?" : null}
            <IconButton
              aria-label="delete row"
              size="small"
              onClick={(event) => {
                event.preventDefault();
                if (msg < 2) setMsg(msg + 1);
                else deleteCallback(row.name);
              }}
            >
              <DeleteIcon></DeleteIcon>
            </IconButton>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
      ) : null}

      <TableRow>
        <TableCell style={{ padding: "0 1px" }} colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            style={{ paddingBottom: 10 }}
          >
            <Details row={row}></Details>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
