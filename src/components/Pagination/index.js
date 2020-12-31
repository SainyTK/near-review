import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import PageItem from './PageItem';

const StyledWrapper = styled.div`
  display: flex;
  .item {
    margin-right: 4px;
  }
`;

const OFFSET = 3;

const Pagination = ({ current, total, pageSize, onChange }) => {

    const len = Math.ceil(total / pageSize);

    const renderPages = () => {
        if (current - 1 >= OFFSET && len - current >= OFFSET && len > OFFSET * 2)
            return (
                <>
                    <PageItem className='item' active={current === 1} onClick={() => onChange(1, pageSize)}>1</PageItem>
                    <PageItem className='item' onClick={() => onChange(current - OFFSET, pageSize)}>...</PageItem>
                    {Array.from(new Array(OFFSET)).map((_, i) => {
                        const p = current + (i - 1);
                        return (
                            <PageItem key={i} className='item' active={current === p} onClick={() => onChange(p, pageSize)}>{p}</PageItem>
                        )
                    })}
                    <PageItem className='item' onClick={() => onChange(current + OFFSET, pageSize)}>...</PageItem>
                    <PageItem className='item' active={current === len} onClick={() => onChange(len, pageSize)}>{len}</PageItem>
                </>
            )
        else if (current - 1 <= OFFSET && len > OFFSET * 2)
            return (
                <>
                    {Array.from(new Array(OFFSET)).map((_, i) => {
                        const p = i + 1;
                        return (
                            <PageItem key={i} className='item' active={current === p} onClick={() => onChange(p, pageSize)}>{p}</PageItem>
                        )
                    })}
                    <PageItem className='item' onClick={() => onChange(current + OFFSET, pageSize)}>...</PageItem>
                    <PageItem className='item' active={current === len} onClick={() => onChange(len, pageSize)}>{len}</PageItem>
                </>
            )
        else if (len - current <= OFFSET && len > OFFSET * 2)
            return (
                <>
                    <PageItem className='item' active={current === 1} onClick={() => onChange(1, pageSize)}>1</PageItem>
                    <PageItem className='item' onClick={() => onChange(current - OFFSET, pageSize)}>...</PageItem>
                    {Array.from(new Array(OFFSET)).map((_, i) => {
                        const p = len - (OFFSET - i) + 1;
                        return (
                            <PageItem key={i} className='item' active={current === p} onClick={() => onChange(p, pageSize)}>{p}</PageItem>
                        )
                    })}
                </>
            )
        else
            return Array.from(new Array(len)).map((_, i) => {
                return (
                    <PageItem key={i} className='item' active={current === i + 1} onClick={() => onChange(i + 1, pageSize)}>{i + 1}</PageItem>
                )
            })
    }

    return (
        <StyledWrapper>
            <div className='item'>
                <Button onClick={() => onChange(current - 1, pageSize)} disabled={current === 1}>Previous</Button>
            </div>
            {
                renderPages()
            }
            <div className='item'>
                <Button
                    onClick={() => onChange(current + 1, pageSize)}
                    disabled={current === len}
                >
                    Next
                </Button>
            </div>
        </StyledWrapper>
    )
}

export default Pagination;