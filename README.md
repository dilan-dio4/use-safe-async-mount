# use-safe-async-mount

## The Problem

This is a `useEffect` hook with zero dependencies:

```js
useEffect(() => {
  // Code that runs "on mount" (unfortunately)
}, [])
```

It is the most incorrectly [_and dangerously_] used part of the react functional component lifecycle.

Whenever using this hook (_with the empty dependency array_), you should ask yourself two questions:

1. Am I using this to **just** initialize a variable based on some synchronously computed value?
    * ```useEffect(() => { setValue(computeMyValue()) }, [])```

2. Am I using this to **just** conditionally initialize a state variable based on props?
    * ```useEffect(() => { setValue(someProp ? "a" : "b") }, [])```

If either of these situations describes you, there's a high chance you should be just be computing the value in-line or using `useMemo`. This **saves** you from having to deal with the initial render when your value (`useState`, `useRef`, `var`, etc.) is _undefined_.

Here's some situations that **do** fit in the empty `useEffect` hook:

* Making a network request
* Setting/removing an event listener
* UI-related analytics tracking

## Async State

When a component's state depends on a value gathered from an async function, the common solution is to manually invoke it directly from the empty `useEffect` hook: 

### The Traditional Pattern

```js
function Component() {
  const [val, setVal] = useState();

  useEffect(() => {
    someAsyncFunction().then(res => setVal(res))
    // OR
    const run = async () => {
      const res = await someAsyncFunction()
      setVal(res)
    }
    run();
  }, [])

  return (
    <>
        {res && <p>{res}</p>}
    </>
  )
}
```

There's three drawbacks to this solution:

1. The variable is _undefined_ initial when the component mounts. This more render logic.
2. The component may unmount during the asynchronous request. Setting a state variable on an unmounted component is a **memory leak and will throw an error**.
3. In TypeScript projects, your compile won't recognize that your variable has been defined. That means `!`'s everywhere.

## The Solution

`use-safe-async-mount` solves these problems by acting as a **true hook-based, type-safe `componentWillMount`** implementation.

```js
import useSafeAsyncMount from 'use-safe-async-mount';

function Example() {
    const [val, setVal] = useState();

    const { 
        SafeRender, // Component to wrap variable-dependent state
        isMounted, 
        isSafeMounted 
    } = useSafeAsyncMount(async isActive => {
        const res = await someAsyncFunction();
        if (isActive()) {
            // ^ Avoids setting component state after unmount
            setStateThatDependsOnAsync(res);
            return "Some value to use in cleanup function"
        }
    })

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
```

Here's an [interactive example]() and the [associated source code]()

## Inspiration

* [use-async-effect](https://github.com/rauldeheer/use-async-effect)
