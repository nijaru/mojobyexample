# Strings

Strings are UTF-8. Byte length and character count are different things, indexing is byte-level and explicit, and interpolation uses t-strings.

```mojo
def main():
    var s = "Hello, Mojo"
    print(s.byte_length(), s.count_codepoints())

    var excited = s + "!"
    excited += "!"
    print(excited)

    # t-strings interpolate values lazily and type-safely
    var name = "Ada"
    var age = 36
    print(t"{name} is {age} years old")

    # .format() builds a String at runtime
    print("pi is about {}".format(3.14))

    # Iterate codepoints, not bytes
    for cp in "héllo".codepoints():
        print(Int(cp))
```

```text
11 11
Hello, Mojo!!
Ada is 36 years old
pi is about 3.14
104
233
108
108
111
```

Byte access uses a keyword index — `s[byte=0]` returns a zero-copy slice; wrap it in `String(...)` to own it. There is no `s[0]`: with UTF-8, "the first character" is always a question about bytes versus codepoints, and Mojo makes you answer it.
