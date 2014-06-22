(function (root) {
  var Game = root.Game = (root.Game || {});

  var LightsOut = Game.LightsOut = function () {
    this.DELTAS = [ [1, 0], [0, 1], [-1, 0], [0, -1] ];

    this.board = LightsOut.createBoard(); 
    this.randomizeBoard();
  }

  _(LightsOut).extend({
    createBoard: function() {
      var board = [];

      for(var i = 0; i < 5; i++) {
        var row = [];

        for(var j = 0; j < 5; j++) {
          row.push(false);
        }

        board.push(row);
      };

      return board;
    }, 

    isOnBoard: function(x, y) {
      return (0 <= x && x < 5 && 0 <= y && y < 5);
    },

    randomPosition: function() {
      return [Math.floor(Math.random()*5), Math.floor(Math.random()*5)];
    },


  });

  _(LightsOut.prototype).extend({
    toggle: function(x, y) {
      var board = this.board;

      board[x][y] = !board[x][y];

      _(this.DELTAS).each(function(direction) {
        var newX = x + direction[0];
        var newY = y + direction[1];

        if (LightsOut.isOnBoard(newX, newY)) {
          board[newX][newY] = !board[newX][newY];
        };
      });

      return true;
    },

    randomizeBoard: function() {
      var board = this.board;

      for(var i = 0; i < 16; i++) {
        var position = LightsOut.randomPosition();

        this.toggle(position[0], position[1]);
      };

      return true;
    },

    isWon: function() {
      return _.every( _(this.board).flatten(), function(t) {
        return t === false;
      });
    }
  });
})(window);

(function (root) {
  var Game = root.Game = (root.Game || {});

  var LightsOutUI = Game.LightsOutUI = function ($boardEl) {
    this.$boardEl = $boardEl;

    this.lightsOut = new Game.LightsOut;
    this.board = this.lightsOut.board;

    this.totalClicks = 0;

    this.render();

    var that = this;

    $boardEl.click('li', function(event) {
      that.totalClicks += 1;

      $(".clicks").text("Total clicks: " + that.totalClicks);

      var $t =$(event.target);

      var x = $t.data('row');
      var y = $t.data('col');

      that.lightsOut.toggle(x,y);
      that.render();

      if(that.lightsOut.isWon()) {
        $('.messages').text("You've won!")
        $boardEl.off('click');
      }
    });
  };

  _(LightsOutUI.prototype).extend({
    render: function() {
      var $ul = $('<ul class="group">');

      for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 5; j++) {
          var li = '<li data-row="' + i + '" data-col="' + j;

          if(this.board[i][j]) {
            li += '" class="litUp">';
          } else {
            li += '">';
          };

          var $li = $(li);
          $ul.append($li);
        }        
      };

      this.$boardEl.html($ul);
    }
  });
})(window);