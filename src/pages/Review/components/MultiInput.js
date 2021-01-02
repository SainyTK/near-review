import React from 'react'
import styled from 'styled-components';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

const StyledWrapper = styled.div`

`

const MultiInput = ({ value, onChange, placeholder, ...props }) => {


    const handleChange = (id, v) => {
        if (onChange) {
            onChange(value.map((item, index) => index === id ? v : item))
        }
    }

    const handleAdd = () => {
        if (onChange) {
            onChange(['', ...value]);
        }
    }

    const handleDelete = (id) => {
        if (onChange) {
            onChange(value.filter((p, index) => index !== id))
        }
    }

    return (
        <StyledWrapper>
            <div className='input-item'>
                <Input
                    type='text'
                    value={value[0]}
                    onChange={e => handleChange(0, e.target.value)}
                    placeholder={placeholder}
                />
            </div>
            {
                value.slice(1).map((item, id) => (
                    <div key={id} className='input-item'>
                        <Input
                            className='with-btn'
                            type='text'
                            value={item}
                            onChange={e => handleChange(id + 1, e.target.value)}
                            placeholder={placeholder}
                        />
                        <Button
                            onClick={() => handleDelete(id + 1)}
                            icon={<MinusCircleOutlined />}
                        />
                    </div>
                ))
            }
            <Button type='dashed' block onClick={() => handleAdd()}>+</Button>
        </StyledWrapper>
    )
}

export default MultiInput
