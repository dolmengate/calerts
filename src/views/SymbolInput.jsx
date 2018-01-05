import React from 'react';

export default class SymbolInput extends React.Component {
    constructor(props) {
        super(props);
        this.createInputForType = this.createInputForType.bind(this);
    }

    createInputForType(symbol) {
        switch (symbol.type) {
            case 'product':
                return <select
                    style={{padding: '5px'}}
                    className="ui compact selection dropdown"
                    defaultValue={symbol.value}
                    onChange={event => this.props.onChange(event, this.props.alertId, this.props.conditionId, this.props.id)}
                >
                    <option value='btcusd'>BTC-USD</option>
                    <option value='ltcusd'>LTC-USD</option>
                    <option value='bchusd'>BCH-USD</option>
                    <option value='ethusd'>ETH-USD</option>
                </select>;
            case 'comparison':
                return <select
                    style={{padding: '5px'}}
                    className="ui compact selection dropdown"
                    defaultValue={symbol.value}
                    onChange={event => this.props.onChange(event, this.props.alertId, this.props.conditionId, this.props.id)}
                >
                    <option value='lte'>&lt;=</option>
                    <option value='gte'>&gt;=</option>
                    <option value='lt'>&lt;</option>
                    <option value='gt'>&gt;</option>
                </select>;
            case 'number':
                return <div className="ui input">
                    <input
                        style={{width: '5em'}}
                        type="text"
                        defaultValue={symbol.value}
                        placeholder="number"
                        onChange={event => this.props.onChange(event, this.props.alertId, this.props.conditionId, this.props.id)}
                    />
                </div>;
        }
    }

    render() {
        return (
            this.createInputForType(this.props.symbol)
        );
    }
}