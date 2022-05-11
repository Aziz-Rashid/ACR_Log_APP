import React, { useState } from 'react'
import { Input, Select, Button, notification } from 'antd'
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { auth } from '../config/firebase'
import firebase from '../config/firebase'
import PhoneInput from 'react-phone-input-2'
import { useRouter } from "next/router";
const Signup = () => {
    const router = useRouter();
    const [togle, settogle] = useState(false)
    const [phones, setphone] = useState()
    const [details, setDetails] = useState({
        name: "",
        password: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    })
    const [accesslevel, setaccesslevel] = useState('')
    const Option = Select.Option
    const handler = (e) => {
        const value = e.target.value;
        setDetails({
            ...details,
            [e.target.name]: value
        });
    }
    const openNotification = placement => {
        notification.success({
            message: `Notification`,
            description:
                'Mechanic Successfully Added Thank you!',
            placement,
        });
    };
    const submitHandler = () => {
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (accesslevel === "Mechanic") {
            if (details.email.match(mailformat)) {
                if (details.name !== "" && phones !== "" && details.email !== "") {
                    settogle(true)
                    const customer = { verified: true, name: details.name, phone: `+${phones}`, email: details.email, accessLevel: accesslevel }
                    firebase.firestore().collection('mechanics').doc(`+${phones}`).set(customer).then(
                        (data) => {
                            openNotification('bottomRight')
                            setDetails({
                                name: "",
                                password: "",
                                email: "",
                                address: "",
                                city: "",
                                state: "",
                                zip: "",
                            })
                            setphone()
                            settogle(false)
                        }
                    ).catch((err) => settogle(false))
                } else {
                    alert("Please fill All fields to signup")
                    settogle(false)
                }
            } else {
                alert("Email Adrress Formate is Rong")
                settogle(false)
            }
        }

        // this is Signup Fuction for Driver /////

        if (accesslevel === "Sales") {
            if (details.email.match(mailformat)) {
                if (details.name !== "" && phones !== "" ) {
                    settogle(true)
                    const customer = { verified: true, username: details.name, name: details.name, phoneNo: phones, email: details.email, password: details.password, accessLevel: accesslevel, approve: true }
                    firebase.firestore().collection('sales').doc(details.name).set(customer).then(
                        (data) => {
                            settogle(true)
                            auth.createUserWithEmailAndPassword(details.email, details.password).then((user) => {
                                if (user) {
                                    settogle(false)
                                    // router.replace('/')
                                    auth.signOut()
                                } else {
                                    settogle(false)
                                }
                            }).catch(err => console.log("error in user creation"))

                        }
                    ).catch((err) => console.log('error', err))
                } else {
                    alert("Please fill All fields to signup")
                    settogle(false)
                }

            } else {
                alert("Email Adrress Formate is Rong")
            }
        }



        if (accesslevel === "Driver") {
            if (details.email.match(mailformat)) {
                if (details.name !== "" && phones !== "") {
                    settogle(true)
                    const customer = { verified: true, username: details.name, name: details.name, history: [], phoneNo: phones, email: details.email.toLocaleLowerCase(), password: details.password, accessLevel: accesslevel, approve: true }
                    firebase.firestore().collection('drivers').doc(details.name).set(customer).then(
                        (data) => {
                            settogle(true)
                            auth.createUserWithEmailAndPassword(details.email.toLocaleLowerCase(), details.password).then((user) => {
                                if (user) {
                                    settogle(false)
                                    // router.replace('/')
                                    auth.signOut()
                                } else {
                                    settogle(false)
                                }
                            }).catch(err => console.log("error in user creation"))

                        }
                    ).catch((err) => console.log('error', err))
                } else {
                    alert("Please fill All fields to signup")
                    settogle(false)
                }

            } else {
                alert("Email Adrress Formate is Rong")
            }
        }

        ///// Dispatcher Signup ////

        if (accesslevel === "Dispatcher") {
            if (details.email.match(mailformat)) {
                if (details.name !== "" && phones !== "") {
                    settogle(true)
                    const customer = { verified: true, username: details.name, name: details.name, history: [], phoneNo: phones, email: details.email, password: details.password, accessLevel: accesslevel }
                    firebase.firestore().collection('dispatchers').doc(details.name).set(customer).then(
                        (data) => {
                            console.log('success', data)
                            settogle(true)
                            auth.createUserWithEmailAndPassword(details.email, details.password).then((user) => {
                                if (user) {
                                    console.log(user)
                                    // router.replace('/')
                                    auth.signOut()
                                } else {
                                    console.log('error')
                                    settogle(false)
                                }
                            }).catch(err => console.log("error in user creation"))

                        }
                    ).catch((err) => settogle(false))
                } else {
                    alert("Please fill All fields to signup")
                    settogle(false)
                }

            } else {
                alert("Email Adrress Formate is Rong")
            }
        }
    }
    return (
        <div style={{ width: '100%' }}>
            <div className="box">
                <div className="box2">
                    <h1 style={{ width: '100%', textAlign: 'center', color: '#3d4052' }}>Sign Up</h1>
                    <p className="y">Access Level</p>
                    <Select className="inpp" style={{ width: '100%', marginBottom: '10px' }} defaultValue="Select your Access Level" onChange={(e) => setaccesslevel(e)}>
                        <Option key="Dispatcher">Dispatcher</Option>
                        <Option key="Driver">Driver</Option>
                        <Option key="Mechanic">Mechanic</Option>
                        <Option key="Sales">Sales</Option>
                    </Select>
                    <p className="y">Full Name</p>
                    <Input required className="inpp aw" placeholder="Enter Your Username" name="name" value={details.name} onChange={(e) => handler(e)} suffix={<UserOutlined />} />
                    <p className="y">Email</p>
                    <Input className="inpp aw" placeholder="Enter Your Email" name="email" value={details.email} onChange={(e) => handler(e)} suffix={<MailOutlined />} />
                    <p className="y">Phone Number</p>
                    <PhoneInput
                        country={'us'}
                        value={phones}
                        style={{ marginBottom: '20px', width: '100%' }}
                        onChange={phone => setphone(phone)}
                    />
                    {accesslevel !== "Broker" && accesslevel !== "Mechanic" && (
                        <>
                            <p className="y">Password</p>
                            <Input.Password className="inpp aw" placeholder="Enter Your Password" name="password" value={details.password} onChange={(e) => handler(e)} iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                        </>
                    )}
                    <Button onClick={submitHandler} loading={togle} className="Repairbtnss" type="primary">Signup {accesslevel}</Button>
                </div>
            </div>
        </div>
    )
}
export default Signup