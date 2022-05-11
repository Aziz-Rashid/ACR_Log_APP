import { useState, useEffect } from 'react';
import { Button, Divider, Grid, Paper, TextField, InputAdornment } from '@material-ui/core'
import firebase from '../config/firebase'
import { useCollectionDataOnce, useCollectionData } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'
import SheetJSApp from '../components/xlx'
import SheetJSApp2 from '../components/xlx2'
import { Button as Btn } from 'antd'

function Edit(props) {
    console.log(props)
    const { classes, email, pass, template, callback, template2 } = props
    const [email1, setEmail] = useState()
    const [pass1, setPass] = useState()
    const [template1, setTemplate] = useState()
    const [templateNotif, setTemplate2] = useState()
    console.log(template)
    useEffect(() => { setEmail(email); setPass(pass); setTemplate(template); setTemplate2(template2) }, [])
    return (

        <>
            {/*<div style={{display:'flex'}}>*/}
            {/*    <TextField fullWidth variant={"outlined"} label={"Email"} value={email1} style={{marginBottom:8, marginRight:4}}*/}
            {/*               onChange={event => setEmail(event.target.value)}/>*/}
            {/*    <TextField fullWidth variant={"outlined"} label={"Pass"} value={pass1} style={{marginBottom:8, marginLeft:4}} type={"password"}*/}
            {/*               onChange={event => setPass(event.target.value)}/>*/}
            {/*</div>*/}
            <TextField fullWidth multiline variant={"outlined"} label={"Order Notificatiom Template"} value={template1} style={{ marginBottom: 8 }}
                onChange={event => setTemplate(event.target.value)} />
            <TextField fullWidth multiline variant={"outlined"} label={"New Driver Template"} value={templateNotif} style={{ marginBottom: 8 }}
                onChange={event => setTemplate2(event.target.value)} />
            <Button variant={"contained"} color={"primary"} fullWidth onClick={() => callback({ email1, pass1, template1, templateNotif })} >Save</Button>
        </>


    )
}

function Display(props) {
    const { email, pass, template, template2 } = props
    return (<>
        {/*<div style={{display:'flex'}}>*/}
        {/*    <TextField fullWidth disabled variant={"outlined"} label={"Email"} value={email} style={{marginBottom:8, marginRight:4}}/>*/}
        {/*    <TextField fullWidth disabled variant={"outlined"} label={"Pass"} value={pass} style={{marginBottom:8, marginLeft:4}} type={"password"}/>*/}
        {/*</div>*/}
        <TextField fullWidth disabled multiline variant={"outlined"} label={"New Order Template"} value={template} style={{ marginBottom: 8 }} />
        <TextField fullWidth disabled multiline variant={"outlined"} label={"New Driver Template"} value={template2} style={{ marginBottom: 8 }} />

    </>)
}

export default function SettingsPage({ classes }) {
    const [get, setget] = useState(0)
    const [getdata, setgetdata] = useState([])
    const [getdatas, setgetdatas] = useState([])
    const [getdata2, setgetdata2] = useState([])
    const [getdatas2, setgetdatas2] = useState([])

    const savedata = () => {
        const newdata = []
        getdatas.map((r, i) => {
            newdata.push(r)
        })
        firebase.firestore().collection('xlx').doc('xlx1').set({ data: newdata }).then(() => {
            console.log("working")
        })
        const newdata2 = []
        getdatas2.map((r, i) => {
            newdata2.push(r)
        })
        firebase.firestore().collection('xlx').doc('xlx2').set({ data: newdata2 }).then(() => {
            console.log("working")
        })
    }
    const [settings, loading, error] = useCollectionDataOnce(
        firebase.firestore().collection('settings')
    )
    const [settings2, loading2, error2] = useCollectionData(
        firebase.firestore().collection('fee')
    )
    const [settingsobj, setSettings] = useState({})
    const [edit, setEdit] = useState(false)
    const callback = (settingsf) => {
        const objs = { template: settingsf.template1, template2: settingsf.templateNotif }
        firebase.firestore().collection('settings').doc('settings').set(objs).then(() => {
            setEdit(false); setSettings(objs)
        })
    }
    const savedatafirebase = () => {
        firebase.firestore().collection('fee').doc('FactoryFee').set({ factoryfee: get }).then(() => {
            console.log("working")
        })
    }
    useEffect(() => {
        setSettings(settings ? settings[0] : {})
    }, [loading])
    useEffect(() => {
        if (get == 0) {
            if (settings2?.length) {
                setget(settings2[0]?.factoryfee)
            }
        }
    }, [loading2])
    if (!loading) return (
        <>
            <div style={{ display: 'flex', marginBottom: '0.5em', marginTop: '20px' }}>
                {edit ?
                    <Button variant={"contained"} color={"secondary"} style={{ marginLeft: 'auto' }}
                        onClick={() => setEdit(false)}>
                        Cancel Setting
                    </Button> :
                    <>
                        <Button variant={"contained"} color={"primary"} style={{ marginLeft: 'auto' }}
                            onClick={() => setEdit(true)}>
                            Edit Setting
                    </Button>
                    </>

                }
            </div>
            <div className="fact">
                <div className="Factory">
                    <h1 className="fa">Factory Fee</h1>
                    <TextField fullWidth variant={"outlined"} label={"Factory Fee %"} onChange={(e) => setget(e.target.value)} value={get} style={{ marginBottom: 8 }} type={'number'} InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                        ),
                    }} />
                    <Btn className="Repairbtnss" type="primary" onClick={() => {
                        savedatafirebase()
                    }
                    }>
                        Save
                    </Btn>
                </div>
            </div>
            <button onClick={savedata}>Save Data</button>
            {/* <SheetJSApp setgetdatas={setgetdatas} setgetdata={setgetdata} />
            <SheetJSApp2 setgetdatas={setgetdatas2} setgetdata={setgetdata2} /> */}
            <Divider style={{ marginBottom: '0.5em' }} />
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {edit ?
                            <Edit callback={callback} classes={classes} {...settingsobj} />
                            : <> </>
                            // : <Display {...settingsobj} />
                        }
                    </Grid>
                </Grid>
            </Paper>

        </>
    )
    else return <></>
}