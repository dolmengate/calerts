import React from 'react';
import SymbolInput from "./SymbolInput.jsx";

export default class AlertSymbol extends React.Component {
    render() {
        return (
            <SymbolInput className="item" symbol={this.props.symbol}/>
        );
    }
}