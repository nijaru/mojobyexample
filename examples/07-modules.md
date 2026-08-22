# Modules

Code lives in modules, and `import` brings declarations into scope. The standard library is rooted at `std` — `from std.math import sqrt` pulls in named functions, `import std.math` keeps the whole path.

```mojo
from std.math import sqrt, floor

import std.math as m

def main():
    # Direct use of imported names
    print(sqrt(16.0), floor(3.7))

    # Alias access
    print(m.sqrt(25.0), m.e)
```

```text
4.0 3.0
5.0 2.718281828459045
```

Every `.mojo` file is itself a module: `import my_utils` loads `my_utils.mojo` from the same directory, and its top-level functions become `my_utils.name`. Watch argument types: `sqrt(17)` computes an integer square root (4) — pass `17.0` for the float result.
