import React, { useState } from "react";
import firebase from "../../config/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Input } from 'antd';

export default function Mechanics() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editCutomer, seteditCutomer] = useState('')
    const { confirm } = Modal
    const [dispatcher, loading, error] = useCollectionData(
        firebase.firestore().collection("mechanics")
    );

    const deleteCallback = (id) => {
        firebase
            .firestore()
            .collection("mechanics")
            .doc(id)
            .delete()
            .then(() => {
                console.log('delete')
            });
    };
    const saveEdituser = () => {
        if(editCutomer != ''){
            firebase
                .firestore()
                .collection("mechanics")
                .doc(editCutomer.phone)
                .set(editCutomer)
                .then(() => {
                    setIsModalVisible(false);
                    seteditCutomer('')
                    console.log('Saved')
                });
        }
    };
    function showConfirm(id) {
        confirm({
            title: `Do you Want to delete ${id} Mechanic ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteCallback(id);
            },
            onCancel() {
                console.log('Cancel');
            },
            okText: "Yes",
            cancelText: "No"
        });
    }
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Edit', dataIndex: 'edit', key: 'edit' },
        { title: 'Delete', dataIndex: 'delete', key: 'delete' },
    ];
    const data = dispatcher && dispatcher.map(el => {
        return {
            name: el.name,
            phone: `${el.phone}`,
            edit: <Button onClick={() => {
                seteditCutomer(el)
                setIsModalVisible(true)
            }} type="ghost">Edit</Button>,
            delete: <Button onClick={() => {
                showConfirm(el.phone)
            }} type="primary">Delete</Button>
        }
    })
    const handleCancel = () => {
        setIsModalVisible(false);
    };
   
    const onChangeHangler2 = (e) => {
        seteditCutomer({
            ...editCutomer,
            [e.target.name]: e.target.value
        })
    }

    return (
        <React.Fragment>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
            />
            <Modal title="Edit User" visible={isModalVisible} onOk={saveEdituser} onCancel={handleCancel}>
                <p style={{ margin: '0px' }} className="para">Name<span className="optional">(Required)</span></p>
                <Input name="name"  value={editCutomer.name} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Name...." type="text" />
                <p className="para">Phone <span className="optional">(Disabled)</span></p>
                <Input name="phone" disabled value={editCutomer.phone} onChange={(e) => onChangeHangler2(e)} className="input" placeholder="Email...." type="email" />
            </Modal>
        </React.Fragment>
    );
}
