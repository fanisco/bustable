import {useEffect} from 'react';

/**
 * Window resize handler.
 */
export default function useWindowResize(callback) {
    useEffect(() => {
        window.addEventListener('resize', callback);
        return () => {
            window.removeEventListener('resize', callback)
        }
    }, [callback]);
}
