var TicTacToe = {
  isPlayer1Turn: true,
  turnsPassed: 0,

  xCombination: [],
  oCombination: [],
  winCombinations: [
    [1,2,3],
    [4,5,6], // Horizontal
    [7,8,9],

    [1,5,9], // Diagonal
    [3,5,7],

    [1,4,7], // Vertical 
    [2,5,8],
    [3,6,9]
  ],

  resetBoard: function () {
    TicTacToe.xCombination = 	[];
    TicTacToe.oCombination = 	[];
    TicTacToe.turnsPassed = 	0;

    var $boxes = $(".box");

    $boxes.each( function() {
      $box = $( this );
      $box.empty();
    });
  },

  checkWin: function( combination ) {
    for ( var x = 0; x < TicTacToe.winCombinations.length; x++ ) {
      var $winCombinations = $(TicTacToe.winCombinations[x]);
      var complete = $winCombinations.not(combination).get();

      if (!complete.length) {
        if (TicTacToe.isPlayer1Turn) {
          alert("WINNER: PLAYER ZAC");
        } else {
          alert("WINNER: PLAYER NOT ZAC");
        }
        TicTacToe.resetBoard();
        return true; // break out of Check Win / Skip Checking Turns
      } 
    }

    TicTacToe.checkTurns();
  },

  checkTurns: function() {
    TicTacToe.turnsPassed += 1;

    if ( TicTacToe.turnsPassed === 9 ) {
      alert("TIE");
      TicTacToe.resetBoard();
    }
  },

  checkPlayerTurn: function( $box, index ) {
    if ($box.is(':empty')){
      if ( TicTacToe.isPlayer1Turn ) {
        $box.html("<p>Zac</p>");

        TicTacToe.xCombination.push(index);
        TicTacToe.checkWin( TicTacToe.xCombination );

        TicTacToe.isPlayer1Turn = false;
      } else {
        $box.html("<p>Not Zac</p>");

        TicTacToe.oCombination.push(index);
        TicTacToe.checkWin( TicTacToe.oCombination );

        TicTacToe.isPlayer1Turn = true;
      }
    }
  },

  setClickListener: function( box, index ) {
    var $box = $( box );
    $box.on("click", function () {
      TicTacToe.checkPlayerTurn($box, index);
    });
  },

  init: function() {
    var $boxes = $(".box");
    for ( var x = 0; x < $boxes.length; x++ ) {
      TicTacToe.setClickListener($boxes[x], (x + 1) );
    }

  }

};

///////////////////////////////////////
// 		TIC TAC TOE START! 			//
//////////////////////////////////////

$(document).ready( function() { 
  TicTacToe.init();
});
