import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteIcon from '@material-ui/icons/Delete';
import Details from './BrokerRowDetails'


const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: '',
            padding:'0px'
        }
    },
});

export function Row({row, deleteCallback}) {
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const [row2,setrow2] = React.useState(row)
    React.useEffect(() => {
        setrow2(row)
    })
    return (
        <React.Fragment>
            <TableRow  onClick={() => setOpen(!open)} style={{padding:'1px'}}>
                <TableCell component="th" scope="row">
                    <p style={{margin:'0px',color: row2.block == undefined || row2.block === false ? '#3d4052': 'red',fontWeight:row2.block == undefined || row2.block === false ?"" : 'bold'}}>{row2.name}</p>
                </TableCell>
                <TableCell align={"right"}>
                    <IconButton aria-label="delete row" size="small"  onClick={
                        (event)=>{
                            event.preventDefault()
                            deleteCallback(row2.name)
                        }}>
                        <DeleteIcon></DeleteIcon>
                    </IconButton>
                    <IconButton aria-label="expand row" size="small" >
                        {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ padding:'0 1px'  }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit style={{paddingBottom:10}}>
                        <Details row={row2}></Details>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

