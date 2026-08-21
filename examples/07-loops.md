# Loops

Mojo has `while` loops and `for` loops over ranges and collections, with `break` and `continue` for control.

```mojo
def main():
    var i = 0
    while i < 3:
        print("while", i)
        i += 1

    # range(n) counts from 0 up to n - 1
    for j in range(3):
        if j == 1:
            continue
        print("for", j)

    var letters = ["a", "b", "c"]
    for letter in letters:
        print("letter", letter)

    # break exits the loop early
    var last = 0
    for j in range(10):
        last = j
        if j == 3:
            break
    print("stopped at", last)
```

```text
while 0
while 1
while 2
for 0
for 2
letter a
letter b
letter c
stopped at 3
```
