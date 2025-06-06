window.NotImplementedError = class NotImplementedError extends Error {
  constructor() {
    super("The method is not implemented.");
    this.name = "NotImplementedError";
  }
};

window.GlobalErrorHandler = {
  handled: false,
  cleanStart: false,
  onerror(event) {
    if (this.handled) return;
    this.handled = true;
    if (!this.cleanStart) {
      document.getElementById("loading").style.display = "none";
      requestAnimationFrame(() => this.crash(event));
      return;
    }
    this.stopGame();
    this.crash(event);
  },
  stopGame() {
    GameKeyboard.disable();
    GameIntervals.stop();
    function clearHandles(set, clear) {
      // eslint-disable-next-line no-empty-function
      let id = set(() => {}, 9999);
      while (id--) {
        clear(id);
      }
    }
    clearHandles(setInterval, clearInterval);
    clearHandles(setTimeout, clearTimeout);
    clearHandles(requestAnimationFrame, cancelAnimationFrame);
  },
  crash(message) {
    if (window.GameUI !== undefined && GameUI.initialized) {
      Modal.message.show(`${messages[Math.floor(Math.random() * messages.length)]} <br>${message} <br>Check the console for more details`, {}, 3);
    }
    // eslint-disable-next-line no-debugger
    debugger;
  }
};

window.onerror = (event, source) => {
  if (!source.endsWith(".js")) return;
  GlobalErrorHandler.onerror(event);
};

const messages = ['Bruh', 'Did you do that?', 'What were you thinking', 'The dev made an oopsy and crashed your game', 'My bad',
  'Umm', 'Are you gonna send me that so i can fix it?', 'LOL', 'You should probably stop trying to do that', "That's not my falt",
]
