# Control Flow

Conditions are `Bool` values — no truthiness. Combine them with `and`, `or`, and `not`, and branch with `if`, `elif`, and `else`.

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
