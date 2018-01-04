import React from 'react';

export default class SymbolInput extends React.Component {
    constructor(props) {
        super(props);
        this.createInputForType = this.createInputForType.bind(this);
    }

    createInputForType(symbol) {
        switch (symbol.type) {
            case 'products':
                return <select
                    className="ui dropdown button"
                    defaultValue={symbol.value}
                >
                    <option value='btcusd'>BTC-USD</option>
                    <option value='ltcusd'>LTC-USD</option>
                    <option value='bchusd'>BCH-USD</option>
                    <option value='ethusd'>ETH-USD</option>
                </select>;
            case 'comparison':
                return <select
                    className="ui dropdown button"
                    defaultValue={symbol.value}
                >
                    <option value='lte'>&lt;=</option>
                    <option value='gte'>&gt;=</option>
                    <option value='lt'>&lt;</option>
                    <option value='gt'>&gt;</option>
                    <option value='eq'>=</option>
                </select>;
            case 'number':
                return <div className="ui input">
                    <input
                        type="text"
                        defaultValue={symbol.value}
                        placeholder="number"
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