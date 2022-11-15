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
    const [componentStateStr, setComponentStateStr] = useState<string>("Component mounted, safe mount hook has NOT finished");

    const { SafeRender, safeState } = useSafeAsyncMount(async isActive => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (isActive()) {
            // ^ This avoids setting component state after unmount

            // Values defined and are type-safe in the `SafeRender` component
            return { 
                stateOne: "Some value my component depends on",
                stateTwo: Math.random()
            }
        }
    }, console.log)

    useEffect(() => {
        // Optional
        if (safeState) {
            setComponentStateStr("Component mounted, safe mount hook has finished!")
        }
    }, [safeState])


    return (
        <>
            <h1>{componentStateStr}</h1>
            <SafeRender>
                {({ stateOne, stateTwo }) => (
                    <>
                        <h2>I can be sure that the the variables "<em>stateOne</em>" and "<em>stateOne</em>" are defined and type-safe!</h2>
                        <code>stateOne:&nbsp;"{stateOne}"</code>
                        <code>stateTwo:&nbsp;"{stateTwo}"</code>
                    </>
                )}
            </SafeRender>
        </>
    )
}