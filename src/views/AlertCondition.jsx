import React from 'react';
import AlertSymbol from "./AlertSymbol.jsx";

export default class AlertCondition extends React.Component {

    renderSymbols(symbols) {
        return <li>
            {
                symbols.map((symbol, index) => {
                    return <div style={{display: 'inline'}}>
                        <AlertSymbol className="item" key={symbol} symbol={symbol}/>
                        {(index === symbols.length - 1) ? <span tabIndex="0" className="ui mini button">Add</span> : ''}
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
