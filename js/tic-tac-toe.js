var TicTacToe = {
  isPlayer1Turn: true,
  turnsPassed: 0,
  allowClick: true,

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
          // console.log("Tile Set on i: " + i);
          TicTacToe.completeOTurn($randomBox, i);
          TicTacToe.isPlayer1Turn = true;
          // console.log(TicTacToe.isPlayer1Turn);
        }
      }
    }

    // Percentage for difficulty on ultimate move

  },

  runAITurn: function() {
    for ( var x = 0; x < (TicTacToe.winCombinations.length) && (TicTacToe.isPlayer1Turn === false); x++ ) {
      var $winCombinations = $(TicTacToe.winCombinations[x]);
      var complete = $winCombinations.not(TicTacToe.xCombination).get();
      var $box = $(".box");

      // console.log(TicTacToe.xCombination); // Problem is xCombination keeping old values..?

      if (complete.length === 1) {
        // console.log("Counter!");
        var $aiComparison = $($box[ complete[0] - 1  ]); // this line

        if ( $aiComparison.is(':empty') ) {
        //   console.log("Counter tile is EMPTY\n!")
        //   console.log("Counter is: " + $aiComparison[0] + "\n");
          TicTacToe.completeOTurn($aiComparison, complete[0]); 
        } else { 
          TicTacToe.aiSetTile();
        }

      }
    }

    // console.log("Player Turn = " + TicTacToe.isPlayer1Turn);
    // console.log("X = " + x);

    if ( (x === TicTacToe.winCombinations.length - 1) || (TicTacToe.isPlayer1Turn === false)) {
        // console.log("No Counter!");
        TicTacToe.aiSetTile();
    }

    TicTacToe.allowClick = true;
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
          // alert("WINNER: PLAYER X");
          RPG.attackMonster( "win" );
        } else {
          // alert("WINNER: PLAYER O");
          RPG.attackMonster( "loss" );
        }
        TicTacToe.resetBoard();
        return true; // break out of Check Win / Skip Checking Turns
      } 
    }

    TicTacToe.checkTurns();
    // console.log("Turns Passed: " + TicTacToe.turnsPassed);
  },

  checkTurns: function() {
    TicTacToe.turnsPassed += 1;

    if ( TicTacToe.turnsPassed === 9 ) {
      // alert("TIE");
      RPG.attackMonster( "draw" );
      TicTacToe.resetBoard();
    }
  },

  checkPlayerTurn: function( $box, index ) {
    if ($box.is(':empty') && TicTacToe.allowClick){
      if ( TicTacToe.isPlayer1Turn || TicTacToe.aiMode ) {
        TicTacToe.completeXTurn($box, index);

        if ( TicTacToe.aiMode ) {
          TicTacToe.allowClick = false;
          window.setTimeout(TicTacToe.runAITurn, 400);
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
//            RPG!
//////////////////////////////////////

var RPG = {
  player: {
    level:        1,
    maxHp:        100,
    hp:           100,
    exp:          0,
    expToLevel:   100
  },

  monster: {
    level:      1,
    maxHp:      100, 
    hp:         100,
    exp:        20 
  },

  updateBars: function() {
    var $expBar = $("#expBar");
    var $playerHP = $("#playerHPBar");
    var $monsterHP = $("#monsterHPBar");

    var maxWidth = 380;
    if ( RPG.player.exp ) {
      var newWidth = maxWidth * ( RPG.player.exp / RPG.player.expToLevel);
      $expBar.css("width", newWidth + "px");
    } else {
      $expBar.css("width", "1px");
    }

    if ( RPG.player.hp ) {
      var newWidth = maxWidth * ( RPG.player.hp / RPG.player.maxHp);
      $playerHP.css("width", newWidth + "px");
    } else {     
      $playerHP.css("width", "1px");
    }

    if ( RPG.monster.hp ) {
      var newWidth = maxWidth * ( RPG.monster.hp / RPG.monster.maxHp);
      $monsterHP.css("width", newWidth + "px");
    } else {
      $monsterHP.css("width", "1px");
    }

  },

  checkEXP: function() {
    if ( RPG.player.exp >= RPG.player.expToLevel ) {
      RPG.player.level += 1;
      RPG.player.exp = 0;   
      // Strength etc Up.  
      console.log("Leveled up! You are now level: " + RPG.player.level + "!");
    } else {
      var expNeededToLevel = RPG.player.expToLevel - RPG.player.exp;
      console.log(expNeededToLevel + "xp needed to level up.");
    }
    RPG.updateBars();
  },

  awardPlayer: function() {
    RPG.player.exp += RPG.monster.exp;
    RPG.checkEXP(); 
    // ITEM DROPS!!
  },

  attackMonster: function( result ) {
    var damage = Math.ceil(Math.random() * ((RPG.monster.maxHp) - (RPG.monster.maxHp / 2) + (RPG.monster.maxHp / 2)));

    if ( result === "win" ) {
      console.log("RIGHT IN THE FACE!");
      damage *= 2;
      damage = Math.floor(damage);
      RPG.monster.hp -= damage;
    } else if ( result === "loss" ) {
      console.log("Zac uses Zac Attack!");
      var playerDamage = Math.ceil(Math.random() * ((RPG.player.maxHp) - (RPG.player.maxHp / 2) + (RPG.player.maxHp / 2)));

      RPG.player.hp -= damage;
    } else if ( result === "draw" ) {
      RPG.monster.hp -= damage;
    } 

    if ( playerDamage ) {
      console.log("Zac dealt " + playerDamage + " damage to you!");
    } else {
      console.log("Dealt " + damage + " damage to Zac!");
    }

    if ( RPG.monster.hp <= 0 ) {
      console.log("Zac Died!");
      RPG.awardPlayer();
      RPG.generateMonster();
      console.log("New Zac appears!");
      console.log("Level: " + RPG.monster.level + "\nHP: " + RPG.monster.maxHp);
    } else {
      console.log("Zac HP: " + RPG.monster.hp);
    }
    
    RPG.updateBars();
  },

  generateMonster: function() {  
    var generatedLevel = Math.ceil(Math.random() * ((RPG.player.level + 5) - (RPG.player.level - 1) + (RPG.player.level - 1)));
    var generatedHp = Math.ceil(generatedLevel * 100 * (Math.random() * 2 + 1));
    var generatedBaseExp = Math.floor( (generatedLevel * 20 * (Math.random() * 2 + 1)) * (RPG.player.level / generatedLevel) );

    var generatedMonster = {
      level: generatedLevel,  
      maxHp: generatedHp,
      hp:    generatedHp, 
      exp:   generatedBaseExp  
    };

    RPG.monster = generatedMonster;   
    RPG.updateBars();
  },

  init: function() {
    console.log("Encountered Zac! \n Level: " + RPG.monster.level + "\nHP: " + RPG.monster.hp);
    RPG.updateBars();
  }
};

///////////////////////////////////////
// 		TIC TAC TOE START! 			//
//////////////////////////////////////

$(document).ready( function() { 
  TicTacToe.init();   
  RPG.init();
});

/////////////////
// TODO:
////////////////
/*
- Fix AI combination check
- RPG Element
  - EXP Bar
  - Strength and Defense Modifiers
  - Rework Formulas
*/

