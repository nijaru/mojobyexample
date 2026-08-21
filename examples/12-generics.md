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

Inside a parameterized struct, refer to your own parameters as `Self.T` — bare parameter names are not visible inside the struct body.
