import { Layout } from 'antd'
import React, { Component } from 'react'
import { Menu, Icon, Drawer, Switch } from 'antd'
import { NavLink } from 'react-router-dom'
import cookie from 'react-cookies'
import jwt from 'jsonwebtoken'
import Permission from '../Authen/Permission'
// import menu from '../Authen/GetMenu'
const { SubMenu } = Menu;

const { Sider } = Layout

class AppSider extends Component {
    rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4'];
    constructor(props) {
        super(props);
        this.state = {
            collapsed: props.collapsed,
            menu: [],
            openKeys: [],
            stateDrawer: false,
            theme: 'dark'
        }
        this.setCollapsed(props.collapsed)
    }

    setCollapsed = (value) => {
        this.setState({
            collapsed: value
        })
    }
    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    componentDidMount() {

    }

    showDrawer = () => {
        this.setState({
            stateDrawer: true,
        });
    }

    onClose = () => {
        this.setState({
            stateDrawer: false,
        });
    };

    handleClick = e => {
        if (e.key === '13') {
            this.showDrawer()
        }
    };

    changeTheme = value => {
        this.setState({
            theme: value ? 'light' : 'dark'
        });
    }

    render() {
        let token = cookie.load('token');

        let payload = jwt.decode(token);
        let claims = payload.claims;
        if (claims !== undefined) {
            for (let i = 0; i < claims.length; i++) {
                if (claims[i] === Permission.Role.Read) {
                    claims[i] = { url: '/role', des: 'Phân quyền', menu: 1 }
                }
                else if (claims[i] === Permission.User.Read) {
                    claims[i] = { url: '/user', des: 'User', menu: 1 }
                }
                else if (claims[i] === Permission.User.Read) {
                    claims[i] = { url: '/approved', des: 'Phê duyệt', menu: 1 }
                }
                else if (claims[i] === Permission.Hotro.Read) {
                    claims[i] = { url: '/hotro', des: 'Công Việc & Hỗ trợ', menu: 2 }
                }
                else if (claims[i] === Permission.Nhansu.Read) {
                    claims[i] = { url: '/nhansu', des: 'Nhân sự', menu: 1 }
                }
                else if (claims[i] === Permission.Diaban.Read) {
                    claims[i] = { url: '/diaban', des: 'Địa bàn', menu: 3 }
                }
                else if (claims[i] === Permission.Duan.Read) {
                    claims[i] = { url: '/duan', des: 'Dự án', menu: 3 }
                }
                else if (claims[i] === Permission.Khachhang.Read) {
                    claims[i] = { url: '/khachhang', des: 'Khách hàng', menu: 2 }
                }
                else if (claims[i] === Permission.Donvi.Read) {
                    claims[i] = { url: '/donvi', des: 'Đơn vị', menu: 2 }
                }
                else if (claims[i] === Permission.Hopdong.Read) {
                    claims[i] = { url: '/hopdong', des: 'Hợp đồng', menu: 3 }
                }
                else if (claims[i] === Permission.Hoadon.Read) {
                    claims[i] = { url: '/qlhd', des: 'Hóa Đơn', menu: 3 }
                }
                else if (claims[i] === Permission.File_khachhangs.Read) {
                    claims[i] = { url: '/file', des: 'File Khách Hàng', menu: 3 }
                }
            }
        }



        return (

            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className="logo" />
                <Menu
                    theme={this.state.theme}
                    defaultSelectedKeys={['1']} mode="inline"
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    onClick={this.handleClick}
                >
                    <Menu.Item key="1">
                        <Icon type="home" />
                        <span><NavLink to="/" className="">Trang Chủ</NavLink ></span>
                    </Menu.Item>

                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="user" />
                                <span>Người Dùng</span>
                            </span>
                        }
                    >
                        {claims.map((item, i) => {
                            if (item.url) {
                                if (item.menu === 1) {
                                    return <Menu.Item key={item.url}><NavLink to={item.url} className="">{item.des}</NavLink ></Menu.Item>
                                }
                            }
                        })}
                        <Menu.Item key="26">
                            <NavLink to="/chat" className="">Chat all</NavLink >
                        </Menu.Item>
                        <Menu.Item key="17">
                            <span><NavLink to="/approved" className="">Phê Duyệt</NavLink ></span>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="team" />
                                <span>Khách Hàng</span>
                            </span>
                        }
                    >
                        {claims.map((item, i) => {
                            if (item.url) {
                                if (item.menu === 2) {
                                    return <Menu.Item key={item.url}><NavLink to={item.url} className="">{item.des}</NavLink ></Menu.Item>
                                }
                            }

                        })}
                        {/* <Menu.Item key="5"><NavLink to="/hotro" >Hỗ Trợ khách hàng</NavLink></Menu.Item>
                        <Menu.Item key="6"><NavLink to="/nhansu" >Nhân Sự</NavLink></Menu.Item>
                        <Menu.Item key="7"><NavLink to="/hopdong">Hợp đồng</NavLink></Menu.Item>
                        <Menu.Item key="9"><NavLink to="/customer" className="">Khách Hàng</NavLink></Menu.Item> */}
                    </SubMenu>
                    <SubMenu
                        key="sub3"
                        title={
                            <span>
                                <Icon type="team" />
                                <span>Danh Mục Quản Lý</span>
                            </span>
                        }
                    >
                        {claims.map((item, i) => {
                            if (item.url) {
                                if (item.menu === 3) {
                                    return <Menu.Item key={item.url}><NavLink to={item.url} className="">{item.des}</NavLink ></Menu.Item>
                                }
                            }

                        })}
                        {/* <Menu.Item key="11"><NavLink to="/duan" className="">Dự án</NavLink ></Menu.Item>
                        <Menu.Item key="10"><NavLink to="/diaban" className="">Địa bàn</NavLink ></Menu.Item>
                        <Menu.Item key="8"><NavLink to="/unit" className="">Đơn vị</NavLink></Menu.Item>
                        <Menu.Item key="/231123das"><NavLink to="" className="">omg</NavLink></Menu.Item> */}
                        <Menu.Item key="123"><NavLink to="/nkhd" className="">Nhật ký hợp đồng</NavLink></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="14">
                        <Icon type="file" />
                        <span><NavLink to="/file" className="">Danh Mục Tập tin</NavLink ></span>
                    </Menu.Item>

                    <Menu.Item key="13">
                        <Icon type="setting" onClick={this.showDrawer} /> <span>Cài Đặt</span>
                    </Menu.Item>
                    <SubMenu key="sub4" title={
                        <span>
                            <Icon type="form" />
                            <span>Đăng Ký</span>
                        </span>
                    }>
                        <Menu.Item key="15">
                            <NavLink to="/half" className="">Đăng ký nghỉ</NavLink >
                        </Menu.Item>
                        {/* <Menu.Item key="16">
                            <NavLink to="/request" className="">Đăng ký nghỉ</NavLink >
                        </Menu.Item> */}
                        <Menu.Item key="18">
                            <NavLink to="/notification" className="">Thông báo nghỉ</NavLink >
                        </Menu.Item>
                    </SubMenu>
                </Menu>
                <Drawer
                    title="Cài Đặt"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.stateDrawer}
                    placement="right"
                >
                    <Switch
                        onChange={this.changeTheme}
                    />Đổi màu giao diện
                </Drawer>
            </Sider>

        )
    }
}

export default AppSider