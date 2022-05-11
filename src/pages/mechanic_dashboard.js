import React, { useState } from 'react'
import RepairTruk from '../components/mechanic/Repairtruck'
import { useRouter } from "next/router";
import { Button } from "antd";
const Mdash = () => {
    const router = useRouter()
    const [status, setstatus] = useState('pending')
  
    return (
        <>
            <div className="iaa">
                <div>
                    <h1 style={{ color: '#3d4052', fontStyle: 'normal', margin: '0px', fontWeight: 'bold' }}> Repairs {status == "pending" ? "Pending" : "Completed"}</h1>
                </div>
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '20px' }} className={status == "pending" ? "peningss" : "peningsss"} onClick={() => setstatus('pending')}>
                        <h1 style={{ margin: '0px', padding: '0px', fontSize: '20px' }}>Pending </h1>
                    </div>
                    <div className={status == "done" ? "peningss" : "peningsss"} onClick={() => setstatus('done')}>
                        <h1 style={{ margin: '0px', padding: '0px', fontSize: '20px' }}>Done </h1>
                    </div>
                </div>
                <div>
                    <Button onClick={() => router.push('/newRepair')} type="primary" >Add New Repair</Button>
                </div>
            </div>
            <div className="iaaa">
                <div className="iaia">
                    <div>
                        <h1 className="mpo"> Repairs {status == "pending" ? "Pending" : "Completed"}</h1>
                    </div>
                    <div>
                        <Button onClick={() => router.push('/newRepair')} type="primary" >Add New Repair</Button>
                    </div>
                </div>
                <div className="kak">
                    <div>
                        <div className={status == "pending" ? "peningss" : "peningsss"} onClick={() => setstatus('pending')}>
                            <h1 style={{ margin: '0px', padding: '0px', fontSize: '20px' }}>Pending</h1>
                        </div>
                    </div>
                    <div>
                        <div className={status == "done" ? "peningss" : "peningsss"} onClick={() => setstatus('done')}>
                            <h1 style={{ margin: '0px', padding: '0px', fontSize: '20px' }}>Done</h1>
                        </div>
                    </div>
                </div>
            </div>

            <RepairTruk status={status} setstatus={setstatus} />

        </>
    )
}
export default Mdash