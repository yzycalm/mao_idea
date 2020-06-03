import {DatePicker, Button} from 'antd';
import moment from 'moment';
import React, {Component} from 'react';

class DateRange extends Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
        type: ['default', 'default', 'default', 'default']
    };

    disabledStartDate = startValue => {
        const {endValue} = this.state;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = endValue => {
        const {startValue} = this.state;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
            type: ['default', 'default', 'default', 'default']
        }, () => {
            this.handleMatchBtn()
        });
    };

    onStartChange = value => {
        this.onChange('startValue', value);
    };

    onEndChange = value => {
        this.onChange('endValue', value);
    };

    handleStartOpenChange = open => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };

    handleEndOpenChange = open => {
        this.setState({endOpen: open}, () => {
            if(!open && this.state.startValue && this.state.endValue ) {
                this.props.getTimeHorizon([this.state.startValue, this.state.endValue])
            }
        });
    };

    // 选择时间匹配按钮
    handleMatchBtn() {
        // 今天
        if(this.state.endValue && this.state.startValue) {
            if (this.state.endValue.format('X') === moment('24:00:00', 'HH:mm:ss').format('X') && this.state.startValue.format('X') === moment('00:00:00', 'HH:mm:ss').format('X')) {
                this.setState({
                    type: ['primary', 'default', 'default', 'default']
                })
            }
            if (this.state.endValue.format('X') === moment('00:00:00', 'HH:mm:ss').format('X')) {
                switch (this.state.startValue.format('X')) {
                    case moment('00:00:00', 'HH:mm:ss').subtract(1, "days").format('X'):
                        // 昨天
                        this.setState({
                            type: ['default', 'primary', 'default', 'default']
                        })
                        break
                    case  moment('00:00:00', 'HH:mm:ss').subtract(7, "days").format('X'):
                        // 近七天
                        this.setState({
                            type: ['default', 'default', 'primary', 'default']
                        })
                        break
                    case moment('00:00:00', 'HH:mm:ss').subtract(30, "days").format('X'):
                        // 近三十天
                        this.setState({
                            type: ['default', 'default', 'default', 'primary']
                        })
                        break
                    default:
                        this.setState({
                            type: ['default', 'default', 'default', 'default']
                        })
                        break
                }
            }
        }
        this.props.getTimeHorizon([this.state.startValue, this.state.endValue])
    };

    handleToday() {
        this.setState({
            startValue: moment('00:00:00', 'HH:mm:ss'),
            endValue: moment('24:00:00', 'HH:mm:ss'),
            type: ['primary', 'default', 'default', 'default']
        }, () => {
            this.props.getTimeHorizon([this.state.startValue, this.state.endValue])
        })
    }

    handleYesterday() {
        this.setState({
            startValue: moment('00:00:00', 'HH:mm:ss').subtract(1, "days"),
            endValue: moment('00:00:00', 'HH:mm:ss'),
            type: ['default', 'primary', 'default', 'default']
        }, () => {
            this.props.getTimeHorizon([this.state.startValue, this.state.endValue])
        })
    }

    handleWeek() {
        this.setState({
            startValue: moment('00:00:00', 'HH:mm:ss').subtract(7, "days"),
            endValue: moment('00:00:00', 'HH:mm:ss'),
            type: ['default', 'default', 'primary', 'default']
        }, () => {
            this.props.getTimeHorizon([this.state.startValue, this.state.endValue])
        })
    }

    handleMonth() {
        this.setState({
            startValue: moment('00:00:00', 'HH:mm:ss').subtract(30, "days"),
            endValue: moment('00:00:00', 'HH:mm:ss'),
            type: ['default', 'default', 'default', 'primary']
        }, () => {
            this.props.getTimeHorizon([this.state.startValue, this.state.endValue])
        })
    }

    render() {
        const {startValue, endValue, endOpen} = this.state;
        return (
            <div>
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    showTime = {{
                        defaultValue: moment('00:00:00', 'HH:mm:ss')
                    }}
                    value={startValue}
                    placeholder="开始日期"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                />
                <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime = {{
                        defaultValue: moment('00:00:00', 'HH:mm:ss')
                    }}
                    value={endValue}
                    placeholder="结束日期"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                />&nbsp;&nbsp;
                <Button onClick={this.handleToday.bind(this)} type={this.state.type[0]}>今</Button>
                <Button onClick={this.handleYesterday.bind(this)} type={this.state.type[1]}>昨</Button>
                <Button onClick={this.handleWeek.bind(this)} type={this.state.type[2]}>近7天</Button>
                <Button onClick={this.handleMonth.bind(this)} type={this.state.type[3]}>近30天</Button>
            </div>
        );
    }
}

export default DateRange;
