# Optionals

`Optional[T]` represents a value that may be absent. A plain value converts implicitly, an empty one is `Optional[T]()`, and truthiness tells them apart.

```mojo
def show(x: Optional[Int]):
    if x:
        print("some", x.value())
    else:
        print("none")

def main():
    show(7)
    show(Optional[Int]())

    # Dict.get returns an Optional instead of raising
    var ages = {"ada": 36}
    var found = ages.get("grace")
    print(found.value() if found else -1)
```

```text
some 7
none
-1
```

`.value()` on an empty Optional raises, so check first — `if x` and conditional expressions both work, and `Optional` never silently substitutes a default.
