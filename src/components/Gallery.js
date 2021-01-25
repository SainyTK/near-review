import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { CloseOutlined } from '@ant-design/icons'
import { Space } from 'antd'

const StyledWrapper = styled.div`
    .img-container {
        width: 120px;
        height: 100px;
        cursor: pointer;
        position: relative;
        border-radius: 8px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }

        .shadow {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,.75);

            color: white;
        }
    }

    .fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,.75);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 80%;
        }

        .close-icon {
            color: white;
            position: absolute;
            top: 20px;
            right: 20px;
            cursor: pointer;
        }
    }
`

const Gallery = (props) => {

    const { images } = props;
    const [selected, setSelected] = useState(-1);
    const elemRef = useRef();

    const maxVisible = 3;
    const diff = images.length - maxVisible;

    useEffect(() => {
        document.querySelector('body').style = `overflow: ${selected >= 0 ? 'hidden' : 'auto'}`;

        const clickHandler = (ev) => {
            if (elemRef.current && selected >= 0) {
                const { left, right, top, bottom } = elemRef.current.getBoundingClientRect();
                if (!(ev.x >= left && ev.x <= right && ev.y >= top && ev.y <= bottom)) {
                    setSelected(-1);
                }
            }
        }

        window.addEventListener('click', clickHandler)

        return () => {
            window.removeEventListener('click', clickHandler);
        }

    }, [selected]);

    return (
        <StyledWrapper>
            <Space>
                {
                    images.slice(0, maxVisible - 1).map((image, index) => (
                        <div className='img-container' key={index} onClick={e => setSelected(index)}>
                            <img src={image} />
                        </div>
                    ))
                }
                {
                    images.length >= maxVisible && (
                        <div className='img-container'>
                            { diff > 0 && <div className='shadow' onClick={e => setSelected(maxVisible - 1)}>+ {diff + 1}</div>}
                            <img src={images[maxVisible - 1]} />
                        </div>
                    )
                }
            </Space>
            {
                selected >= 0 && (
                    <div className='fullscreen'>
                        <CloseOutlined className='close-icon' onClick={e => setSelected(-1)} />
                        <img ref={ref => elemRef.current = ref} src={images[selected]} />
                    </div>
                )
            }
        </StyledWrapper>
    )
}

export default Gallery
