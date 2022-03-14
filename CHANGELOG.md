# Updates
<br>

### Update 0.1: Math

> The first commit. It just adds basic math operations. To use them, open the active interpreter and type any equaision you like<br>
```javascript
>> (5 + 5) * 2 + 4<br>
>> 24
```
<br>

---

<br>

### Update 0.2: Variables

> The first thing to resemble programming! Now you can make variables <br>
```javascript
>> var num = 10
```
<br>

> These can now be refered to inside math operations <br>

```javascript
>> num / 2
>> 5
```
> And they can also be referred to just by typing their identifier<br>

```javascript
>> var num2 = num + 5
>> num2
>> 15
```

> There are no mutations, constants or strings yet, but they'll be all added in future updates

<br>

---

<br>

### Update 0.2.1: Strings
> Just simple strings. When creating variables you can set the value as a string

```javascript
>> var name = 'HEHEHEHAW'
```

> You can also add numbers to it

```javascript
>> name + 2
>> HEHEHEHAW2
```

> But adding Strings themselves doesn't work yet

```javascript
>> name + 'hey'
ERROR
```

<br>

---

<br>

### Update 0.2.2: Anonymous Strings
> Now strings can stand by themselves
without any variables. So you can now add them to other anonymous strings or to variables

```javascript
>> var name = 'Hello,' + ' ' + 'world!'
>> name
>> Hello, world!

>> var name2 = 'Hello'
>> name2 + " world!"
>> Hello, world!
```

<br>

---

<br>

### Update  0.2.21: Big fixing + BEAUTIFUL md file

> This file now looks decent and strings work now. Before the string detection only worked sometimes. Now it SHOULD work every time (I hope)

```javascript
>> // before
>> var name1 = "Hello" + " world!"
>> name1
>> Hello" + " world!

>> // now
>> name1
>> Hello world!
```

<br>

---

<br>

### Update 0.3: Functions

> Changes this file from UPDATES.md to CHANGELOG.md because its icon is prettier <br>
Also added very primitive functions

``` javascript
>> func name(argA, argB) -> return argA - argB
```

> They don't have any statement sequences inside AND you can't call them yet either. But those two will be added soon.<br>
The return type can be any object. So you can return functions too. This can lead to some very interesting nesting

```javascript
>> func f1() -> return func f2() -> return func f3() -> return "Hello"
```

> You can also return any equasion and variables. As soon as I add declaring variables without initializing them

```javascript
>> func name() -> return var variable = 10
```

> I think about changing the arrow from '->' to '=>' <br>
> Because of the way I implemented functions, they will be able to be references just like variables or you can change a variable to a function when I add mutation<br><br>
I also tried to write an extention for vscode, so that Kang2 has its own filetype (.kg) and it has syntax highlighting. It's still in its VERY early stages so i won't show it just now <br><br>
And the last thing I did was to change the way how the code is parsed. Now every Line is considered a 'statement' instead of an expression. This is a preparation for multiline code inside loops, functions or if-statements. Functions and Variables hold the highest priority, instead of variables being tied to an equasion<br>

> The biggest Update I made until now

<br>

---

<br>

### Update 0.3.1: Functions working now! (almost)

> Functions are now understood by the interpreter. So now you'll get a syntax tree with a beautiful function inside. I also learned the hard way that either Node.js or vanilla Javascript has a built in 'Function' class. That's why mine is now named '_Function' <br>
> I also added a global scale to see, if variables or functions are nested or not.

```javascript

// before
>> func name(a, b) -> return 'hello'
[ERROR: Syntax tree could not be builz]

// now
>> func name(a, b) -> return func name2()

_Function [
    return: _Function [
                body = null
                return = null
                args = null
                ident = 'name2'
            ]
    body = null
    args = [a, b]
    ident = 'name'
]
// it doesn't look like this actually but this is
// easier to recreate
```

<br>

---

<br>

### Update (???)