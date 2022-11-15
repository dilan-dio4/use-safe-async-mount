import React, { useEffect, useRef, useState, Fragment } from 'react';

interface ISafeRender<T extends Record<string | number, any>> {
    children: React.ReactElement | React.ReactElement[] | ((safeState: NonNullable<T>) => React.ReactElement | React.ReactElement[]);
}

export default function useSafeAsyncMount<T extends undefined | Record<string | number, any>>(
    effect: (isActive: () => boolean) => Promise<T>,
    cleanup?: (result: T) => void,
) {
    const isMounted = useRef<boolean>(false);

    const [SafeRender, setSafeRender] = useState<(props: ISafeRender<T>) => React.ReactElement>(() => () => <Fragment />);
    const [safeState, setSafeState] = useState<T | undefined>();
    const hasCleanup = typeof cleanup === 'function';

    useEffect(() => {
        let result: T;
        isMounted.current = true;
        const maybePromise = effect(() => isMounted.current);

        Promise.resolve(maybePromise).then((value) => {
            result = value;
            if (isMounted.current) {
                setSafeState(result);
            }
        });

        return () => {
            isMounted.current = false;

            if (hasCleanup) {
                cleanup(result);
            }
        };
    }, []);

    useEffect(() => {
        if (safeState) {
            setSafeRender(() => (props: ISafeRender<T>) => (
                <Fragment>{typeof props.children !== 'function' ? props.children : props.children(safeState)}</Fragment>
            ));
        }
    }, [safeState]);

    return {
        isMounted: isMounted.current,
        SafeRender,
        safeState,
    };
}
