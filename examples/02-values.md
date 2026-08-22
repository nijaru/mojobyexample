# Values

Mojo has fixed-width numeric types like `Int`, `Float64`, and `Bool`, plus `String` for text. Types are static: a value's type is known at compile time and conversions between numeric types are always explicit.

```mojo
def main():
    var a: Int = 7
    var b = 3
    print(a + b, a - b, a * b, a // b, a % b)

    # Floats
    var x: Float64 = 3.14
    print(x, x * 2.0)

    # Bools
    var sunny = True
    var warm = False
    print(sunny and not warm)

    # Strings
    var s = "mojo"
    print(s + " 🔥")

    # Conversions between numeric types are explicit
    print(Float64(a) / 2.0)
    var byte: UInt8 = 255
    print(Int(byte))
```

```text
10 4 21 2 1
3.14 6.28
True
mojo 🔥
3.5
255
```

Literals are polymorphic: `3.14` adapts to whatever float type the context needs, so you rarely annotate small values by hand.

Float→int conversion is a method, not a constructor — and it truncates:

```mojo
def main():
    var x: Float64 = 3.99
    print(x.cast[DType.int]())
```

```text
3
```

Out-of-range literals into fixed-width ints wrap silently: a `UInt8` assigned 300 holds 44.
