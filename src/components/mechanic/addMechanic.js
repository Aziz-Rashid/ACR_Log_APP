import {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import firebase from '../../config/firebase'

const useStyles = makeStyles((theme) => ({
    root: {
        width:'70%',
        margin:'auto',
        display:'flex',
        flexDirection:'column',
        '& > *': {
            flex:1,
            margin: theme.spacing(1),
        },
    },
}));

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

export default function DriverForm(props) {

    const query = useMediaQuery('(max-width:768px)')
    const {callback} = props
    const classes = useStyles();
    const [name, setName] = useState('')
    const [email,setEmail] = useState('')
    const [error, setErr] = useState({})
    const [phoneNo, setPhoneNo] = useState('')
    const validateForm = () => {
        if (email!=''&&name!=''){
            const customer = {name, email, phoneNo, history:[], verified:false,mechanic: true}
            fetch('/api/mechanicmail', {method: 'POST', body: JSON.stringify(customer)}).then(
                (r)=>{
                    console.log(r)
                }
            )
            firebase.firestore().collection('mechanics').doc(name).set(customer).then(
                () => {
                    callback('success', customer)
                }
            ).catch(()=>callback('error'))
            setErr({})
        }else{
            var n,e
            if(name=='')n=true
            if(email=='')e=true
            setErr({name:n, email:e})
        }
    }
    return (
        <div className={classes.root} style={query?{flexDirection:"column"}:null}>
            <TextField label={"Name"}  variant={"outlined"} value={name} error={error.name} onChange={(event)=>setName(event.target.value)}/>
            <TextField label={"Email"} variant={"outlined"} value={email} error={error.email} onChange={(event)=>setEmail(event.target.value)}/>
            <TextField label={"Phone"} variant={"outlined"} value={phoneNo} onChange={(event)=> {
                setPhoneNo(event.target.value);
            }} InputProps={{inputComponent:TextMaskCustom}}/>
            <Button style={{background: 'rgb(61, 64, 82)', color: 'white'}} variant={"contained"}  onClick={validateForm}>Submit</Button>
        </div>
    );
}
