# The Kang2 Programming Language

![Kang2 Logo](./logo.png)

[https://achodev.me/kang2](https://achodev.me/kang2)

Kang2 is a free, open source and easy to use programming language, mainly for terminal applications.

<br>

## Documentation

See `documentation.md` for more info

## Installing

- Run `npm i -g kang2`
- Run `kang2 [script file]`

## Changelog

### Update 1.1

- **Structs**

  ```swift
  struct House {
      var name = "House"
      var color = "Red"
      var size = 100

      func getname() {
          return name
      }

      func getcolor() {
          return color
      }
  }

  var house = House()

  log house.getname()
  ```

- **Better syntax errors**

  ```swift
  var name = "Acho"
  var name = "acho"

  /* console
  Syntax error on line 2
  "name" is already defined

  2  |  var name = "acho"
            ~~~~
  */
  ```

- **Fixes various bugs**

### Update 1.2

- **comments**
  ```swift
  // this is a comment
  ```
- `+=` `-=` `*=` `/=` `++` **syntax sugar**
  ```swift
  var variable = 10

  variable++

  variable += 1
  variable -= 2
  variable *= 2
  variable /= 4
  ```
- **Static functions**

  ```swift
  struct SoundManager {
      static var volume = 10
      static var sounds = [
          Sound()
          Sound()
          Sound()
      ]

      static var playSound(index) {
          SoundManager.sounds[index].play()
      }
  }

  SoundManager.playSound(2)
  ```

- **Changed 'input' to 'prompt'**
  ```swift
  prompt "what's your name"
  ```
- **Modules and importing**

  ```swift
  // io.kg
  // ---------------------------
  func print(value) {
      log value
  }

  func input(q) {
      var result
      prompt q -> result
      return result
  }
  // ---------------------------

  // test.kg
  // ---------------------------
  import io

  var name = io.input("what's your name? ")
  io.print("hello, " + name + "!")
  // ---------------------------

  /* console
  what's your name? acho
  hello, acho!
  */
  ```

- **Better execution of kang2 scripts**
  - `node app.js <your kang2 script>.kg`
- **Visual Studio Code extension**
  - Get decent syntax highlighting and icons by downloading the Kang2 VSC extension from the extension store!

### Update 1.3

- **Primitive types**

  - Every variable has a type with standard functions (std folder)

  ```swift
  var string = "hey"
  log string.split()

  func log_char(char) {
      log char
  }

  string.split().foreach(log_char)
  ```

- **Active references**

  - Reference values with `&`, which will bind the reference to the original variable, making changing one, reflect the changes on both
  - Unreferencing values with `@`, to get the actual value and change it unrelated to the original variable

  ```swift
  var value = 10
  var ref = &value

  value = 20
  log @ref

  ref = 30
  log value

  log @ref + 10
  ```

  ```
  [console]
  20
  30
  40
  ```

- **Advanced loop**
  - More advanced loops
  ```swift
  loop var i = 0, i < 10, i++ {
      log i
  }
  ```
- **Fixed a bunch of problems with the syntax highlighting**
- **Fixed lots of bugs, making the language more stable**
- **Made a small std library for most types**
