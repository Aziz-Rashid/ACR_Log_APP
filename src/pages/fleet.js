import React from 'react'
import { Table, Menu, Dropdown, Modal, Button,Radio } from 'antd';
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from '../config/firebase'
import { useRouter } from "next/router";
import { MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';



const columnsany = [
    {
        title: 'Unit ID',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: 'Unit Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Category',
        dataIndex: 'catagory',
        key: 'catagory',
    },

    {
        title: 'Reefer Make Type',
        dataIndex: 'reefermaketype',
        key: 'reefermaketype',
    },
    {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
    },
    {
        title: 'Make',
        dataIndex: 'make',
        key: 'make',
    },
    {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: 'License Plate',
        dataIndex: 'plate',
        key: 'plate',
    },
    {
        title: 'Mileage',
        dataIndex: 'mileage',
        key: 'mileage',
    },
    {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
    },
    {
        title: 'Menu',
        dataIndex: 'menu',
        key: 'menu',
    }
];

const columns = [
    {
        title: 'Unit ID',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: 'Unit Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
    },
    {
        title: 'Make',
        dataIndex: 'make',
        key: 'make',
    },
    {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: 'License Plate',
        dataIndex: 'plate',
        key: 'plate',
    },
    {
        title: 'Mileage',
        dataIndex: 'mileage',
        key: 'mileage',
    },
    {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
    },
    {
        title: 'Menu',
        dataIndex: 'menu',
        key: 'menu',
    }
];



const Fleet = () => {
    const [val, setval] = React.useState('Any')
    const [EQp, loadings, errors] = useCollectionData(
        firebase.firestore().collection("EQP")
    );
    const { confirm } = Modal;
    const router = useRouter()
    const deleteCallback = (id) => {
        firebase
            .firestore()
            .collection("EQP")
            .doc(id)
            .delete()
            .then(() => {
                console.log("workings")
            });
    };

    function showConfirm(i, id) {
        confirm({
            title: `Do you Want to delete ${id} repair ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteCallback(i);
            },
            onCancel() {
                console.log('CTrailerancel');
            },
            okText: "Yes",
            cancelText: "No"
        });
    }
    const newarr = EQp?.length && EQp.map(el => {
        if(val == "Any"){
            return {
                unit: el.vinNumber,
                date: new Date(el.data.seconds * 1000).toLocaleDateString(),
                newdate: el.data,
                color: el.color,
                type: el.type,
                make: el.make,
                catagory: el.category,
                reefermake: el.reefermake,
                reefermaketype: el.reefermaketype,
                model: el.modle,
                mileage: el.milage,
                plate: el.licence,
                year: el.year,
                menu: <Dropdown style={{ cursor: 'pointer' }} overlay={<Menu>
                    <Menu.Item key="1">
                        <p syle={{ margin: '0px' }} onClick={() => showConfirm(el.id, el.vinNumber)}>
                            Delete Unit
                        </p>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <p syle={{ margin: '0px' }} onClick={() => router.push(`/editfleet/${el.id}`)}>
                            Edit Unit
                        </p>
                    </Menu.Item>
                </Menu>} placement="bottomCenter">
                    <MoreOutlined />
                </Dropdown>
            }
        }
        if(val != 'Any' && val == el.type){
            return {
                unit: el.vinNumber,
                date: new Date(el.data.seconds * 1000).toLocaleDateString(),
                newdate: el.data,
                color: el.color,
                type: el.type,
                make: el.make,
                catagory: el.category,
                reefermaketype: el.reefermaketype,
                make: el.make,
                model: el.modle,
                mileage: el.milage,
                plate: el.licence,
                year: el.year,
                menu: <Dropdown style={{ cursor: 'pointer' }} overlay={<Menu>
                    <Menu.Item key="1">
                        <p syle={{ margin: '0px' }} onClick={() => showConfirm(el.id, el.vinNumber)}>
                            Delete Unit
                        </p>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <p syle={{ margin: '0px' }} onClick={() => router.push(`/editfleet/${el.id}`)}>
                            Edit Unit
                        </p>
                    </Menu.Item>
                </Menu>} placement="bottomCenter">
                    <MoreOutlined />
                </Dropdown>
            }
        }
    })
    newarr?.sort(function (a, b) {
        return new Date(b?.newdate.seconds * 1000) - new Date(a?.newdate.seconds * 1000);
    });
    const onChange = e => {
        setval(e.target.value);
      };
    return (
        <>
            <div className="ajawa">
                <div>
                    <h1 style={{ color: '#3d4052', fontStyle: 'normal', margin: '0px', fontWeight: 'bold' }}> Fleet</h1>
                </div>
                <div>
                    <Button onClick={() => router.push('/addfleet')} type="primary" >Add New Vehicle</Button>
                </div>
            </div>
            <span style={{paddingRight:'20px',fontWeight:'bold'}}>Filter by:</span> 
            <Radio.Group onChange={onChange} value={val}>
                <Radio value={"Any"}>Any</Radio>
                <Radio value={"Truck"}>Truck</Radio>
                <Radio value={"Trailer"}>Trailer</Radio>
            </Radio.Group>
            <div className="akak">
                {val == "Any" || val == "Trailer" ? (
                    <Table bordered={true} columns={columnsany} dataSource={newarr} loading={loadings} />
                ): <Table bordered={true} columns={columns} dataSource={newarr} loading={loadings} />}
            </div>
        </>
    )
}
export default Fleet