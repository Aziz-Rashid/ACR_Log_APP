import React, { useState } from 'react'
import { Button, Select, Radio } from 'antd';
import { useRouter } from 'next/router'
import firebase from '../config/firebase'
import { notification, Input } from 'antd';

const Equipments = ({ order }) => {
    const [values, setValue] = useState(order ? order[0].category : "Dry Van");
    const [reeferMaketyp, setreeferMaketype] = useState('' || order && order[0].reefermaketype)
    const [data, setdata] = useState({
        vin: '' || order && order[0].vinNumber,
        milage: '' || order && order[0].milage,
        model: '' || order && order[0].modle,
        year: '' || order && order[0].year,
        make: '' || order && order[0].make,
        licence: '' || order && order[0].licence,
        color: '' || order && order[0].color
    })
    const onChange = e => {
        setValue(e.target.value);
    };
    const [type, settype] = useState('' || order && order[0].type)
    const [loading, setLoading] = useState(false)
    const changeHandler = (e) => {
        const value = e.target.value;
        setdata({
            ...data,
            [e.target.name]: value
        });
    }
    const openNotification = placement => {
        notification.success({
            message: `Notification`,
            description:
                'You have added new Fleet successfully!',
            placement,
        });
    };
    const openNotifications = placement => {
        notification.error({
            message: `Notification`,
            description:
                'Please fill all required Fields!',
            placement,
        });
    };
    const router = useRouter()

    const validateForm = () => {
        if (data.vin != undefined && type != undefined) {
            setLoading(true)
            const id = `${Math.random() * Math.random() * 6}`
            const customer = {
                type,
                id, data: new Date(),
                licence: data.licence == undefined ? null : data.licence == undefined ? null : data.licence,
                make: data.make == undefined ? null : data.make,
                vinNumber: data.vin, milage: data.milage == undefined ? null : data.milage,
                modle: data.model == undefined ? null : data.model,
                year: data.year == undefined ? null : data.year,
                color: data.color == undefined ? null : data.color,
                category: type == "Trailer" ? values != undefined ? values : null : null,
                reefermaketype: type == "Trailer" ? reeferMaketyp != undefined ? reeferMaketyp : null : null,
            }
            firebase.firestore().collection('EQP').doc(id).set(customer).then(
                () => {
                    openNotification('BottomRight')
                    setLoading(false)
                    router.push('/fleet')
                }
            ).catch((err) => setLoading(false))
        } else {
            openNotifications("BottomRight")
            setLoading(false)
        }
    }
    const validateForms = (id) => {
        if (data.vin != "" && data.type != "") {
            setLoading(true)
            const customer = {
                type,
                id,
                data: order ? order[0]?.data : new Date(),
                licence: data.licence,
                make: data.make,
                vinNumber: data.vin,
                milage: data.milage,
                modle: data.model,
                year: data.year,
                color: data.color,
                reefermaketype: type == "Trailer" ? reeferMaketyp : null,
                category: type == "Trailer" ? values : null,
            }
            firebase.firestore().collection('EQP').doc(id).set(customer).then(
                () => {
                    openNotification('BottomRight')
                    setLoading(false)
                    router.push('/fleet')
                }
            ).catch((err) => setLoading(false))
        } else {
            openNotifications("BottomRight")
            setLoading(false)
        }
    }
    const Option = Select.Option
    return (
        <>
            <div className="repairbox">
                <h1 style={{ color: "#3d4052", textAlign: 'center', fontWeight: 'bold', fontStyle: 'normal' }}>Add new Vehicle</h1>
                <div className="repaircontainer">
                    <div>
                        <p className="para">Unit Type <span className="optional">(Required)</span></p>
                        <Select defaultValue={type == undefined ? "Select Unit Type" : type} onChange={(e) => settype(e)}>
                            <Option value="Truck">Truck</Option>
                            <Option value="Trailer">Trailer</Option>
                        </Select>
                    </div>
                    <div>
                        <p className="para">Unit ID <span className="optional">(Required)</span></p>
                        <Input value={data.vin} name="vin" className="input" placeholder="Unit ID..." type="text" onChange={(e) => changeHandler(e)} />
                    </div>
                    {type == "Trailer" && (
                        <div style={{ width: '49%' }}>
                            <p className="para">Category<span className="optional">(Required)</span></p>
                            <Radio.Group onChange={onChange} value={values}>
                                <Radio value={"Dry Van"}>Dry Van</Radio>
                                <Radio value={"Reefer"}>Reefer</Radio>
                            </Radio.Group>
                        </div>
                    )}
                    {type != "Trailer" && (
                        <div>
                            <p className="para">Mileage <span className="optional">(Optional)</span></p>
                            <Input value={data.milage} name="milage" className="input" placeholder="Mileage..." type="number" onChange={(e) => changeHandler(e)} />
                        </div>
                    )}
                    {values == "Reefer" && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ width: '100%' }}>
                                <p className="para">Reefer Unit <span className="optional">(Required)</span></p>
                                <Select value={reeferMaketyp == undefined ? "Select Reefer Unit" : reeferMaketyp} className="input" onChange={(e) => setreeferMaketype(e)}>
                                    <Option value={"Thermo King"} className="option">Thermo King</Option>
                                    <Option value={"Carrier"} className="option">Carrier</Option>
                                </Select>
                            </div>
                        </div>
                    )}
                    <div>
                        <p className="para">Year <span className="optional">(Optional)</span></p>
                        <Input value={data.year} name="year" className="input" placeholder="Year..." type="text" onChange={(e) => changeHandler(e)} />
                    </div>
                    <div>
                        <p className="para">Make <span className="optional">(Optional)</span></p>
                        <Input value={data.make} name="make" className="input" placeholder="Make..." type="text" onChange={(e) => changeHandler(e)} />
                    </div>
                    <div>
                        <p className="para">Model <span className="optional">(Optional)</span></p>
                        <Input value={data.model} name="model" className="input" placeholder="Model..." type="text" onChange={(e) => changeHandler(e)} />
                    </div>
                    <div>
                        <p className="para">License Plate <span className="optional">(Optional)</span></p>
                        <Input value={data.licence} name="licence" className="input" placeholder="License Plate..." type="text" onChange={(e) => changeHandler(e)} />
                    </div>
                    <div>
                        <p className="para">Color <span className="optional">(Optional)</span></p>
                        <Input value={data.color} name="color" className="input" placeholder="Color..." type="text" onChange={(e) => changeHandler(e)} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '49%' }}>
                            <Button onClick={() => router.push('/fleet')} className="Repairbtnss">Cancel</Button>
                        </div>
                        <div style={{ width: '49%' }}>
                            <Button className="Repairbtnss" type="primary" loading={loading} onClick={() => {
                                if (order == undefined) {
                                    validateForm()
                                } else {
                                    validateForms(order[0].id)
                                }
                            }}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Equipments