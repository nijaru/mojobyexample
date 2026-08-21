# Ownership

Every value has one owner, and function arguments declare how they relate to it: the default is an immutable borrow, `mut` is a mutable borrow, and `var` takes ownership. The `^` transfer operator moves a value explicitly.

```mojo
# imm — an immutable borrow, no copy (the default convention)
def length(imm s: String) -> Int:
    return s.byte_length()

# mut — a mutable borrow; the caller sees the change
def add_bang(mut s: String):
    s += "!"

# var — takes ownership; the caller gives the value up
def decorate(var s: String) -> String:
    s = "[" + s + "]"
    return s^

def main():
    var name = String("mojo")
    print(length(name))
    add_bang(name)
    print(name)

    # ^ transfers ownership; `name` can't be used afterwards
    var decorated = decorate(name^)
    print(decorated)
```

```text
4
mojo!
[mojo!]
```

This is Mojo's alternative to garbage collection: borrows are checked at compile time, expensive values never copy implicitly (cheap implicitly-copyable types do), and destruction is deterministic.
