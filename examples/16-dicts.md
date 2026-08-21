# Dictionaries

`Dict` maps keys to values. Keys must be hashable and equatable; iteration goes through entries with direct `.key` and `.value` access.

```mojo
def main() raises:
    var ages = {"ada": 36, "grace": 45}
    ages["alan"] = 41

    print(ages["ada"], len(ages))

    for entry in ages.items():
        print(entry.key, entry.value)

    if "ada" in ages:
        print("ada is here")

    # Dict is not implicitly copied either
    var copy = ages.copy()
    copy["ada"] = 37
    print(ages["ada"], copy["ada"])
```

```text
36 3
ada 36
grace 45
alan 41
ada is here
36 37
```

Keys must be both hashable and equatable, and iteration order is not guaranteed — don't rely on insertion order.
