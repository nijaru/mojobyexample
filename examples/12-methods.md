# Methods

Structs can define methods that take `self` by value (`var self`), immutably (plain `self`, the default), or mutably (`mut self`). They can also carry compile-time associated constants and static methods.

```mojo
struct Counter:
    comptime MAX = 100

    var count: Int

    def __init__(out self, start: Int = 0):
        self.count = start

    def increment(mut self):
        if self.count < Counter.MAX:
            self.count += 1

    def reset(mut self):
        self.count = 0

    @staticmethod
    def default_limit() -> Int:
        return Counter.MAX

def main():
    var c = Counter()
    c.increment()
    c.increment()
    c.increment()
    print(c.count)

    c.reset()
    print(c.count)

    print(Counter.default_limit(), Counter.MAX)
```

```text
3
0
100 100
```

`out self` marks the constructor's output: the method initializes an uninitialized value rather than reading one.
