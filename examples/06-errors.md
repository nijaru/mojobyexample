# Errors

Functions signal failure by raising. Any function that can raise — directly or through something it calls — must be marked `raises`, and callers handle failures with `try` and `except`.

```mojo
def check_age(age: Int) raises -> String:
    if age < 0:
        raise Error("age cannot be negative")
    return "ok"

def main() raises:
    print(check_age(30))

    try:
        _ = check_age(-1)
    except e:
        print("caught:", e)
```

```text
ok
caught: age cannot be negative
```

`raises` can name the error type; `raise` then sends any value of that type, and `except e` binds it:

```mojo
def parse(s: String) raises Int -> Int:
    if s == "bad":
        raise 42
    return 1

def main() raises:
    print(parse("ok"))

    try:
        _ = parse("bad")
    except e:
        print("code", e)
```

```text
1
code 42
```
`raises` can also name a specific error type — `def parse(s: String) raises Int -> Int` — so error channels are part of the type signature. With a typed raise, `except e` binds the raised value itself.
