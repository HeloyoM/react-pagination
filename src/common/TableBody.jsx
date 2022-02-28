import React, { Component } from 'react';
import _ from "lodash";

class TableBody extends Component {
    renderCell = (item, col) => {
        if (col.content) {
            return col.content(item)
        } else {
            return _.get(item, col.path)
        }
    }

    createKey = (item, col) => {
        return item._id + (col.path || col.key)
    }
    render() {

        const { data, columns } = this.props;
        return (
            <tbody>
                {data.map(item =>
                    <tr key={item._id}>
                        {columns.map(col => <td key={this.createKey(item, col)}>{this.renderCell(item, col)}</td>)}
                    </tr>
                )}
            </tbody>
        );
    }
}

export default TableBody;