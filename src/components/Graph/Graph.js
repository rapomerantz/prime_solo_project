/* //Samples per TIME division:
//1 min - 6
//5 min - 30
//10 min - 60
//1 hr - 360
//2 hr - 720
//6 hr - 2160
//12 hr - 4320
//24 hr - 8640 */


import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { Button, Card, Menu, MenuItem, Switch, FormControlLabel } from 'material-ui';
import './Graph.css'
import moment from 'moment'
import Chart from './Chart.js'

var LineChart = require("react-chartjs").Line;


//connect to redux
const mapStateToProps = state => ({
    state
});

class Graph extends Component {
    constructor(props) {
      super(props) 
      this.timer = null;
      this.state = {
        selectedDevice: '3a0027001647343339383037',
        timeSelection: 6,
        switch: true,
      };
    }

//fetch user info
  componentDidMount() {
    this.props.dispatch({type: USER_ACTIONS.FETCH_USER});
    this.fetchDevices();
    this.fetchSpl(); 
    this.timer = setInterval(this.tick, 2500);  //<-- setting interval for reset timer (2.5 seconds)
  }
//check user - boot unauthorized user
  componentDidUpdate() {
    if (!this.props.state.user.isLoading && this.props.state.user.userName === null) {
      this.props.history.push('home');
    }
  }

//function to run every 2.5 seconds (update spl) IF switch is on
tick = () => {
  if (this.state.switch) {
    this.fetchSpl(); 
  }
}

//GET devices from db
fetchDevices = () => {
  console.log('fetching devices');
  this.props.dispatch({
    type: 'FETCH_DEVICES'
  });
}

//GET most recent SPL data from db
fetchSpl = () => {
  console.log('in fetchSpl');
  this.props.dispatch({
    type:'FETCH_SPL',
    payload: {
      quantity: this.state.timeSelection,
      selectedDevice: this.state.selectedDevice
    }
  })
}

//set query parameter in FETCHSPL to controll amout of data to be shown in chart
handleTimeSelect = (event) => {
  console.log('select time value: ',event.target.value);
  this.setState({
    timeSelection: event.target.value
  });    
  this.fetchSpl(); 
}

//switch toggles auto update 
handleSwitch = name => event => {
  this.setState({ [name]: event.target.checked });  
};

//START Menu handlers
  closeDeviceMenu = () => {
    this.setState({ anchorElDevice: null });
  };
  openDeviceMenu = event => {
    this.setState({ anchorElDevice: event.currentTarget });
  };
  closeTimeMenu = () => {
    this.setState({ anchorElTime: null });
  };
  openTimeMenu = event => {
    this.setState({ anchorElTime: event.currentTarget });
  };
//END Menu handlers

  render() {
    // const { anchorElDevice } = this.state;
    // const { anchorElTime } = this.state;



    return (
      <div>
        <Nav />
        <div id="graphContainer">
          <h1>Graph</h1>

{/* start UI menus */}
          {/* <Menu id="deviceSelect"
                anchorEl = {anchorElDevice}
                open={Boolean(anchorElDevice)}
                onClose={this.closeDeviceMenu}>
              <MenuItem onClick={this.closeDeviceMenu}>Device</MenuItem>
              <MenuItem onClick={this.closeDeviceMenu}>Device</MenuItem>
              <MenuItem onClick={this.closeDeviceMenu}>Device</MenuItem>
          </Menu>
          <Menu id="timeSelect"
                anchorEl = {anchorElTime}
                open={Boolean(anchorElTime)}
                onClose={this.closeTimeMenu}>
              <MenuItem onClick={this.closeTimeMenu}>Time</MenuItem>
              <MenuItem onClick={this.closeTimeMenu}>Time</MenuItem>
              <MenuItem onClick={this.closeTimeMenu}>Time</MenuItem>
          </Menu> */}
{/* end UI menus */}

          <pre>{JSON.stringify(this.state)}</pre>

          <Card id="graphContent">
            {/* Anchor Element for Menu */}
            {/* <Button variant="raised" color="primary" className="buttonWire" onClick={this.openDeviceMenu}> Select Device </Button>
            <Button variant="raised" color="primary" className="buttonWire" onClick={this.openTimeMenu}> Select Timeframe </Button> */}

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.switch}
                  onChange={this.handleSwitch('switch')}
                  value="switch"
                />
              }
              label="<- Auto Update"
              />

            <select onChange={this.handleTimeSelect}>
              <option value="6">1 Minute</option>
              <option value="12">2 Minutes</option>
              <option value="30">5 Minutes</option>
              <option value="60">10 Minutes</option>
              <option value="360">1 Hour</option>
            </select>
              

            <div className="graphWire">
              <Chart/>  
            </div>

            <div className="warningWire"></div>

            <Button variant="raised" color="primary" className="buttonWire">See Instant</Button>
          </Card>

        </div>
      </div>
    );
  }
}

// allows us to use <App /> in index.js
export default connect(mapStateToProps)(Graph);
