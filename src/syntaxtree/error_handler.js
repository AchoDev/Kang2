
function raiseError(error, lines, line, startchar, endchar)  {
  console.log('\nSyntax error on line ' + (line + 1))
  console.log(`${error}\n`)

  console.log(line + 1, " | ", lines[line])
  
  const buffer = " ".repeat(line.toString().length)
  console.log('\x1b[31m' , "   " + buffer, lines[line].split("").map((char, index) => index >= startchar && index <= endchar ? "~" : " ").join(""), '\x1b[37m')

  process.exit(0)
}

module.exports = raiseError