import React, { useEffect, useState } from "react"
import useSafeAsyncMount from '../../src';


export default function App() {
    const [isShowingChild, setIsShowingChild] = useState<boolean>(true);
    return (
        <div>
            <button onClick={() => setIsShowingChild(prev => !prev)}>{isShowingChild ? "Hide" : "Show"} Child</button>
            {isShowingChild && <Example />}
        </div>
    )
}

function Example() {
    const [componentStateStr, setComponentStateStr] = useState<string>("Component is mounted – the async effect hook has not finished");
    const [stateThatDependsOnAsync, setStateThatDependsOnAsync] = useState<string>();

    const { SafeRender, isMounted, isSafeMounted } = useSafeAsyncMount(async isActive => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (isActive()) {
            // ^ Avoids setting component state after unmount
            setStateThatDependsOnAsync("I'm defined!");
            return "A value to use in cleanup"
        }
    }, console.log)

    useEffect(() => {
        if (isSafeMounted) {
            setComponentStateStr("Component is mounted – async effect hook has finished!")
        }
    }, [isSafeMounted])


    return (
        <>
            <h1>{componentStateStr}</h1>
            <SafeRender>
                <h2>I can be sure that the state variable <code>stateThatDependsOnAsync</code> is defined!</h2>
                <code>stateThatDependsOnAsync:&nbsp;"{stateThatDependsOnAsync}"</code>
            </SafeRender>
        </>
    )
}