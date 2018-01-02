import React from 'react';

export default class Updates extends React.Component {
    render() {
        return (
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th className="one wide"></th>
                        <th className="one wide">Product</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th className="center aligned">Hour</th>
                        <th className="center aligned">Minutes</th>
                        <th className="center aligned">Activate/Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.items.map((update) => {
                        return <tr key={JSON.stringify(update)}>
                            <td>
                                <img
                                    className="ui circular image"
                                    src={ (update.product) ? `images/${update.product.slice(0, 3).toLowerCase()}icon.png` : '' }
                                />
                            </td>
                            <td className="center aligned">
                                <select
                                    className="ui dropdown button"
                                    defaultValue={update.product}
                                    onChange={(event) => {this.props.onUpdateProductChange(event, update)} }
                                >
                                    <option value="">Product</option>
                                    <option value="BTC-USD">BTC-USD</option>
                                    <option value="BCH-USD">BCH-USD</option>
                                    <option value="LTC-USD">LTC-USD</option>
                                    <option value="ETH-USD">ETH-USD</option>
                                </select>
                            </td>
                            <td>User-defined name for this update</td>
                            <td>Even longer user-defined description please goes here tyvm</td>
                            <td>
                                <select
                                    className="ui dropdown button"
                                    defaultValue={update.time.hour}
                                    onChange={(event) => {this.props.onUpdateHourChange(event, update)} }
                                >
                                    <option value="0">00</option>
                                    <option value="1">01</option>
                                    <option value="2">02</option>
                                    <option value="3">03</option>
                                    <option value="4">04</option>
                                    <option value="5">05</option>
                                    <option value="6">06</option>
                                    <option value="7">07</option>
                                    <option value="8">08</option>
                                    <option value="9">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                </select>
                            </td>
                            <td>
                                <select
                                    className="ui dropdown button"
                                    defaultValue={update.time.minutes}
                                    onChange={(event) => {this.props.onUpdateMinuteChange(event, update)} }
                                >
                                    <option value="0">00</option>
                                    <option value="5">05</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="30">30</option>
                                    <option value="35">35</option>
                                    <option value="40">40</option>
                                    <option value="45">45</option>
                                    <option value="50">50</option>
                                    <option value="55">55</option>
                                </select>
                            </td>
                            <td>
                                <div className="ui buttons">
                                    <button
                                        className={`ui mini toggle button ${update.active ? 'active' : ''}`}
                                        onClick={() => {this.props.onToggleUpdateActiveClick(update)}}
                                    >
                                        {update.active ? 'Active' : 'Inactive'}
                                    </button>
                                    <button onClick={() => { this.props.onDeleteUpdateClick(update) }} className="negative ui button">
                                        <i className="remove icon"/>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>;
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="7" className="right aligned">
                            <button
                                onClick={this.props.onAddNewUpdateClick}
                                className="ui mini labeled icon button"
                            >
                                Add new
                                <i className="large add square icon"/>
                            </button>
                            <button
                                onClick={this.props.onSaveUpdatesClick}
                                className={`ui mini primary ${this.props.hasPendingChanges ? '' : 'disabled'} labeled icon button`}
                            >
                                Save
                                <i className="large save icon"/>
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
    }
}
