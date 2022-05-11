import React, { useState, useEffect } from 'react'
import { DatePicker, Select, Button, notification, Modal, Input, Radio } from 'antd';
import { EditOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import firebase from '../config/firebase'
import { useRouter } from "next/router";
import moment from 'moment';

const NewRepair = ({ newdata }) => {
    const dateFormatList = 'MM/DD/YYYY'
    const [vehicle, setvehicle] = useState('' || newdata?.vehiclenumber)
    const [milage, setmilage] = useState('' || newdata?.milage)
    const [date, setdate] = useState(newdata === undefined ? new Date().toLocaleDateString() : new Date(newdata?.repairdate?.seconds * 1000).toLocaleDateString())
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [orderparts, setorderparts] = useState('' || newdata?.parts)
    const [getvehicle, setgetvehicle] = useState('')
    const [getrepair, setgetrepair] = useState('')
    const [id, setid] = useState('')
    const [getrepairnotes, setgetrepairnotes] = useState('' || newdata?.repairnotes)
    const [newVal, setnewVal] = useState('' || newdata?.Repair)
    const [addrepair, setaddrepair] = useState('')
    const [values, setValues] = useState(newdata?.status ? newdata?.status : "pending");
    const [vehiclea, setvehiclea] = useState({
        licence: '',
        vin: '',
        milage: '',
        modal: '',
        make: '',
        year: '',
        color: ''
    })
    const vehicleHanler = (e) => {
        const value = e.target.value;
        setvehiclea({
            ...vehiclea,
            [e.target.name]: value
        });
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [isModalVisible4, setIsModalVisible4] = useState(false);
    const [vehicleType, setvehicleType] = useState('' || newdata?.vehicleType)
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const openModel = (e) => {
        setIsModalVisible(true);
    }
    const openModel2 = (e) => {
        setIsModalVisible2(true);
    }
    const openModel3 = (e) => {
        setIsModalVisible3(true);
    }
    const onChanges = e => {
        setValues(e.target.value);
    };
    const openModel4 = (e) => {
        setid(e)
        setIsModalVisible4(true);
    }
    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };

    const handleCancel3 = () => {
        setIsModalVisible3(false);
    };
    const handleCancel4 = () => {
        setIsModalVisible4(false);
    };

    const { Option } = Select;
    function handleChange(value) {
        setnewVal(value)
    }
    const openNotification = placement => {
        notification.success({
            message: `Notification`,
            description:
                'You have added new Repair successfully!',
            placement,
        });
    };
    const openNotification2 = placement => {
        notification.success({
            message: `Notification`,
            description:
                'You have added new Vehicle successfully!',
            placement,
        });
    };

    const getveficles = () => {
        firebase
            .firestore()
            .collection("EQP")
            .get()
            .then((querySnapshot) => {
                var customersCol = [];
                querySnapshot.forEach((doc) => {
                    customersCol.push(doc.data());
                });
                setgetvehicle(customersCol);
            });
    };
    useEffect(getveficles, []);
    const Repair = () => {
        firebase
            .firestore()
            .collection("RepairRecord")
            .get()
            .then((querySnapshot) => {
                var customersCol = [];
                querySnapshot.forEach((doc) => {
                    customersCol.push(doc.data());
                });
                setgetrepair(customersCol);
            });
    };
    useEffect(Repair, []);
    const getvehicleinnfo = getvehicle && getvehicle?.filter(e => e.vinNumber == vehicle ? true : false)
    const validateForm3 = () => {
        if (vehicle !== undefined && date != undefined, newVal != undefined) {
            setLoading(true)
            const id = `${Math.random() * Math.random() * 6}`
            const newdate = date === new Date().toLocaleDateString() ? new Date() : date
            const repairnotess = getrepairnotes == undefined ? null : getrepairnotes
            const mileages = milage == undefined ? null : milage
            const orderpartss = orderparts == undefined ? null : orderparts
            const customer = { id, vehicleType: vehicleType, repairdate: newdate, notes: [], repairnotes: repairnotess, status: values, partsneeded: "partsneeded", vehicle: getvehicleinnfo[0], createdDate: new Date(), vehiclenumber: vehicle, Repair: newVal, parts: orderpartss, milage: mileages }
            firebase.firestore().collection('Repairs').doc(id).set(customer).then(
                () => {
                    openNotification('bottomRight')
                    setLoading(false)
                    router.push('/mechanic_dashboard')
                }
            ).catch((err) => console.log(err))
        } else {
            console.log("error ")
        }
    }
    const validateForm4 = (id) => {
        if (vehicle !== undefined && date != undefined && newVal != undefined) {
            setLoading(true)
            const newdatas = date == new Date().toLocaleDateString() ? new Date() : date
            const customer = {
                id,
                repairdate: newdatas,
                notes: newdata.notes,
                repairnotes: getrepairnotes,
                status: values,
                partsneeded: "partsneeded",
                vehicle: getvehicleinnfo[0],
                createdDate: newdata.createdDate,
                vehiclenumber: vehicle,
                Repair: newVal,
                parts: orderparts,
                milage: milage
            }
            firebase.firestore().collection('Repairs').doc(id).set(customer).then(
                () => {
                    openNotification('bottomRight')
                    setLoading(false)
                    router.push('/mechanic_dashboard')
                }
            ).catch((err) => console.log(err))
        } else {
            console.log("error ")
        }

    }

    const validateForm = () => {
        if (vehiclea.vin != '' && vehiclea.year != '' && vehiclea.make != '' && vehiclea.color != '' && vehiclea.modal != '') {
            const id = `${Math.random() * Math.random() * 6} `
            const customer = { id, data: new Date(), licence: vehiclea.licence == '' ? null : vehiclea.licence, make: vehiclea.make, vinNumber: vehiclea.vin, year: vehiclea.year, color: vehiclea.color, modle: vehiclea.modal, milage: vehiclea.milage == '' ? null : vehiclea.milage }
            firebase.firestore().collection('EQP').doc(id).set(customer).then(
                () => {
                    getveficles()
                    openNotification2('bottomRight')
                    setvehiclea({
                        licence: '',
                        unit: '',
                        vin: '',
                        milage: '',
                        modal: '',
                        make: '',
                        year: '',
                        color: ''
                    })
                    setIsModalVisible(false);
                }
            ).catch(() => console.log('errorsss'))
        } else {
            console.log("error ")
        }
    }
    const validateForm2 = () => {
        if (addrepair != '') {
            const id = `${Math.random() * Math.random() * 6}`
            const customer = { data: new Date(), RepairRecord: addrepair, id }
            firebase.firestore().collection('RepairRecord').doc(id).set(customer).then(
                () => {
                    Repair()
                    openNotification('bottomRight')
                    setaddrepair('')
                    setIsModalVisible2(false);
                }
            ).catch(() => console.log('errorsss'))
        } else {
            console.log("error ")
        }
    }
    const filters = getvehicle && getvehicle?.filter(el => el.vinNumber == vehicle && true)
    const { TextArea } = Input;
    const onChangeHandler = (e) => {
        setid({
            ...id, [e.target.name]: e.target.value
        })
    }
    const openNotificationa = placement => {
        notification.success({
            message: `Notification`,
            description:
                'You have Edit Repair Record successfully!',
            placement,
        });
    };
    const openNotificationas = placement => {
        notification.success({
            message: `Notification`,
            description:
                'You have Delete Repair Record successfully!',
            placement,
        });
    };

    const updaterepairRecord = () => {
        if (id != '') {
            firebase.firestore().collection('RepairRecord').doc(id.id).set(id).then(
                () => {
                    openNotificationa('bottomRight')
                    Repair()
                    setIsModalVisible4(false)
                }
            ).catch((err) => console.log(err))
        } else {
            console.log("error ")
        }
    }
    const deleterepairRecord = (id) => {
        firebase.firestore().collection('RepairRecord').doc(id).delete().then(
            () => {
                openNotificationas('bottomRight')
                Repair()
                setIsModalVisible4(false)
            }
        ).catch((err) => console.log(err))
    }
    const newvehicleGet = getvehicle && getvehicle?.filter(el => el.type == vehicleType ? true : false)
    return (
        <div className="repairbox">
            <h1 style={{ color: "#3d4052", textAlign: 'center', fontWeight: 'bold', fontStyle: 'normal' }}>New Repair</h1>
            <div className="repaircontainer">
                <p style={{ margin: '0px' }} className="para">Unit Type <span className="optional">(Required)</span></p>
                <Select value={vehicleType == undefined ? "Select Unit Type" : vehicleType} className="input" onChange={(e) => setvehicleType(e)}>
                    <Option value={"Truck"} className="option">Truck</Option>
                    <Option value={"Trailer"} className="option">Trailer</Option>
                </Select>
                <div>
                    <p style={{ margin: '0px', marginTop: '8px' }} className="para">Unit ID <span style={{ marginLeft: '20px' }} onClick={openModel}> <PlusCircleOutlined color="white" /></span><span className="optional">(Required)</span></p>
                    <Select value={vehicle == undefined ? "Select Unit ID" : vehicle} className="input" onChange={(e) => setvehicle(e)}>
                        {newvehicleGet && newvehicleGet?.sort((a, b) => new Date(b?.data?.seconds * 1000) - new Date(a?.data?.seconds * 1000))?.map((el, i) => (
                            <Option key={i} value={el.vinNumber} className="option">{el.vinNumber} {el.year} {el.make} {el.modle}</Option>
                        ))}
                    </Select>
                    {filters.length ? (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '49%' }}>
                                    <p className="para">Unit Year</p>
                                    <Input disabled style={{ color: 'white' }} value={filters[0]?.year} className="input" placeholder="Year..." type="text" />
                                </div>
                                <div style={{ width: '49%' }}>
                                    <p className="para">Unit Make</p>
                                    <Input disabled style={{ color: 'white' }} value={filters[0]?.make} className="input" placeholder="Make..." type="text" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '49%' }}>
                                    <p className="para">Unit Model</p>
                                    <Input disabled style={{ color: 'white' }} value={filters[0]?.modle} className="input" placeholder="Model..." type="text" />
                                </div>
                                <div style={{ width: '49%' }}>
                                    <p className="para">Unit Color</p>
                                    <Input disabled style={{ color: 'white' }} value={filters[0]?.color} className="input" placeholder="Color..." type="text" />
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {vehicleType != "Trailer" && (
                            <div style={{ width: '49%' }}>
                                <p className="para">Mileage<span className="optional">(Optional)</span></p>
                                <Input value={milage} onChange={(e) => setmilage(e.target.value)} className="input" placeholder="Mileage..." type="number" />
                            </div>
                        )}
                        <div style={{ width: '49%' }}>
                            <p className="para">Date</p>
                            <DatePicker defaultValue={moment(date, dateFormatList)} format={dateFormatList} className="input" onChange={e => setdate(e._d)} />
                        </div>
                    </div>
                    <div>
                        <p className="para">Choose Repair <span style={{ marginLeft: '20px', cursor: 'pointer' }} onClick={openModel2}><PlusCircleOutlined color="white" /></span> <EditOutlined onClick={openModel3} style={{ fontSize: '24px', marginLeft: '10px' }} /><span className="optional">(Required)</span></p>
                        <Select
                            mode="multiple"
                            allowClear
                            className="input2x"
                            placeholder={`Please select Vehicle Repair!`}
                            defaultValue={newVal !== '' && newVal}
                            onChange={handleChange}
                        >
                            {getrepair && getrepair?.sort((a, b) => new Date(b?.data?.seconds * 1000) - new Date(a?.data?.seconds * 1000))?.map((el, i) => (
                                <Option key={i} value={el.RepairRecord}>{el.RepairRecord}</Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <p className="para">Repair Notes <span className="optional">(Optional)</span></p>
                        <TextArea value={getrepairnotes} onChange={(e) => setgetrepairnotes(e.target.value)} className="input" placeholder="Repair Notes..." autoSize />
                    </div>
                    <div>
                        <p className="para">Order Parts<span className="optional">(Optional)</span></p>
                        <TextArea value={orderparts} onChange={(e) => setorderparts(e.target.value)} className="input" placeholder="Parts to Order" autoSize />
                    </div>
                    <div style={{ paddingTop: '10px' }}>
                        <Radio.Group onChange={onChanges} value={values}>
                            <Radio value={"pending"}>Mark as Pending</Radio>
                            <Radio value={"done"}>Mark as Completed</Radio>
                        </Radio.Group>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '49%' }}>
                            <Button onClick={() => router.push('/mechanic_dashboard')} className="Repairbtnss">Cancel</Button>
                        </div>
                        <div style={{ width: '49%' }}>
                            <Button className="Repairbtnss" type="primary" onClick={() => {
                                if (newdata != undefined) {
                                    validateForm4(newdata.id)
                                } else {
                                    validateForm3()
                                }
                            }
                            } loading={loading}>
                                Save Repair
                    </Button>
                        </div>
                    </div>

                </div>
            </div>
            <Modal title={"Repair Records"} visible={isModalVisible3} okText={"Save Repair"} onOk={validateForm2} onCancel={handleCancel3}>
                <div className="repairrecod">
                    {getrepair.length && getrepair?.sort((a, b) => new Date(b?.data?.seconds * 1000) - new Date(a?.data?.seconds * 1000))?.map(el => (
                        <div className="ususw">
                            <div>
                                <p style={{ margin: '0px', color: 'whitesmoke', padding: '9px 20px' }}>{el.RepairRecord}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0px', color: 'white', padding: '8px 20px' }}><EditOutlined onClick={() => openModel4(el)} style={{ fontSize: '24px', marginLeft: '10px' }} /><DeleteOutlined onClick={() => deleterepairRecord(el.id)} style={{ fontSize: '24px', cursor: 'pointer', marginLeft: '10px' }} /></p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
            <Modal title={"Edit Repair Record"} visible={isModalVisible4} okText={"Save"} onOk={updaterepairRecord} onCancel={handleCancel4}>
                <Input name="RepairRecord" value={id.RepairRecord} onChange={(e) => onChangeHandler(e)} className="input" placeholder="Add Repair...." type="text" />
            </Modal>





            <Modal title={"Add Repair"} visible={isModalVisible2} okText={"Save Repair"} onOk={validateForm2} onCancel={handleCancel2}>
                <Input value={addrepair} onChange={(e) => setaddrepair(e.target.value)} className="input" placeholder="Add Repair...." type="text" />
            </Modal>
            <Modal title="Add New Vehicle" visible={isModalVisible} okText={"Save"} onOk={validateForm} onCancel={handleCancel}>
                <p style={{ margin: '0px' }} className="para">Unit ID<span className="optional">(Required)</span></p>
                <Input name="vin" value={vehiclea.vin} onChange={(e) => vehicleHanler(e)} className="input" placeholder="Unit ID...." type="text" />
                <p className="para">License Plate <span className="optional">(Optional)</span></p>
                <Input name="licence" value={vehiclea.licence} onChange={(e) => vehicleHanler(e)} className="input" placeholder="License Plate...." type="text" />
                <p className="para">Mileage <span className="optional">(Optional)</span></p>
                <Input name="milage" value={vehiclea.milage} onChange={(e) => vehicleHanler(e)} className="input" placeholder="Mileage...." type="number" />
                <p className="para">Year<span className="optional">(Required)</span></p>
                <Input name="year" value={vehiclea.year} onChange={(e) => vehicleHanler(e)} className="input" placeholder="Year...." type="text" />
                <p className="para">Make<span className="optional">(Required)</span></p>
                <Input name="make" value={vehiclea.make} onChange={(e) => vehicleHanler(e)} className="input" placeholder="Make...." type="text" />
                <p className="para">Model<span className="optional">(Required)</span></p>
                <Input name="modal" value={vehiclea.modal} onChange={(e) => vehicleHanler(e)} className="input" placeholder="Model ...." type="text" />
                <p className="para">Color<span className="optional">(Required)</span></p>
                <Input name="color" value={vehiclea.color} onChange={(e) => vehicleHanler(e)} className="input" placeholder="Color...." type="text" />
            </Modal>
        </div>
    )
}
export default NewRepair