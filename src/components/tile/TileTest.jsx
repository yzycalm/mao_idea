import React from "react";
import _ from "lodash";
import {Responsive, WidthProvider} from "react-grid-layout";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Button, Card, Col, Row} from "antd";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class DragFromOutsideLayout extends React.Component {
    static defaultProps = {
        cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
        rowHeight: 100,
    };

    constructor(props) {
        super(props);

        this.state = {
            layouts: this.getFromLS("layouts") || {},
            widgets: []
        }
    }

    getFromLS(key) {
        let ls = {};
        if (global.localStorage) {
            try {
                ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
            } catch (e) {
                /*Ignore*/
            }
        }
        return ls[key];
    }

    saveToLS(key, value) {
        if (global.localStorage) {
            global.localStorage.setItem(
                "rgl-8",
                JSON.stringify({
                    [key]: value
                })
            );
        }
    }

    generateDOM = () => {
        return _.map(this.state.widgets, (l, i) => {
            let component = (
                <Button style={{width: '100%', height: '100%'}} />
            )
            return (
                <div key={l.i} data-grid={l}>
                    {/*<span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>*/}
                    {component}
                </div>
            );
        });
    };

    addChart() {
        const addItem = {
            x: (this.state.widgets.length * 3) % (this.state.cols || 12),
            y: Infinity, // puts it at the bottom
            w: 3,
            h: 2,
            i: new Date().getTime().toString(),
        };
        this.setState(
            {
                widgets: this.state.widgets.concat({
                    ...addItem
                }),
            },
        );
    };

    onRemoveItem(i) {
        console.log(this.state.widgets)
        this.setState({
            widgets: this.state.widgets.filter((item, index) => index != i)
        });

    }

    onLayoutChange(layout, layouts) {
        this.saveToLS("layouts", layouts);
        this.setState({layouts});
    }

    onDrop = elemParams => {
        alert(`Element parameters: ${JSON.stringify(elemParams)}`);
    };

    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first={'瓷片区配置'} />
                <div className="gutter-box">
                    <Card bordered title={"布局样式"}
                          extra={<div><Button type="primary">保存</Button><Button type="primary">启用本模块</Button></div>}
                    >
                        <Row>
                            <Col span={5}>
                                <Button
                                    type="primary"
                                    draggable
                                    onDragStart={e => e.dataTransfer.setData("text/plain", "")}
                                >
                                    拖拽
                                </Button>
                                <Button type="primary" onClick={this.addChart.bind(this)}>
                                    新增
                                </Button>
                            </Col>
                            <Col span={17} className="text-center">
                                <div className="device"
                                     style={{
                                         backgroundPosition: "0 0",
                                         display: "inline-block"
                                     }}
                                >
                                    <div className="device-content"
                                         style={{
                                             width: '321px',
                                             backgroundSize: "contain",
                                             height: '600px',
                                             overflowY: 'auto'
                                         }}
                                    >
                                        <ResponsiveReactGridLayout
                                            className="layout"
                                            {...this.props}
                                            layouts={this.state.layouts}
                                            onLayoutChange={(layout, layouts) =>
                                                this.onLayoutChange(layout, layouts)
                                            }
                                            measureBeforeMount={false}
                                            onDrop={this.onDrop}
                                            isDroppable
                                        >
                                            {this.generateDOM()}
                                        </ResponsiveReactGridLayout>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        );
    }
}
