import React from 'react';
import ConditionSymbol from "./ConditionSymbol.jsx";

export default class AlertCondition extends React.Component {

    renderSymbols(symbols) {
        return <li>
            {
                symbols.map((symbol, symbolIndex) => {
                    return <div key={symbolIndex} style={{display: 'inline'}}>
                        <ConditionSymbol
                            className="item"
                            key={symbolIndex}
                            id={symbolIndex}
                            conditionId={this.props.id}
                            alertId={this.props.alertId}
                            symbol={symbol}
                            onChange={this.props.onSymbolChange}
                        />
                        {(symbolIndex === symbols.length - 1) ?
                            <span className="ui simple icon dropdown button">
                                <i className="ui add icon"/>
                                <div className="menu">
                                    <div className="header">Add Symbol</div>
                                    <div onClick={() => this.props.onAddNewSymbolClick(this.props.alertId, this.props.id, 'product')} className="item">Product</div>
                                    <div onClick={() => this.props.onAddNewSymbolClick(this.props.alertId, this.props.id, 'comparison')} className="item">Comparison</div>
                                    <div onClick={() => this.props.onAddNewSymbolClick(this.props.alertId, this.props.id, 'number')} className="item">Number</div>
                                </div>
                            </span>
                            : ''}
                    </div>

                })
            }
        </li>;
    }

    render() {
        return (
            <ul>
                {this.renderSymbols(this.props.condition.symbols)}
            </ul>
        );
    }
}
