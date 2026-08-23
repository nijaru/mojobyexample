# Control Flow

Branch with `if`, `elif`, and `else`. Conditions use Python-style truthiness: zero numbers, empty strings, and empty collections are falsy. Explicit comparisons read best. Combine conditions with `and`, `or`, and `not`.

```mojo
def sign(n: Int) -> String:
    if n < 0:
        return "negative"
    elif n == 0:
        return "zero"
    else:
        return "positive"

def main():
    print(sign(-5), sign(0), sign(3))

    var sunny = True
    var warm = False
    if sunny and not warm:
        print("sunny but cold")
```

```text
negative zero positive
sunny but cold
```

For a value that depends on a condition, use a conditional expression:

```mojo
def main():
    var n = 7
    var label = "odd" if n % 2 == 1 else "even"
    print(label)
```

```text
odd
```
`and` and `or` short-circuit: the right side is only evaluated when the left side doesn't already decide the result.
