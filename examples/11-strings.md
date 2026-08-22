# Strings

Strings are UTF-8. Byte length and character count are different things, character access is always explicit, and interpolation uses t-strings.

```mojo
def main():
    var s = "Hello, Mojo"
    print(s.byte_length(), s.count_codepoints())

    # é is two bytes but one codepoint
    var h = "héllo"
    print(h.byte_length(), h.count_codepoints())

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
6 5
Hello, Mojo!!
Ada is 36 years old
pi is about 3.14
104
233
108
108
111
```

The everyday text operations are there too:

```mojo
def main():
    var csv = "a,b,c"
    var parts = csv.split(",")
    print(len(parts), parts[1])

    var padded = "  hi  "
    print(padded.strip() == "hi")

    print(csv.find("b"), csv.replace(",", "+"))
```

```text
3 b
True
2 a+b+c
```
`s[i]` does not exist. Character access uses keyword indices — `s[byte=i]`, `s[codepoint=i]`, and `s[grapheme=i]` — each returning a zero-copy view at the granularity you choose; wrap one in `String(...)` to own it. With UTF-8, "the first character" depends on what you mean, and Mojo makes you answer.
