import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Chip from "@material-ui/core/Chip";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import DeleteIcon from "@material-ui/icons/Delete";
import Details from "./mechanicRowDetails";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "",
      height:'10px',
    },
  },
});

export function Row(props) {
  let { row, deleteCallback } = props;
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState(1);
  const classes = useRowStyles();
  console.log(row)
  return (
    <React.Fragment>
      {row.phone ? (
        <TableRow className={classes.root}>
          <TableCell
            component="th"
            style={{ display: "flex", border: "none" }}
            scope="row"
            onClick={() => setOpen(!open)}
          >
            <h4 style={{width:'200px'}}>{row.phone}</h4>
            {row?.verified ? (
              <Chip style={{ width:'100px',marginLeft: 8,background: '#6f7c61', color: 'white' }} label="Verified" />
            ) : null}
          </TableCell>
          <TableCell align={"right"} style={{}}>
            {msg == 2 ? <span style={{color:'red',fontWeight:'700'}}>Are you sure?</span> : null}
            <IconButton
              aria-label="delete row"
              size="small"
              onClick={(event) => {
                event.preventDefault();
                if (msg < 2) setMsg(msg + 1);
                else deleteCallback(row.username);
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
