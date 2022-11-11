import React, { useEffect, useRef, useState, Fragment } from 'react';

interface ISafeRender {
    children: React.ReactElement | React.ReactElement[];
}

export default function useSafeAsyncMount<T = void>(effect: (isActive: () => boolean) => Promise<T>, cleanup?: (result: T) => void) {
    const isMounted = useRef<boolean>(false);
    const isSafeMounted = useRef<boolean>(false);

    const [SafeRender, setSafeRender] = useState<(props: ISafeRender) => React.ReactElement>(() => () => <Fragment />);
    const hasCleanup = typeof cleanup === 'function';

    useEffect(() => {
        let result: T;
        isMounted.current = true;
        const maybePromise = effect(() => isMounted.current);

        Promise.resolve(maybePromise).then(value => {
            result = value;
            isSafeMounted.current = true;
            if (isMounted.current) {
                setSafeRender(() => (props: ISafeRender) => <Fragment>{props.children}</Fragment>);
            }
        });

        return () => {
            isMounted.current = false;
            isSafeMounted.current = false;

            if (hasCleanup) {
                cleanup(result);
            }
        };
    }, [])

    return {
        isMounted: isMounted.current,
        isSafeMounted: isSafeMounted.current,
        SafeRender
    }
}