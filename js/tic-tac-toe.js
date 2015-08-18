var TicTacToe = {
  isPlayer1Turn: true,
  turnsPassed: 0,

  aiMode: true,

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

  completeXTurn: function( position, element ) {
    $(position).html("<p>X</p>");
    TicTacToe.xCombination.push( element );
    TicTacToe.checkWin( TicTacToe.xCombination );
    TicTacToe.isPlayer1Turn = false;
  },  

  completeOTurn: function( position, element ) {
    $(position).html("<p>O</p>");
    TicTacToe.oCombination.push( element );
    TicTacToe.checkWin( TicTacToe.oCombination );
    TicTacToe.isPlayer1Turn = true;
  },  

  aiSetTile: function() {
    var $box = $(".box");
    $middle = $($box[4]);

    if ( $middle.is(":empty") ) {
      TicTacToe.completeOTurn($middle, 5);
    } else {
      while ( TicTacToe.isPlayer1Turn === false ) {
        var i = Math.ceil(Math.random() * 9);
        var $randomBox = $($box[ i - 1 ]);

        if ( $randomBox.is(":empty") ) {
          console.log("Tile Set on i: " + i);
          TicTacToe.completeOTurn($randomBox, i);
          TicTacToe.isPlayer1Turn = true;
          console.log(TicTacToe.isPlayer1Turn);
        }
      }
    }

  },

  runAITurn: function() {
    for ( var x = 0; x < (TicTacToe.winCombinations.length) && (TicTacToe.isPlayer1Turn === false); x++ ) {
      var $winCombinations = $(TicTacToe.winCombinations[x]);
      var complete = $winCombinations.not(TicTacToe.xCombination).get();
      var $box = $(".box");

      if (complete.length === 1) {
        console.log("Counter!");
        var $aiComparison = $($box[ complete[0] - 1  ]);

        if ( $aiComparison.is(':empty') ) {
          TicTacToe.completeOTurn($aiComparison, complete[0]); 
        } else { 
          TicTacToe.aiSetTile();
        }

      } else if ( x === TicTacToe.winCombinations.length - 1 ) {
        TicTacToe.aiSetTile();
      }
    }
  },

  resetBoard: function () {
    TicTacToe.xCombination = 	[];
    TicTacToe.oCombination = 	[];
    TicTacToe.turnsPassed = 	0;
    TicTacToe.isPlayer1Turn = true;

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
          alert("WINNER: PLAYER X");
        } else {
          alert("WINNER: PLAYER O");
        }
        TicTacToe.resetBoard();
        return true; // break out of Check Win / Skip Checking Turns
      } 
    }

    TicTacToe.checkTurns();
    console.log("Turns Passed: " + TicTacToe.turnsPassed);
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
      if ( TicTacToe.isPlayer1Turn || TicTacToe.aiMode ) {
        TicTacToe.completeXTurn($box, index);

        if ( TicTacToe.aiMode ) {
          TicTacToe.runAITurn();
        }

      } else {
        TicTacToe.completeOTurn($box, index);
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
