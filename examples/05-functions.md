# Functions

Functions are declared with `def`. Parameters and return types are annotated, and any function that can raise an error must say so with `raises`.

```mojo
def add(a: Int, b: Int) -> Int:
    return a + b

# Default argument values work like you'd expect
def greet(name: String, greeting: String = "Hello") -> String:
    return greeting + ", " + name + "!"

# Functions that can raise must be marked `raises`
def divide(a: Int, b: Int) raises -> Float64:
    if b == 0:
        raise Error("division by zero")
    return Float64(a) / Float64(b)

def main() raises:
    print(add(1, 2))
    print(greet("Mojo"))
    print(greet("World", "Howdy"))
    print(divide(7, 2))
```

```text
3
Hello, Mojo!
Howdy, World!
3.5
```

Arguments can also be passed by name, in any order:

```mojo
def greet(name: String, greeting: String = "Hello") -> String:
    return greeting + ", " + name + "!"

def main():
    print(greet(name="Mojo", greeting="Howdy"))
    print(greet(greeting="Hey", name="Ada"))
```

```text
Howdy, Mojo!
Hey, Ada!
```
`raises` is part of a function's signature, so callers can see which functions can fail — the compiler enforces it in both directions.
