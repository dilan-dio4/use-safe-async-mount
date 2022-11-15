<!-- markdownlint-disable MD033 MD041 -->

<br />

<h1 align="center">

use-safe-async-mount

</h1>

<h4 align="center">
  <b>The Asynchronous Functional Component Holder</b>
</h4>

<hr />

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
function ExampleComponent() {
  const [stateOne, setStateOne] = useState()

  useEffect(() => {
    someAsyncFunction().then(res => setStateOne(res))
    // OR
    const run = async () => {
      const res = await someAsyncFunction()
      setStateOne(res)
    }
    run();
  }, [])

  return (
    <>
        <h1>My Example Component</h1>
        {stateOne && <p>{stateOne}</p>}
    </>
  )
}
```

## The Drawbacks

There's three negative implications to this solution:

1. When the component initially mounts, the variable is _undefined_. This requires more render logic.
2. The component may unmount during the asynchronous request. Setting a state variable on an unmounted component is a **memory leak and will throw an error**.
3. In TypeScript projects, your compiler won't recognize that your variable has been defined. That means `!`'s everywhere.

## The Solution

### Installation

```bash
npm i use-safe-async-mount
```

`use-safe-async-mount` solves these problems by acting as a **true hook-based, type-safe `componentWillMount`** implementation.

### Example

```js
import useSafeAsyncMount from 'use-safe-async-mount';

function ExampleComponent() {

  const { SafeRender } = useSafeAsyncMount(async isActive => {
    const res = await someAsyncFunction()
    if (isActive()) {
      // ^ This avoids setting component state after unmount
      
      // These values are defined and type-safe in the `SafeRender` component
      return { 
        stateOne: "Some value my component depends on",
        stateTwo: res
      }
    }
  })

  return (
    <>
      <h1>My Example Component</h1>
      <SafeRender>
        {({ stateOne, stateTwo }) => (
          <p>{stateOne}</p>
        )}
      </SafeRender>
    </>
  )
}
```

## Example

Here's an [interactive example]() and the [associated source code](/test/src/App.tsx).

## Inspirations

* [use-async-effect](https://github.com/rauldeheer/use-async-effect)
