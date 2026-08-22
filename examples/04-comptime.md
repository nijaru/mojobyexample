# Comptime

`comptime` marks values computed at compile time. Compile-time constants, type aliases, branches, and assertions all use the same keyword — metaprogramming is part of the core language, not a macro system.

```mojo
# A compile-time constant
comptime SIZE = 4

# A compile-time type alias
comptime Number = Float64

def describe() -> String:
    # The false branch generates no machine code (it is still parsed and type-checked)
    comptime if SIZE > 2:
        return "big"
    else:
        return "small"

def main():
    comptime assert SIZE > 0, "SIZE must be positive"

    var total = 0
    for i in range(SIZE):
        total += i

    var n: Number = 1.5
    print(total, n, describe())
```

```text
6 1.5 big
```

Because `SIZE` is known at compile time, the loop bounds, the assertion, and the `comptime if` are all resolved before the program ever runs. One trap: assigning to a constant's name inside a function doesn't mutate it — bare assignment declares a new runtime variable that shadows it.
