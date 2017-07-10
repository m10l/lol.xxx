class Terminal {
  constructor() {
    this.$console = document.querySelector('.terminal');
    this.$input = document.querySelector('.terminal__input');
    this.$output = document.querySelector('.terminal__output');
    this.$caret = document.querySelector('.terminal__input:after');
    this.history = [];
    this.historyPosition = 0;
    this.errors: {
      command_not_found: 'bash: Command not found: ',
      cat: 'cat: No such file or directory: ',
      ls: 'ls: No such file or directory: ',
      help: `\nType 'help' for a list of commands`
    }

    this.observe();
  }

  observe() {
    this.$console.addEventListener('click', function() {
      this.$console.classList.add('active');
    });
  }

  focus() {

  }

  interpreter(t) {

  }

  commands() {

  }

  files() {

  }

  print() {

  }

  clearInput() {

  }

  updateHistory() {

  }

  showHistory() {

  }
}
