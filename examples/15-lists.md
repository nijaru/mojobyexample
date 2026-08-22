# Lists

`List` is the general-purpose growable sequence. Square-bracket literals alone give you a fixed-size `Array`, so annotate with the element type to get a growable `List`. Like all Mojo collections, lists are not implicitly copied — sharing a list means sharing its contents.

```mojo
def main():
    var nums: List[Int] = [10, 20, 30]
    nums.append(40)
    nums[0] = 5
    print(nums)

    print(len(nums), nums[0], nums[len(nums) - 1])

    var total = 0
    for n in nums:
        total += n
    print(total)

    # .copy() makes an independent deep copy
    var copy = nums.copy()
    copy.append(99)
    print(len(nums), len(copy))
```

```text
[5, 20, 30, 40]
4 5 40
95
4 5
```

Negative literal indices are rejected at compile time — `nums[-1]` does not wrap around; use `nums[len(nums) - 1]`. Out-of-range indices fail at run time with a bounds check.
