import React from 'react';
import SymbolInput from "./SymbolInput.jsx";

export default class ConditionSymbol extends React.Component {
    render() {
        return (
            <div style={{display: 'inline'}}>
                <SymbolInput
                    symbol={this.props.symbol}
                    onChange={this.props.onChange}
                    id={this.props.id}
                    conditionId={this.props.conditionId}
                    alertId={this.props.alertId}
                />
                <span
                    className="ui negative mini icon button"
                    onClick={() => this.props.onDeleteClick(this.props.alertId, this.props.conditionId, this.props.symbolId)}
                ><i className="ui large remove icon" /></span>
            </div>

        );
    }
}