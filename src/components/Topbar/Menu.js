import React from 'react';
import styled from 'styled-components';
import { logout } from '../../utils'
import { Link } from 'react-router-dom'
import { UserOutlined, ShopOutlined } from '@ant-design/icons'

const StyledWrapper = styled.div`
    position: absolute;

    top: calc(64px + 10px);
    right: 20px;
    min-width: 160px;

    z-index: 10;

    animation: menu ease-in-out .2s;

    @keyframes menu {
        0% {
            transform: translateY(-2em);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    a {
        color: unset;
        text-decoration: none;
    }

    .menu-item {
        cursor: pointer;
        padding: 12px 18px;
        background-color: var(--bg);

        display: flex;
        align-items: center;

        i {
            margin-right: 8px;
        }
    }

    .menu-item:first-child {
        border-radius: 12px 12px 0 0;
    }

    .menu-item:last-child {
        border-radius: 0 0 12px 12px;
    }

    .menu-item:hover {
        background-color: var(--bg-light);
    }

    .menu-item-icon {
        margin-right: 12px;
    }
`

const Menu = (props) => {

    const menus = [
        {
            icon: <UserOutlined/>,
            name: 'Profile',
            link: '/profile'
        },
        {
            icon: <ShopOutlined />,
            name: 'For business',
            link: '/manageProducts'
        },
        {
            name: 'Logout',
            onClick: () => {
                logout();
            }
        }
    ]

    return (
        <StyledWrapper {...props}>
            {
                menus.map((menu, index) => menu.link ? (
                    <Link to={menu.link} key={index} className="menu-item">
                        <span className='menu-item-icon'>{menu.icon}</span>
                        <span>{menu.name}</span>
                    </Link>
                ) : (
                        <div onClick={menu.onClick} key={index} className="menu-item">
                            <span className='menu-item-icon'>{menu.icon}</span>
                            <span>{menu.name}</span>
                        </div>
                    ))
            }
        </StyledWrapper>
    )
}

export default Menu
