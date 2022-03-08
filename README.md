# KANG2 language

A simple interpreted language made as a successor to the failed language Kangoo
> It's currently in pre-alpha.
> Version 0.2

## Installing

First install Node.js at <br>
https://nodejs.org/en/download/ <br>

Then open your terminal and type:
 
`cd [where you saved it]` <br>
`node app.js` <br>

The code will start running automatically

## Syntax

The syntax currently is very minimal.<br>
When startingm the first thing you'll see is the active interpreter<br>
There you type in the code and it'll be interpreted instantly.

### Math

Type in any equasion to get a result <br>
`>> 1 + 1`<br>
`>> 2` <br><br>
`>> (5 + 5) * 2`<br>
`>> 20`<br>

### Variables

To make Variables use the 'var' keyword followed by the identifier, and equals sign and finally the value<br>
`var number = 10`<br>
<br>
Strings --> WIP<br>
Types --> WIP<br>

The Identifier can now be used like a number <br>
`>> var num1 = 2`<br>
`>> var num2 = 6`<br>

`>> var num3 = num2 - num1`<br>
`>> num3`<br>
`>> 4`


## TODO

- add variables             [x]
  - add strings             [x]
    - add anonymous strings [x]
  - add mutation [ ]
  - add types [ ]
  - add booleans [ ]
- add functions             [ ]
- add loops                 [ ]
- add if statement          [ ]
- add built in system class [ ]
- add importing             [ ]
- make .kg file type with 
  vsc compatibility         [ ]
- add custom classes (maybe)[ ]