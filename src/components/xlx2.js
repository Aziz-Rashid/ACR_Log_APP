import React, { useState } from "react";
import XLSX from "xlsx";


const SheetJSApp = ({setgetdata,setgetdatas}) => {
    const [data, setdata] = useState([])
    const [cols, setCols] = useState([])
    const handleFile = (file /*:File*/) => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = e => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            /* Update state */
            setdata(data)
            setCols(make_cols(ws["!ref"]))
            setgetdatas(data)
            setgetdata(make_cols(ws["!ref"]))
        };
        if (rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
    }
    return (
        <DragDropFile handleFile={handleFile}>
            <div className="row">
                <div className="col-xs-12">
                    <DataInput handleFile={handleFile} />
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <OutTable data={data} cols={cols} />
                </div>
            </div>
        </DragDropFile>
    )
}
export default SheetJSApp

// export default class SheetJSApp extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: [] /* Array of Arrays e.g. [["a","b"],[1,2]] */,
//             cols: [] /* Array of column objects e.g. { name: "C", K: 2 } */
//         };
//         this.handleFile = this.handleFile.bind(this);
//         this.exportFile = this.exportFile.bind(this);
//     }

//     exportFile() {
//         /* convert state to workbook */
//         const ws = XLSX.utils.aoa_to_sheet(this.state.data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
//         /* generate XLSX file and send to client */
//         XLSX.writeFile(wb, "sheetjs.xlsx");
//     }
//     render() {
//         return (
//             <DragDropFile handleFile={this.handleFile}>
//                 <div className="row">
//                     <div className="col-xs-12">
//                         <DataInput handleFile={this.handleFile} />
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-xs-12">
//                         <OutTable data={this.state.data} cols={this.state.cols} />
//                     </div>
//                 </div>
//             </DragDropFile>
//         );
//     }
// }

/* -------------------------------------------------------------------------- */

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/
class DragDropFile extends React.Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    }
    suppress(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }
    onDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        const files = evt.dataTransfer.files;
        if (files && files[0]) this.props.handleFile(files[0]);
    }
    render() {
        return (
            <div
                onDrop={this.onDrop}
                onDragEnter={this.suppress}
                onDragOver={this.suppress}
            >
                {this.props.children}
            </div>
        );
    }
}

/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/
class DataInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.props.handleFile(files[0]);
    }
    render() {
        return (
            <form className="form-inline">
                <div className="form-group">
                    <label htmlFor="file">Spreadsheet</label>
                    <input
                        type="file"
                        className="form-control"
                        id="file"
                        accept={SheetJSFT}
                        onChange={this.handleChange}
                    />
                </div>
            </form>
        );
    }
}

class OutTable extends React.Component {
    render() {
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    {/* <thead>
                        <tr>
                            {this.props.cols.map(c => (
                                <th key={c.key}>{c.name}</th>
                            ))}
                        </tr>
                    </thead> */}
                    <tbody style={{ margin: "50px" }}>
                        {this.props.data.map((r, i) => (
                            <tr key={i} style={{ padding: "20px" }}>
                                {this.props.cols.map(c => {
                                    if ([c.key] == 1 || [c.key] == 2 || [c.key] == 9 || [c.key] == 10 || [c.key] == 13 || [c.key] == 15 || [c.key] == 25) {
                                        return (
                                            <td key={c.key}>{r[c.key]}</td>
                                        )
                                    } else {
                                        return null
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

/* list of supported file types */
const SheetJSFT = [
    "xlsx",
    "xlsb",
    "xlsm",
    "xls",
    "xml",
    "csv",
    "txt",
    "ods",
    "fods",
    "uos",
    "sylk",
    "dif",
    "dbf",
    "prn",
    "qpw",
    "123",
    "wb*",
    "wq*",
    "html",
    "htm"
]
    .map(function (x) {
        return "." + x;
    })
    .join(",");

/* generate an array of column objects */
const make_cols = refstr => {
    let o = [],
        C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
    return o;
};
