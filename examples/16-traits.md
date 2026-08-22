# Traits

A trait defines a set of required methods. Structs declare conformance and implement them, and generic functions dispatch through traits statically — Mojo has no runtime (virtual) dispatch.

```mojo
trait Shape:
    def area(self) -> Float64: ...

@fieldwise_init
struct Circle(Shape, Copyable, Movable):
    var r: Float64

    def area(self) -> Float64:
        return 3.14159 * self.r * self.r

@fieldwise_init
struct Square(Shape, Copyable, Movable):
    var side: Float64

    def area(self) -> Float64:
        return self.side * self.side

# T: Shape means "any type that conforms to Shape"
def total_area[T: Shape & Movable](shapes: List[T]) -> Float64:
    var total = 0.0
    for s in shapes:
        total += s.area()
    return total

def main():
    var circles: List[Circle] = [Circle(r=1.0), Circle(r=2.0)]
    var squares: List[Square] = [Square(side=2.0)]

    print(total_area(circles))
    print(total_area(squares))
```

```text
15.70795
4.0
```

Traits can also require static methods and associated constants, and they compose with `&` — for example `T: Copyable & Writable`.
