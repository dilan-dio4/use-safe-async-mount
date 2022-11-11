# use-safe-async-mount

Inspiration: `use-async-effect`

```jsx
useEffect(() => {

}, [])
```

Is the most incorrectly [_and dangerously_] used part of the react component lifecycle.

Whenever using this hook with empty dependencies, you should ask yourself two questions.

1. Am I using this to just initialize a variable based on some synchronous computed value?
    * ```useEffect(() => { setValue(computeMyValue()) }, [])```
2. Am I using this to just conditionally initialize a state variable based on props?
    * ```useEffect(() => { setValue(someProp ? "a" : "b") }, [])```

If either of these situations describes you, there's a 90% chance you should be just be computing the value in-line or using `useMemo`. This **saves** you from having to deal with the initial render when your value is _undefined_. 

If you don't fall under either of these situations [e.g a network request, setting an event listener]. You're likely using the correct pattern.

Often, we'll find ourselves needed to perfom some async request in this hook and that means we'll have to safely deal with this _undefined_ value problem. Here comes `use-safe-async-mount`.
