import React from 'react';
import axios from 'axios';
import Header from "./Header.jsx";
import UserArea from "./UserArea.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import GridSegment from "./GridSegment.jsx";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                email: null,
            },
            content: 'login',
            hasPendingAlertsChanges: false,
            hasPendingUpdatesChanges: false,
            hasPendingSettingsChanges: false
        };

        // --- Dashboard component construction
        this.componentWillMount = this.componentWillMount.bind(this);
        this.populateUser = this.populateUser.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getContent = this.getContent.bind(this);

        // --- Login / Signup forms switching
        this.handleSignUpClick = this.handleSignUpClick.bind(this);
        this.handleLogInClick = this.handleLogInClick.bind(this);

        // --- Update creation, fields change & button click handlers
        this.handleUpdateMinuteChange = this.handleUpdateMinuteChange.bind(this);
        this.handleUpdateHourChange = this.handleUpdateHourChange.bind(this);
        this.handleUpdateProductChange = this.handleUpdateProductChange.bind(this);
        this.handleUpdateNameChange = this.handleUpdateNameChange.bind(this);
        this.handleUpdateDescriptionChange = this.handleUpdateDescriptionChange.bind(this);

        this.handleSaveUpdatesClick = this.handleSaveUpdatesClick.bind(this);
        this.handleAddNewUpdateClick = this.handleAddNewUpdateClick.bind(this);
        this.handleDeleteUpdateClick = this.handleDeleteUpdateClick.bind(this);
        this.handleToggleUpdateActiveClick = this.handleToggleUpdateActiveClick.bind(this);
    }

    handleUpdateNameChange(event, selected) {
        const state = this.state;
        state.user.updates.forEach((update) => {
            if (update.id === selected.id) {
                update.name = event.target.value
            }
        });
        state.hasPendingUpdatesChanges = true;
        this.setState(state);
    }

    handleUpdateDescriptionChange(event, selected) {
        const state = this.state;
        state.user.updates.forEach((update) => {
            if (update.id === selected.id) {
                update.description = event.target.value
            }
        });
        state.hasPendingUpdatesChanges = true;
        this.setState(state);
    }

    handleAddNewUpdateClick() {
        const state = this.state;
        state.user.updates.push(
            {
                id: new Date().getTime(),   // unix time is a convenient id, no specific relevance here
                active: true,
                product: '',
                name: '',
                description: '',
                time: { hour: 0, minutes: 0}
            }
        );

        state.hasPendingUpdatesChanges = true;
        this.setState(state);
    }

    handleDeleteUpdateClick(selected) {
        const state = this.state;
        state.user.updates = state.user.updates.filter((update) => update.id !== selected.id );

        state.hasPendingUpdatesChanges = true;
        this.setState(state);
    }

    handleToggleUpdateActiveClick(selected) {
        const state = this.state;
        state.user.updates.forEach((update) => {
            if (update.id === selected.id)
                update.active = !update.active;
        });

        state.hasPendingUpdatesChanges = true;
        this.setState(state);
    }

    handleUpdateMinuteChange(event, selected) {
        const state = this.state;
        state.user.updates.forEach((update) => {
            if (update.id === selected.id) {
                update.time.minutes = event.target.value
            }
        });

        state.hasPendingUpdatesChanges = true;
        this.setState(state);
    }

    handleUpdateHourChange(event, selected) {
        const state = this.state;
        state.user.updates.forEach((update) => {
            if (update.id === selected.id)
                update.time.hour = event.target.value
        });

        state.hasPendingUpdatesChanges = true;
        this.setState(state);
    }

    handleUpdateProductChange(event, selected) {
        const state = this.state;
        state.user.updates.forEach((update) => {
            if (update.id === selected.id)
                update.product = event.target.value
        });

        state.hasPendingUpdatesChanges = true;
        this.setState(state);
    }

    handleSaveUpdatesClick() {
        console.log('updates changes saved');
        axios.post('calerts/api/dashboard/updates/save', this.state.user.updates)
            .then((res) => {
                console.log(res);   // todo success message
            });
        const state = this.state;
        state.hasPendingUpdatesChanges = false;
        this.setState(state);
    }

    handleSignUpClick() {
        const state = this.state;
        state.content = 'signup';
        this.setState(state);
    }

    handleLogInClick() {
        const state = this.state;
        state.content = 'login';
        this.setState(state);
    }

    getContent() {
        if (this.state.user.email === null) {
            switch (this.state.content) {
                case 'login':
                    return <GridSegment>
                        <Login onSignUpClick={this.handleSignUpClick}/>
                    </GridSegment>;
                case 'signup':
                    return <GridSegment>
                        <SignUp onLogInClick={this.handleLogInClick}/>
                    </GridSegment>;
            }
        }
        return <UserArea
            user={this.state.user}
            hasPendingUpdatesChanges={this.state.hasPendingUpdatesChanges}
            hasPendingAlertsChanges={this.state.hasPendingAlertsChanges}
            hasPendingSettingsChanges={this.state.hasPendingSettingsChanges}
            onSaveUpdatesClick={this.handleSaveUpdatesClick}
            onAddNewUpdateClick={this.handleAddNewUpdateClick}
            onDeleteUpdateClick={this.handleDeleteUpdateClick}
            onToggleUpdateActiveClick={this.handleToggleUpdateActiveClick}
            onUpdateHourChange={this.handleUpdateHourChange}
            onUpdateMinuteChange={this.handleUpdateMinuteChange}
            onUpdateProductChange={this.handleUpdateProductChange}
            onUpdateNameChange={this.handleUpdateNameChange}
            onUpdateDescriptionChange={this.handleUpdateDescriptionChange}
        />;
    }

    getHeader() {
        if (this.state.user === null) {
            return <Header/>;
        }
        return <Header userEmail={this.state.user.email}/>;
    }

    populateUser() {
        axios.post('/calerts/api/session').then((res) => {
            const state = this.state;
            state.user = {
                    email: res.data.email,
                    alerts: res.data.alerts,
                    updates: res.data.updates,
                    settings: res.data.settings
                };
            this.setState(state);
        }).catch((err) => {
            console.log('Session GET error: ' + err);
        })
    }

    componentWillMount() {
        this.populateUser();
    }

    render() {
        return (
            <div>
                {this.getHeader()}
                {this.getContent()}
            </div>
        );
    }
}
