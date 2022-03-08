# Updates
---
### Update 0.1: Math
> The first commit. It just adds basic math operations. To use them, open the active interpreter and type any equaision you like
`>> (5 + 5) * 2 + 4`
`>> 24`
---
### Update 0.2: Variables
> The first thing to resemble programming! Now you can make variables
`>> var num = 10`
These can now be refered to inside math operations
`>> num / 2`
`>> 5`
And they can also be referred to just by typing their identifier
`>> var num2 = num + 5`
`>> num2`
`>> 15`
There are no mutations, constants or strings yet, but they'll be all added in future updates

---
### Update 0.21: Strings
> Just simple strings. When creating variables you can set the value as a string
`>> var name = 'HEHEHEHAW'`
You can also add numbers to it
`>> name + 2`
`>> HEHEHEHAW2`
But adding Strings themselves doesn't work yet
`>> name + 'hey'`
`ERROR`

### Update 0.22: Anonymous Strings
> Now strings can stand by themselves
without any variables. So you can now add them to other anonymous strings or to variables
`>> var name = 'Hello,' + ' ' + 'world!'`
`>> name`
`>> Hello, world!`<br>
`>> var name2 = 'Hello'`
`>> name2 + " world!"`
`>> Hello, world!`