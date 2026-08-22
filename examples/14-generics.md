# Generics

Generic functions and structs are parameterized by compile-time values and types. Each combination of parameters specializes into concrete machine code.

```mojo
def first[T: ImplicitlyCopyable](items: List[T]) -> T:
    return items[0]

@fieldwise_init
struct Box[T: ImplicitlyCopyable & Deinitable](Copyable, Movable):
    var value: Self.T

def main():
    print(first([10, 20, 30]))
    print(first([1.5, 2.5]))

    var box = Box(value=42)
    print(box.value)
```

```text
10
1.5
42
```

Types are not the only parameters — functions can take compile-time values, passed in square brackets at the call site:

```mojo
def zeros[n: Int]() -> List[Int]:
    var out: List[Int] = []
    for i in range(n):
        out.append(0)
    return out^

def main():
    var z = zeros[3]()
    print(len(z), z[0])
```

```text
3 0
```
Inside a parameterized struct, refer to your own parameters as `Self.T` — bare parameter names are not visible inside the struct body.
