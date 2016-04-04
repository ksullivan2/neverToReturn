# Never To Return
*You're lost in an ancient and mysterious wood... get out before you go mad!*

**IN PROGRESS!**
Current "production version" lives at https://nevertoreturn.herokuapp.com/  
This repo may contain unstable commits.

## Game Rules
Coming soon...

## Technical Notes
####JSON System for Cards: [**JSON syntax guide**](https://docs.google.com/document/d/1hS38KcjNmm6i4NQlNZo44gbabTOJXdh_yg72WQfPOSQ/edit?usp=sharing)  
*Never to Return* is currently in development. As such, it was important that the game's creator is able to add new cards to the game and edit existing ones.

I developed a custom JSON syntax for the cards which allows each card to have any number of nested events. At runtime, the top level events are parsed, and any nested events are added to the queue, often after user interaction.  


####Queue System
The action of the game is driven by a 4 different events queues. As cards are played or effects are resolved, events are added to the appropriate queue to be processed at a later time:
  1. Immediate Effects: events that jump the normal queues, such as the resolutions of nested events
  2. Terrain Effects: As players move onto each "space" on the game board, the effects of each terrain and monster card on the space are resolved from the bottom up. 
  3. Player Actions: After terrain effects resolve, the player may choose to play a card or perform one of the standard actions. They may earn more action opportunities throughout their turn.
  4. End Turn Actions: Standard checks and resolutions for the end of the player's turn.

The queue processing is simple: the first event from the first non-empty queue is processed. If all queues are empty, it is the end of the player's turn.

For easier player comprehension, the events are processed once per second, although certain types of events may bypass the timeout (such as those that chain together to create the experience of a single event for the user).

####Config Files:
As much as possible, the goal of this project is to allow the game's creator to maintain creative control. As I find opportunities, I try to leave openings for configuration files that will allow the game to be tweaked and experimented on. Currently, there are only a few visual config options, but I anticipate that more are on their way soon.



---
*Never To Return: (card game and artwork) © Patrick Tsao, 2015-2016. All rights reserved.*  
*Never To Return Online: © Kaley Sullivan, 2016. All rights reserved.*




