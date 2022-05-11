import React from 'react'
import { Table,Alert } from 'antd';

const RepairTable = ({ filterrepair }) => {
    const columns = [
        { title: 'Unit ID', dataIndex: 'Unitid', key: 'unit' },
        { title: 'Date', dataIndex: 'repairdate', key: 'repairdate' },
        { title: 'License', dataIndex: 'licence', key: 'licence' },
        { title: 'Unit Type', dataIndex: 'vtype', key: 'vtype' },
        { title: 'Unit Category', dataIndex: 'category', key: 'category' },
        { title: 'Reefer Make', dataIndex: 'reefer', key: 'reefer' },
        { title: 'Reefer Make Type', dataIndex: 'reefermaketype', key: 'reefermaketype' },
        { title: 'Vehicle Info', dataIndex: 'vinfo', key: 'vinfo' },
        { title: 'Repairs', dataIndex: 'repair', key: 'repair' },
        { title: 'Unit Mileage', dataIndex: 'Mileage', key: 'Mileage' },
        { title: 'Notes', dataIndex: 'notes', key: 'notes' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
    ];

    let data = filterrepair && filterrepair?.map(el => {
        return {
            key: Math.random() * 6 * 3,
            licence: el?.vehicle?.licence,
            vtype: el.vehicleType == undefined ? "Truck" : el.vehicleType,
            category: el.category,
            reefer: el.reefermake,
            reefermaketype: el.reefermaketype,
            Unitid: el.vehiclenumber,
            date: el.createdDate,
            repairdate: new Date(el.repairdate * 1000).toLocaleDateString(),
            vinfo: `${el?.vehicle?.year} ${el?.vehicle?.make} ${el?.vehicle?.modle} ${el?.vehicle?.color}`,
            repair: el.Repair?.map(el => `${el},`),
            Mileage: el.vehicle.milage,
            status: el.status == "done" ? "Completed" : "Pending",
            parts: el.parts,
            repairnotes: el.repairnotes,
            notes: el.notes.length ? <p style={{ color: 'blue', cursor: 'pointer' }} onClick={() => openModel2(el.id)}>View Notes</p> : null
        }
    })
    data?.sort(function (a, b) {
        return new Date(b?.date.seconds * 1000) - new Date(a?.date.seconds * 1000);
    });

    return (
        <>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender: record => {
                        return (
                            <>
                                {record.repairnotes != null ? (
                                    <>
                                        <p style={{ color: 'rebeccapurple', margin: '0px', fontSize: '18px' }}>Repair Notes</p>
                                        <p>{record.repairnotes}</p>
                                    </>
                                ) : <Alert message="Sorry no Repair Notes added for this Repair" type="warning" />}
                                {record.parts != null ? (
                                    <>
                                        <p style={{ color: 'rebeccapurple', margin: '0px', fontSize: '18px' }}>Parts Needed</p>
                                        <p>{record.parts}</p>
                                    </>
                                ) : <Alert style={{ marginTop: '10px' }} message="Sorry no Parts added For this Repair" type="warning" />}
                            </>
                        )
                    },
                    rowExpandable: record => {
                        if (record.repairnotes == null && record.parts == null) {
                            return false
                        } else {
                            return true
                        }
                    },
                }}
                dataSource={data}
                bordered={true}
            />
        </>
    )
}
export default RepairTable