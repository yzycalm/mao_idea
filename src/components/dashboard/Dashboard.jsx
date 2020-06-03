/**
 * Created by hao.cheng on 2017/5/3.
 */
import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Statistic, Card, Row, Col, Icon } from 'antd';

class Dashboard extends React.Component {
    render() {
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom />
                <div>
                    <Row gutter={16}>
                        <Col span={5}>
                            <Card>
                                <Statistic
                                    title="Active"
                                    value={11.28}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<Icon type="arrow-up" />}
                                    suffix="%"
                                />
                            </Card>
                        </Col>
                        <Col span={5}>
                            <Card>
                                <Statistic
                                    title="Idle"
                                    value={9.3}
                                    precision={2}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<Icon type="arrow-down" />}
                                    suffix="%"
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Dashboard;
