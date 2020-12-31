import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { login, logout } from '../../utils';
import WalletInfo from './WalletInfo';
import Menu from './Menu';
import { Link } from 'react-router-dom';

const StyledWrapper = styled.div`
    position: relative;
    height: 64px;
    padding: 10px 24px;
    box-shadow: 0 0 12px 0 rgba(0,0,0,.15);
    background-color: white;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
        font-size: 20px;
        margin: 0;
        text-decoration: none;
        color: unset;
        font-weight: 600;
    }

    .wallet-info-container {
        display: flex;
        align-items: center;
    }

    .wallet-info {
        margin-right: 12px;
    }
`

const BtnMenu = styled.div`
    padding: 4px 8px;
    border-radius: 8px;
    background-color: var(--bg);
    cursor: pointer;

    &:hover {
        background-color: var(--bg-light);
    }
`

const TIME_OUT = 500;

const Topbar = () => {

    const isSignIn = window.walletConnection.isSignedIn();

    const hovering = useRef(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleShowMenu = () => {
        if (!hovering.current)
            setShowMenu(true);
        hovering.current = true;
    }

    const handleHideMenu = () => {
        hovering.current = false;
        setTimeout(() => {
            if (!hovering.current)
                setShowMenu(false);
        }, TIME_OUT);
    }

    return (
        <StyledWrapper className=''>
            <Link className='logo' to='/'>
                Dec Review
            </Link>

            {
                isSignIn ? (
                    <div className='wallet-info-container'>
                        <WalletInfo className='wallet-info' />
                        <BtnMenu onMouseOver={handleShowMenu} onMouseLeave={handleHideMenu}>•••</BtnMenu>
                    </div>
                ) : <Button onClick={() => login()}>Connect to a wallet</Button>
            }

            {showMenu && <Menu onMouseOver={handleShowMenu} onMouseLeave={handleHideMenu} />}

        </StyledWrapper>
    );


}

export default Topbar
