import css from './main.scss';

class Terminal {
  constructor() {
    this.$terminal = document.querySelector('.terminal');
    this.$input = document.querySelector('.terminal__input');
    this.$output = document.querySelector('.terminal__output');
    this.$caret = document.querySelector('.terminal__input:after');
    this.history = [];
    this.historyPosition = 0;
    this.errors = {
      command_not_found: 'bash: Command not found: ',
      cat: 'cat: No such file or directory: ',
      ls: 'ls: No such file or directory: ',
      help: `\nType 'help' for a list of commands`
    }

    this.attachEventHandlers();
  }

  attachEventHandlers() {
    const {
      $terminal,
      $input
    } = this;

    $terminal.addEventListener('click', () => {
      $terminal.classList.add('is-active');
      this.focus();
    });

    document.addEventListener('click', (e) => {
      const $target = e.target;

      if ($terminal.contains($target)) return;
      $terminal.classList.remove('is-active');
    });

    $input.addEventListener('mousedown', (e) => e.preventDefault());

    $input.addEventListener('keydown', (e) => {
      const input = $input.innerText;
      const keyCodes = {
        enter: 13,
        left: 37,
        up: 38,
        right: 39,
        down: 40
      };

      if (e.keyCode === keyCodes.left || e.keyCode === keyCodes.right) return;
      if (e.keyCode === keyCodes.up) this.showHistory('up');
      if (e.keyCode === keyCodes.down) this.showHistory('down');
      if (e.keyCode === keyCodes.enter) {
        e.preventDefault();
        this.clearInput();
        this.print(input, true);
        if (input) {
          this.interpreter(input);
          this.updateHistory(input);
        }
        $input.blur();
        $input.focus();
      }
    });
  }

  focus() {
    this.$input.focus();

    // If contenteditable div has content, insert caret at end of content
    // fromhttps://stackoverflow.com/a/4238971
    if (
      typeof window.getSelection != "undefined" &&
      typeof document.createRange != "undefined"
    ) {
      var range = document.createRange();
      range.selectNodeContents(this.$input);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(this.$input);
      textRange.collapse(false);
      textRange.select();
    }
  }

  interpreter(input) {
    const command = input.split(' ')[0];
    const argument = input.split(' ')[1];

    switch (command) {
      case '':
        this.print('&nbsp;');
        break;
      case 'ls':
        this.list(argument);
        break;
      case 'cat':
        this.cat(argument);
        break;
      case 'clear':
        this.clearOutput();
        break;
      case 'echo':
        this.echo(argument);
        break;
      case 'help':
        this.help();
        break;
      default:
        this.print(`${this.errors.command_not_found} ${command} ${this.errors.help}`);
        break;
    }
  }

  list(input) {
    switch (input) {
    case '':
        return this.print('<table>\n  <tr>\n    <td>about.txt</td>\n    <td>contact.txt</td>\n  </tr>\n</table>');
        break;
    case "/":
        return this.print('<table>\n  <tr>\n    <td>about.txt</td>\n    <td>contact.txt</td>\n  </tr>\n</table>');
        break;
    case ".":
        return this.print('<table>\n  <tr>\n    <td>about.txt</td>\n    <td>contact.txt</td>\n  </tr>\n</table>');
        break;
    case undefined:
        return this.print('<table>\n  <tr>\n    <td>about.txt</td>\n    <td>contact.txt</td>\n  </tr>\n</table>');
        break;
    default:
        return this.print(this.errors.ls + input);
        break;
    }
  }

  clearOutput() {
    this.$output.innerHTML = '';
  }

  echo(content) {
    if (content) {
      this.print(content);
    } else {
      this.print('');
    }
  }

  cat(input) {
    if (!input) return;

    const filename = input.split('.')[0];
    const fileExtension = input.split('.')[1];

    if (this.files()[filename]) {
      this.print(this.files()[filename].contents);
    } else {
      this.print(`${this.errors.cat} ${filename}${fileExtension ? `.${fileExtension}` : ''}`);
    }
  }

  help() {
    this.print(`<dl><dt>ls</dt>    <dd>-  Lists available files and directories</dd>\n<dt>clear</dt> <dd>-  Clears all console output</dd>\n<dt>cat</dt>   <dd>-  View contents of files - e.g. 'cat about.txt'</dd>\n</dl>`);
  }

  files() {
    return {
      contact: {
        contents: 'Email   : <a href="mailto:omg@lol.xxx">omg@lol.xxx</a>\nTwitter : <a href="https://www.twitter.com/innernets/">@innernets</a>\nGitHub  : <a href="https://www.github.com/m10l/">m10l</a>'
      },
      about: {
        contents: '<span class="word-wrap">A front end developer with over five years of agency experience and working with startups,\nspecialising in designing and building user interfaces for digital products and mobile apps.\n<br><br>\nCurrently working as a UI Engineer at <a href="http://www.contentful.com/" target="_blank">Contentful</a> in Berlin.\n<br><br>\nTechnologies: HTML5, Sass, JavaScript, React, Angular, Ionic, Node.js, Express, PHP, Wordpress, Rails\n<br><br>\nHobbies / Interests: Photography, making music (<a href="https://soundcloud.com/hellotulips" target="_blank">SoundCloud</a>)\n</span>'
      }
    }
  }

  print(content, withPrompt) {
    const parser = new DOMParser();
    let markup;
    if (withPrompt) {
      markup = `<li><pre class="terminal__pre"><span class="terminal__input-prompt"></span>${content}</pre></li>`;
    } else {
      markup = `<li><pre class="terminal__pre">${content}</pre></li>`;
    }
    const output = parser.parseFromString(markup, 'text/html');

    this.$output.appendChild(output.querySelector('li'));
    this.$terminal.scrollTop = this.$terminal.scrollHeight;
  }

  clearInput() {
    this.$input.innerHTML = '';
  }

  updateHistory(input) {
    this.history.push(input);
    this.historyPosition = 0;
  }

  showHistory(key) {
    if (this.history.length) {
      if (key === 'up') {
          if (this.historyPosition === this.history.length) return;
          this.historyPosition++
        }

        if (key === "down") {
          if (this.historyPosition <= 1) return;
          this.historyPosition--
        }
      this.$input.innerText = this.history[this.history.length - this.historyPosition];
    }
  }
}

new Terminal();
