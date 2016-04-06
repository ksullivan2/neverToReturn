# Never To Return
*You're lost in an ancient and mysterious wood... get out before you go mad!*

**IN PROGRESS!**
Current "production build" lives at https://nevertoreturn.herokuapp.com/  
This repo may contain unstable commits.

## Game Rules
Coming soon...

## Technical Notes
####JSON API for Cards: [**JSON syntax guide**](https://docs.google.com/document/d/1hS38KcjNmm6i4NQlNZo44gbabTOJXdh_yg72WQfPOSQ/edit?usp=sharing)  
*Never to Return* (the card game) is currently in development, and this online version is intended to be a remote playtesting tool. Therefore, as much as possible, the goal of this project is to allow the game's creator to experiment with different aspects of gameplay without relying on a developer to make changes to the game. 

I developed a non-programmer-friendly API for the cards, which allows the creator of the game to write and edit cards without ever touching "code." It also allows for infinitely nested events on the cards and effects that happen based on user interaction or other game logic, giving the creator a lot of freedom to be creative in his card creation. The link above contains the in-progress documentation for this API.


####Rules Engine
The gameplay is driven by a queuing system that allows events from the cards to be prioritized according to the game's rules. Once the players hit "Start Game," every game interaction is passed through this engine.

The priority is based on events being allocated into one of four queues. The first event from the first non-empty queue is processed. If all queues are empty, it is the end of the player's turn.

  1. *Immediate Effects:* events that jump the normal queues, such as the resolutions of nested events
  2. *Terrain Effects:* As players move onto each "space" on the game board, the effects of each terrain and monster card on the space are resolved from the bottom up. 
  3. *Player Actions:* After terrain effects resolve, the player may choose to play a card or perform one of the standard actions. They may earn more action opportunities throughout their turn.
  4. *End Turn Actions:* Standard checks and resolutions for the end of the player's turn.

The events are processed once per second, allowing players to follow along, although certain types of events may bypass the timeout (such as those that chain together to create the experience of a single event for the user).

####Config Options:
As I find opportunities, I try to leave openings for configuration files that will allow the game to be tweaked and experimented on. Currently, there are a few gameplay config options and one visual config option (more coming soon when the UI design is finalized and implemented).



---
*Never To Return: (card game and artwork) © Patrick Tsao, 2015-2016. All rights reserved.*  
*Never To Return Online: © Kaley Sullivan, 2016. All rights reserved.*




