# Variables

Every new variable is introduced with `var`. After that, it can be reassigned freely — `var` declares, plain `=` mutates.

```mojo
def main():
    var x = 1
    x = 2  # reassignment needs no keyword

    # An explicit type is optional
    var y: Float64 = 2.5
    y = y + 0.5

    var s = "hello"
    s += " world"

    print(x, y, s)
```

```text
2 3.0 hello world
```

Bare assignments create *implicit declarations*, which are deprecated — always introduce variables with `var`. A declaration without an initializer (`var x: Int`) can be assigned later, including inside a branch.
