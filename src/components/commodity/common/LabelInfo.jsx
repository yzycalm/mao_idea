/** 标签集合  */
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Checkbox } from 'antd';
import {getScalpingLabel} from '../../../api/commondity/attract'

class LabelInfo extends Component {
    constructor(props) {
        super(props)
        this.state={
            labels: [],
            defaultChecked: []
        }
    }
    componentDidMount() {
        getScalpingLabel().then((res) => {
            if (res && +res.code === 1) {
                const data = res.data
                let result = []
                data.map(item=> {
                    result.push({label: item.name, value: item.id})
                })
                this.setState({
                    labels: result,
                    defaultChecked: this.props.selected
                })
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        const that = this
        if (that.props.selected !== nextProps.selected ) {
            this.setState({
                defaultChecked: nextProps.selected
            })
        }
    }
   onChange(checkedValue) {
       this.props.getSelectedLabel(checkedValue)
   }
    render() {
        const {labels,defaultChecked} = this.state
        return (
           <span>
             <Checkbox.Group disabled={this.props.disabled} options={labels}  value={defaultChecked} onChange={this.onChange.bind(this)} />
           </span>
        )
    }
}

LabelInfo.propTypes = {
    selected: PropTypes.array,
    getSelectedLabel: PropTypes.func,
    disabled: PropTypes.bool
}
LabelInfo.defaultProps = {
    selected: [],
    disabled: false
}
export default LabelInfo;
