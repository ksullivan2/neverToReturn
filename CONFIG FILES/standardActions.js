//These are the "standard player actions" that are allowed on each turn 
//"buttonText" is what will show to the user

//these are the actions that will happen on EVERY turn
var turnActions = {
	immediate: 
	[
		{
			"type": "desperationCheck"
		}
	],

	terrain: [],

	playerActions: 
	[
		{
			"type": "choosePlayerAction"
		}
	],

	endTurn: 
	[
		{
			type: "checkForLostPlayers"
		},
		{
			type:"addDrawCardsEvent"
		}
	]


}

//These are the actions that are available to the user as standard actions each turn.
//if any of the ALL_CAPS names change, they must be changed in both server and gameLogic files!
var standardPlayerActions = {
	MOVE_FORWARD:  
	{
		"buttonText": "Move Forward",
		"actions": 
		[
			{
				"type": "move",
				"direction": "forward"
			}
		]
	},

	MOVE_BACKWARD:  
	{
		"buttonText": "Move Backward",
		"actions": 
		[
			{
				"type": "move",
				"direction": "backward"
			}
		]
	},

	ACTION_CARD:
	{
		"buttonText": "Play Action Card",
		"actions": 
		[
			{
				"type": "playActionCard"
			}
		]
	},

	DISCARD_AND_DRAW: 
	{
		"buttonText": "Discard 1, Draw 1",
		"actions": 
		[
			{
				"type": "discard"
			},
			{
				"type": "draw",
				"value": 1
			}
		]
	},

	TRADE_MENACE_FOR_MONSTER:
	{
		"buttonText": "Heal 2 P/M, Create Monster",
		"actions": 
		[

		]
	},

	REFILL_HAND:  
	{
		"buttonText": "Take 1P, 1M, Refill Hand",
		"actions": 
		[
			{
				"type": "pain", 
				"value": -1
			},
			{
				"type": "madness",
				"value": -1
			},
			{
				"type": "refillHand"
			}
		]
	}

}

module.exports = {standardPlayerActions: standardPlayerActions, turnActions: turnActions}
