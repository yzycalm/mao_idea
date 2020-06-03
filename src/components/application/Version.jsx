import React from 'react';
import { Table, Button, Card,} from 'antd';
import { format, handleScrollTop, paginationProps } from "../../utils";
import { changeCurPage, changePageSize } from "../../store/actionCreators";
import BreadcrumbCustom from "../BreadcrumbCustom";
import store from "../../store";
import { feacthVersionList } from "../../api/application/version";

class Version extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [
                {
                    title: '版本号',
                    dataIndex: 'versionCode',
                    key: 'versionCode',
                    width: 130,
                },
                {
                    title: '版本名称',
                    dataIndex: 'versionName',
                    key: 'versionName',
                    width: 130,
                },
                {
                    title: '系统',
                    dataIndex: 'platform',
                    key: 'platform',
                    width: 130,
                    render: (text, record) => {
                        if (text === 1) {
                            return <span>Android</span>
                        } else {
                            return <span>iOS</span>
                        }
                    }
                },
                // {
                //     title: '更新地址',
                //     dataIndex: 'upgradeLink',
                //     key: 'upgradeLink',
                //     width: 300,
                //     render: text => {
                //         return <span className="word_break">{text}</span>
                //     }
                // },
                {
                    title: '普通更新下发最高版本',
                    dataIndex: 'popupMaxVersionCode',
                    key: 'popupMaxVersionCode',
                },
                {
                    title: '是否强制更新',
                    dataIndex: 'forciblyUpdate',
                    key: 'forciblyUpdate',
                    width: 150,
                    render: (text, record) => {
                        if (text === 1) {
                            return <span>是</span>
                        } else {
                            return <span>否</span>
                        }
                    }
                },
                {
                    title: '强制更新最高版本',
                    dataIndex: 'upgradeMaxVersionCode',
                    key: 'upgradeMaxVersionCode',
                },
                {
                    title: '更新文案',
                    dataIndex: 'content',
                    key: 'content',
                    width: 350,
                    render: text => {
                        if (text) {
                            return text.length > 20 ? text.substring(0, 20) + '...' : text
                        } else {
                            return '-'
                        } 
                    }
                },
                {
                    title: '最近编辑时间',
                    dataIndex: 'lastUpdateTime',
                    key: 'lastUpdateTime',
                    width: 200,
                    render: text => {
                        return format(text)
                    }
                },
                {
                    title: '操作',
                    width: 120,
                    fixed: 'right',
                    dataIndex: 'operation',
                    render: (text, record) => {
                        return <span>
                            <Button type={"primary"}
                                onClick={() => {
                                    this.addVersion(record)
                                }}
                            >编辑</Button>
                        </span>
                    }
                },
            ],
            query: {
                clientId: store.getState().clientId,
                curPage: store.getState().curPage,
                pageNum: store.getState().curPage,
                pageSize: store.getState().pageSize,
            },
            tableData: [],
            loading: false,
            total: 0,
            dataLength: 0
        }
    }
    componentDidMount () {
        this.initData()
        handleScrollTop(1)
    }
    initData () {
        const that = this
        this.setState({
            loading: true
        }, () => {
            feacthVersionList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + '' + item.id
                        })
                        that.setState({
                            tableData: data.list,
                            total: data.total,
                            dataLength: data.list.length
                        })
                    }
                })
            })
        })
    }
    addVersion (record) {
        this.props.history.push({
            pathname: 'children/AddVersion',
            query: { detail: record.id ? JSON.stringify(record) : '' }
        })
        handleScrollTop(2)
    }

    render () {
        const pagination = paginationProps(this.state.total, this.state.query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, this.state.query, { pageSize: pageSize, curPage: 1, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, { curPage: current, pageNum: current})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="应用配置" second="版本记录" />
                <div className="gutter-box">
                    <Card bordered>
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={this.addVersion.bind(this)}
                        >新增版本</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Version