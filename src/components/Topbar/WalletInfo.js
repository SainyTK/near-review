import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { utils } from 'near-api-js';
import useBalance from '../../states/useBalance'

const StyledWrapper = styled.div`

    .balance {
        border-radius: 10px 0 0 10px;
        padding: 8px 12px;
        margin-right: -6px;
        background-color: var(--bg);
    }

    .address {
        box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
        border-radius: 8px;
        padding: 8px;
        z-index: 5;
        background-color: white;
    }
`

const WalletInfo = (props) => {

    const { balance } = useBalance(window.accountId);

    return (
        <StyledWrapper {...props}>
            <span className='balance'>{balance} Ⓝ</span>
            <span className='address'>
                <Link to='/profile' className='no-style'>
                    {window.accountId}
                </Link>
            </span>
        </StyledWrapper>
    )
}

export default WalletInfo
