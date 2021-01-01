import { useState } from 'react';

const useVisibility = (initialValue = false) => {
    const [visible, setVisible] = useState(initialValue);

    const show = () => setVisible(true)

    const hide = () => setVisible(false)

    const toggle = () => setVisible(!visible);

    return {
        visible,
        show,
        hide,
        toggle
    }
}

export default useVisibility;