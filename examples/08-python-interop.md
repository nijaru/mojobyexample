# Python Interop

Mojo can use the entire Python ecosystem. `Python.import_module()` imports any installed Python module, results come back as `PythonObject`s, and converting back to Mojo types is explicit.

```mojo
from std.python import Python

def main() raises:
    # Import any installed Python module
    var json = Python.import_module("json")

    var d = Python.dict()
    d["lang"] = "python"
    d["version"] = 3
    print(json.dumps(d))

    # Or evaluate a Python expression directly
    var squares = Python.evaluate("[x * x for x in range(5)]")
    print(squares)

    # Convert a PythonObject back to a Mojo value
    var n = Int(py=squares[2])
    print(n, n * 10)
```

```text
{"lang": "python", "version": 3}
[0, 1, 4, 9, 16]
4 40
```

Everything across this boundary can fail — the import, attribute access, the call itself — so the enclosing function must be marked `raises`. This is how Mojo programs reach NumPy, pandas, and the rest of the Python world while Mojo's own library ecosystem grows.
