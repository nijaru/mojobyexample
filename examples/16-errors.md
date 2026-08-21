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

`raises` can also name a specific error type — `def parse(s: String) raises Int -> Int` — so error channels are part of the type signature.
