# SIMD

`SIMD` is a first-class type: a fixed-width vector of lanes that hardware instructions operate on together. Element-wise math over `SIMD` is a key way to get Mojo code to machine speed.

```mojo
from std.math import max

def main():
    # A 4-lane vector of 32-bit floats
    var v = SIMD[DType.float32, 4](1.0, 2.0, 3.0, 4.0)

    # Arithmetic applies to every lane at once
    var doubled = v * 2.0
    print(doubled)

    # Lane access
    print(v[0], v[3])

    # Horizontal reductions collapse lanes to a scalar
    print(doubled.reduce_add())

    # Per-lane operations
    print(v.clamp(2.0, 3.0))
    print(max(v, doubled))
```

```text
[2.0, 4.0, 6.0, 8.0]
1.0 4.0
20.0
[2.0, 2.0, 3.0, 3.0]
[2.0, 4.0, 6.0, 8.0]
```

The size parameter is a compile-time value, so the compiler picks the right vector instructions for your target — and `SIMD` composes with `comptime` and generics to build portable, tuned kernels.
