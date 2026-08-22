# Structs

A struct is a fixed-layout record with statically known fields — Mojo's core user-defined type. `@fieldwise_init` generates a constructor from the fields.

```mojo
from std.math import sqrt

@fieldwise_init
struct Point(Copyable, Movable, Writable):
    var x: Float64
    var y: Float64

    def magnitude(self) -> Float64:
        return sqrt(self.x * self.x + self.y * self.y)

    # Writable controls how the struct prints
    def write_to(self, mut writer: Some[Writer]):
        writer.write("(", self.x, ", ", self.y, ")")

def main():
    var p = Point(x=3.0, y=4.0)
    print(p)
    print(p.magnitude())

    # Structs have value semantics; copies are independent
    var q = p.copy()
    q.x = 0.0
    print(p, q)
```

```text
(3.0, 4.0)
5.0
(3.0, 4.0) (0.0, 4.0)
```

Conform to `Equatable` and define `__eq__` to compare structs by field value:

```mojo
@fieldwise_init
struct Point(Equatable, Copyable, Movable):
    var x: Int
    var y: Int

    def __eq__(self, other: Self) -> Bool:
        return self.x == other.x and self.y == other.y

def main():
    print(Point(x=1, y=2) == Point(x=1, y=2))
    print(Point(x=1, y=2) != Point(x=3, y=4))
```

```text
True
True
```
The trait list after the name declares what the struct can do: `Copyable` and `Movable` control copying and moving, and `Writable` enables printing.
