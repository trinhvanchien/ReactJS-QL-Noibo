import React from 'react'
import { Tooltip, Pagination, Icon, Table, Popconfirm, message, Button, Form, Row, Col, notification, Alert, Card, Input } from 'antd'
import { connect } from 'react-redux'
import Request from '@apis/Request'
import { fetchUser } from '@actions/user.action'
import { fetchLoading } from '@actions/common.action'
import Modal_Hoadon from '@pages/Modal/Modal_Hoadon.js'
import '@styles/style.css'

const { Column } = Table;
var format = require('dateformat')
class Quanly_hoadon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            qlhd: [],
            pageNumber: 1,
            page: 1,
            pageSize: 10,
            count: 1,
            visible: false,
            formtype: 'horizontal',
            title: 'Nhập thông tin Quản lý hóa đơn',
            id_visible: false,
            action: 'insert',
            sortBy: '',
            index: 'qlhd_sohoadon',
            stateconfirmdelete: false,
            checkStateConfirm: true,
            statebuttondelete: true,
            statebuttonedit: true,
            rowthotroselected: [],
            selectedId: [],
            selectedRowKeys: [],
            khachhangs: [],
            timkiem: []
        }
    }

    getQuanly_hoadon = (pageNumber) => {
        if (pageNumber <= 0)
            return;
        this.props.fetchLoading({
            loading: true
        })
        Request('qlhd/get', 'POST', {
            pageSize: this.state.pageSize,
            pageNumber: pageNumber,
            index: this.state.index,
            sortBy: this.state.sortBy
        })
            .then((res) => {
                if (res.data.data) {
                    this.setState({
                        qlhd: res.data.data.quanly_hoadons,
                        count: res.data.data.count
                    })
                }
                this.props.fetchLoading({
                    loading: false
                })
            })
    }

    getkhachhang = () => {
        Request('qlhd/getkhachhang', 'POST', {}).then((res) => {
            if (res) {
                this.setState({
                    khachhangs: res.data.data.khachhangs
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    insertOrUpdate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            var url = this.state.action === 'insert' ? 'qlhd/insert' : 'qlhd/update'
            Request(url, 'POST', values)
                .then(async (response) => {
                    this.setState({
                        rowthotroselected: values
                    })
                    if (response.status === 200 & response.data.success === true) {
                        form.resetFields();
                        this.setState({
                            visible: false,
                            message: response.data.message
                        })
                    }
                    var description = response.data.message
                    var notifi_type = 'success'
                    var message = 'Thông báo'

                    console.log("check response ", response.data.success)
                    if (!!!response.data.success) {
                        message = 'Có lỗi xảy ra!'
                        notifi_type = 'error'
                        description = response.data.message.map((value, index) => {
                            return <Alert type='error' message={value}></Alert>
                        })
                    }
                    await notification[notifi_type]({
                        message: message,
                        description: description
                    });
                    this.getQuanly_hoadon(this.state.page)
                })
        })
    }

    deleteQuanly_hoadon = (qlhd_sohoadon) => {
        Request(`qlhd/delete`, 'DELETE', { qlhd_sohoadon: qlhd_sohoadon })
            .then((res) => {
                notification[res.data.success === true ? 'success' : 'error']({
                    message: 'Thông báo',
                    description: res.data.message
                });
                this.setState({
                    stateconfirmdelete: false,
                    statebuttondelete: true,
                    statebuttonedit: true,
                    selectedRowKeys: []
                })
                this.getQuanly_hoadon(this.state.page)
                this.render()
            })
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8, align: 'center' }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, dataIndex, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, dataIndex, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90 }}
                >
                    Tìm kiếm
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
    });

    handleSearch = (selectedKeys, value, confirm) => {
        let vl = { values: selectedKeys[0], keys: value }
        if (value && selectedKeys.length > 0) {
            this.state.timkiem.push(vl)
        }
        Request(`qlhd/search`, 'POST',
            {
                timkiem: this.state.timkiem,
                pageSize: this.state.pageSize,
                pageNumber: this.state.page
            })
            .then((res) => {
                notification[res.data.success === true ? 'success' : 'error']({
                    message: 'Đã xuất hiện bản ghi',
                    description: res.data.message
                });
                this.setState({
                    qlhd: res.data.data.quanly_hoadons,
                })
            })

        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    refresh = async (pageNumber) => {
        message.success('Refresh success', 1);
        await this.getQuanly_hoadon(this.state.pageNumber)
    }

    handleCancel = e => {
        this.setState({
            visible: false,
            id_visible: false
        });
    };

    componentDidMount() {
        this.getQuanly_hoadon(this.state.pageNumber, this.state.index, this.state.sortBy);
        document.getElementsByClassName('ant-card-body')[0].style.padding = '7px'
    }

    showModal = (qlhd) => {
        const { form } = this.formRef.props
        this.setState({
            visible: true
        });
        form.resetFields();
        if (qlhd.qlhd_sohoadon !== undefined) {
            this.setState({
                id_visible: true,
                action: 'update',
            })
            qlhd.qlhd_ngayxuat_hoadon = format(qlhd.qlhd_ngayxuat_hoadon, 'yyyy-mm-dd')
            form.setFieldsValue(qlhd);
        }
        this.getkhachhang();
    }

    confirm = (e) => {
        message.success('Bấm yes để xác nhận');
    }

    showTotal = (total) => {
        return `Total ${total} items`;
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedId: selectedRowKeys
        });
        if (selectedRowKeys.length > 0) {
            this.setState({
                statebuttondelete: false
            })
        }
        else
            this.setState({
                statebuttondelete: true
            })
        if (selectedRowKeys.length === 1) {
            this.setState({
                statebuttonedit: false,
                rowthotroselected: selectedRows[0]
            })
        }
        else
            this.setState({
                statebuttonedit: true
            })
    }

    checkStateConfirm = () => {
        this.setState({
            stateconfirmdelete: true
        })
    }

    onRowClick = (row) => {
        if (this.state.selectedRowKeys[0] === row.qlhd_sohoadon) {
            this.onSelectChange([], [])
        }
        else {
            this.onSelectChange([row.qlhd_sohoadon], [row])
        }
    }

    render() {
        const { selectedRowKeys } = this.state
        const rowSelection = {
            hideDefaultSelections: true,
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (
            <div>
                <Form>
                    <Row>
                        <Card>
                            <Col span={2}>
                                <Tooltip title="Thêm Hoá Đơn">
                                    <Button shape="round" type="primary" size="default" onClick={this.showModal.bind(null)}>
                                        <Icon type="plus" />
                                    </Button>
                                </Tooltip>
                            </Col>
                            <Col span={2}>
                                <Tooltip title="Sửa Hoá Đơn">
                                    <Button type="primary" size="default" shape="round" onClick={this.showModal.bind(this, this.state.rowthotroselected)} disabled={this.state.statebuttonedit}>
                                        <Icon type="edit" />
                                    </Button>
                                </Tooltip>
                            </Col>
                            <Col span={2}>
                                <Tooltip title="Xóa Hoá Đơn">
                                    <Popconfirm
                                        title="Bạn chắc chắn muốn xóa?"
                                        onConfirm={this.deleteQuanly_hoadon.bind(this, this.state.selectedId)}
                                        onCancel={this.cancel}
                                        okText="Yes"
                                        cancelText="No"
                                        visible={this.state.stateconfirmdelete}
                                    >
                                        <Button type="danger" style={{ marginLeft: '10px' }} shape="round" size="default" onClick={this.checkStateConfirm} disabled={this.state.statebuttondelete} >
                                            <Icon type="delete" />
                                        </Button>
                                    </Popconfirm>
                                </Tooltip>
                            </Col>
                            <Col span={2}>
                                <Tooltip title="Tải Lại">
                                    <Button shape="round" type="primary" size="default" style={{ marginLeft: '18px' }} onClick={this.refresh.bind(null)}>
                                        <Icon type="reload" />
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Card>
                    </Row>
                    <Row style={{ marginTop: 5 }}>
                        <Table rowSelection={rowSelection} onRowClick={this.onRowClick} pagination={false} dataSource={this.state.qlhd} rowKey="qlhd_sohoadon" bordered>
                            <Column title="Số hóa đơn" dataIndex="qlhd_sohoadon" {...this.getColumnSearchProps('qlhd_sohoadon')} width={50} />
                            <Column title="Tên hóa đơn" dataIndex="qlhd_tenhoadon" {...this.getColumnSearchProps('qlhd_tenhoadon')} width={150} />
                            <Column title="Ngày xuất hóa đơn" dataIndex="qlhd_ngayxuat_hoadon" {...this.getColumnSearchProps('qlhd_ngayxuat_hoadon')} width={150}
                                render={text => {
                                    return format(text, 'dd-mm-yyyy')
                                }}
                            />
                            <Column title="Tình trạng thanh toán" dataIndex="qlhd_tinhtrang_thanhtoan" {...this.getColumnSearchProps('qlhd_tinhtrang_thanhtoan')} width={150}
                                render={text => {
                                    if (text === 'CTT') {
                                        return 'Chưa thanh toán'
                                    }
                                    return 'Đã thanh toán '
                                }}
                            />
                        </Table>
                    </Row>
                    <Row>
                        <Pagination onChange={this.onchangpage} total={this.state.count} style={{ marginTop: 10 }} showSizeChanger onShowSizeChange={this.onShowSizeChange} showQuickJumper />
                    </Row>
                    <Modal_Hoadon
                        wrappedComponentRef={this.saveFormRef}
                        title={this.state.title}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onSave={this.insertOrUpdate}
                        formtype={this.state.formtype}
                        id_visible={this.state.id_visible}
                        setKhachHang={this.state.khachhangs}
                    />
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
})

export default connect(mapStateToProps,
    {
        fetchUser,
        fetchLoading
    }
)(Quanly_hoadon);