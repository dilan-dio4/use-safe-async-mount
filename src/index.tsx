import React, { useEffect, useRef, useState, Fragment } from 'react';

interface ISafeRender<T extends {}> {
    children: React.ReactElement | React.ReactElement[] | ((safeState: NonNullable<T>) => React.ReactElement | React.ReactElement[]);
}

export default function useSafeAsyncMount<T extends {} | undefined>(effect: (isActive: () => boolean) => Promise<T>, cleanup?: (result: T) => void) {
    const isMounted = useRef<boolean>(false);
    const isSafeMounted = useRef<boolean>(false);

    const [SafeRender, setSafeRender] = useState<(props: ISafeRender<T>) => React.ReactElement>(() => () => <Fragment />);
    const [safeState, setSafeState] = useState<T | undefined>();
    const hasCleanup = typeof cleanup === 'function';

    useEffect(() => {
        let result: T;
        isMounted.current = true;
        const maybePromise = effect(() => isMounted.current);

        Promise.resolve(maybePromise).then((value) => {
            result = value;
            isSafeMounted.current = true;
            if (isMounted.current) {
                setSafeRender(() => (props: ISafeRender<T>) => (
                    <Fragment>{typeof props.children !== 'function' ? props.children : props.children(safeState)}</Fragment>
                ));
            }
        });

        return () => {
            isMounted.current = false;
            isSafeMounted.current = false;

            if (hasCleanup) {
                cleanup(result);
            }
        };
    }, []);

    return {
        isMounted: isMounted.current,
        isSafeMounted: isSafeMounted.current,
        SafeRender,
    };
}
