# Tuples

Tuples group a fixed number of values of possibly different types. They are lightweight, stack-friendly, and useful for returning multiple values without defining a struct.

```mojo
def main():
    var t = (1, 2.5, "three")
    print(t[0], t[1], t[2])
    print(len(t))

    # Tuples nest
    var nested = ((1, 2), (3, 4))
    print(nested[0], nested[1][0])
```

```text
1 2.5 three
3
(1, 2) 3
```

Tuples are fixed-size and anonymous — when the fields have meaning, define a struct instead.
