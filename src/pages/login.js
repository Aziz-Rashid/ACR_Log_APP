import React, { useState } from 'react'
import { Input, Space, Tooltip, notification } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined } from '@ant-design/icons';
import firebase, {auth} from '../config/firebase'
import {useRouter} from 'next/router'
import dynamic from "next/dynamic";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
const FirebaseAuth = dynamic(() => import('react-firebaseui/StyledFirebaseAuth'), {
    ssr: false,
});

export default function Login() {
    const classes = useStyles();
    const router=useRouter()
    if(router.asPath === "/admin"){
        const uiConfig = {
            // Popup signin flow rather than redirect flow.
            signInFlow: 'popup',
            // We will display Google and Facebook as auth providers.
            callbacks: {
                // Avoid redirects after sign-in.
                signInSuccessWithAuthResult: () => router.push('/')
            },
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ]
        };
        return (
            <>
                <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
            </>
        )
    }else{
        const [togle,settogle] = useState(false)
        const [details, setDetails] = useState({
            email: "",
            Password: ""
        })
        const handler = (e) => {
            const value = e.target.value;
            setDetails({
                ...details,
                [e.target.name]: value
            });
        }
        const openNotification = placement => {
            notification.success({
                message: `Login Successfully`,
                description:
                    `Login ${details.email} Successfully`,
                placement,
            });
        };
        const openNotification2 = placement => {
            notification.error({
                message: `Login Failed`,
                description:
                    `Wrong Credentials ${details.email} Contact the administrator`,
                placement,
            });
        };
        const LoginUser = (e) => {
            e.preventDefault()
            auth.signInWithEmailAndPassword(details.email, details.Password)
                .then((userCredential) => {
                    router.push('/')
                    openNotification("success")
                })
                .catch((error) => {
                    openNotification2("success")
                });
        }
        const openNotification5 = placement => {
            notification.success({
                message: `Password Reset`,
                description:
                    `Password Reset Email successfully Send to you Please check the link and Create new password`,
                placement,
            });
        };
        const resetpass = (e) => {
            e.preventDefault()
            if(details.email !== ""){
                auth.sendPasswordResetEmail(details.email)
                openNotification5('Thanks')
                settogle(false)
            }
        }
    
        return (
            <>
            {togle === false ? (
                <div>
                <div className="loginBg">
                    <div className="login_truck">
                    </div>
                    <div className="loginContainers">
                        <form className="loginBox">
                            <h2 className="loginName">Sign in</h2>
                            <Space direction="vertical" className="inputPass">
                                <p className="LoginEmailName">Email:</p>
                                <Input
                                    className="inp_Email"
                                    placeholder="Enter Your Email"
                                    value={details.email}
                                    name="email"
                                    onChange={(e) => handler(e)}
                                    suffix={
                                        <Tooltip title="Enter Your Email...">
                                            <MailOutlined style={{ color: "#C4C4C4" }} />
                                        </Tooltip>
                                    }
                                />
                                <p className="LoginEmailName">Password:</p>
                                <Input.Password
                                    className="inp_Email"
                                    value={details.Password}
                                    name="Password"
                                    onChange={(e) => handler(e)}
                                    placeholder="Enter Your Password..."
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Space>
                            <p className="forgot" ><span onClick={() => settogle(!togle)}>Forgot Password?</span></p>
                            {/* <button onClick={(e) => LoginUser(e)} className="btn">Login</button> */}
                            <div className={classes.root} style={{paddingBottom:'20px'}}>
                                <Button type="submit" variant="contained" color="primary" className="btn" onClick={(e) => LoginUser(e)}>
                                    Login
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
    
            ): (
                <div className="loginBg">
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <img className="logos" src="./logo.png" alt="logo" />
                        </div>
                        <h1 className="hed">
                            F-M
                        </h1>
                        <p className="hed_text">Freight Manager App</p>
                    </div>
                    <div className="loginContainers">
                        <form className="loginBox">
                            <h2 className="loginName">Forgot PassWord</h2>
                            <p className="forgot" ><span onClick={() => settogle(!togle)}>Login Page</span></p>
                            <Space direction="vertical" className="inputPass">
                                <p className="LoginEmailName">Email:</p>
                                <Input
                                    className="inp_Email"
                                    placeholder="Enter Your Email"
                                    value={details.email}
                                    name="email"
                                    onChange={(e) => handler(e)}
                                    suffix={
                                        <Tooltip title="Enter Your Email...">
                                            <MailOutlined style={{ color: "#C4C4C4" }} />
                                        </Tooltip>
                                    }
                                />
                            </Space>
                            <button onClick={(e) => resetpass(e)} className="btn">Reset Password</button>
                        </form>
                    </div>
                </div>
            )}
            </>
        )
    }
}
