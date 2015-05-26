# AI Final Project

This is our repository for AI final project\!

## Project Title

**阿嘎打伊唷**

## Project Description

A Google Chrome extension for invincible AI on agar.io, a popular web-based game.

## Team Members

* sycLin
* lunaivory
* cathook
* benchou1919

## Weekly Meeting

* 3 times/week
* 1 hour each time

- [x] syncing up each other's tool
- [x] discuss problem encountered and solution found
- [x] new job assignments
- [x] improvements on algorithms

## Milestones

|Milestones|Goal|Period|
|:---------|:---|:-----|
|Milestone #1|Create a crazy AI player that can be manipulated by the designated program.|2 weeks|
|Milestone #2|At least 3 strategies to control the AI agent.|2 weeks|
|Milestone #3|Construct an ultimate AI agent.|1 week|

## Workload Distribution

**Milestone #1**

|Member|Responsibility|Priority|Done?|
|:-----|:-------------|:------:|:---:|
|sycLin|Complete the Interface|1|**DONE**|
|lunaiovry|Complete the Interface|1|**DONE**|
|cathook|Build Framework for Interface|0|**DONE**|
|benchou1919|Contruct a crazy AI|2|**DONE**|


**Milestone #2**

|Member|Responsibility|Priority|Done?|
|:-----|:-------------|:------:|:---:|
|sycLin|GONGJIGUAY|1|*on-going*|
|lunaivory|ESIGUAY|1|*on-going*|
|cathook|APIs + EDEDANXIAOGUAY|0 + 1|*on-going*|
|benchou1919|GONGJIGUAY|1|*on-going*|


**Milestone #3**

|Member|Responsibility|Priority|Done?|
|:-----|:-------------|:------:|:---:|
|sycLin| | | |
|lunaivory| | | |
|cathook| | | |
|benchou1919| | | |

## APIs for creating AI agent

```javascript
// Sets the target position. pos: an instance of api.Position. useWindowCoord: optional, indicating whether pos is window coordinate or not.
api.setTargetPosition = function(pos, useWindowCorrd);
// Splits the agent.
api.split = function();
// Lets the agent attack by throwing a little circle.
api.attack = function();
// Gets our agent's information.
api.getSelf = function();
// Gets foods information. Returns a list of instances of api.CircleInfo.
api.getFoods = function();
// Gets spikes information. Returns a list of instances of api.CircleInfo.
api.getSpikes = function();
// Gets opponents information. Returns a list of api.Player.
api.getOpponents = function();
// Gets all information, including self, spikes, foods, opponents. Returns a dict.
api.getAll = function();
// Gets the map size. Returns the coordinate of the buttom-right corner.
api.getWorldSize = function();
// Gets the dangerous range. Returns the max distance the bad guy can boost if it splits.
api.getDangerRadius = function();
// Gets radius if splitted. Parameter "radius": current radius. Return a number.
api.getSplittedRadius = function(radius);
// Gets the window size. Returns an instance of math.Vector2D where x=width, y=height.
api.getWindowSize = function();
// Transforms the window coord to the world coordinate. coord: the window coordinate.
api.toWorldCoord = function(coord);
```

## Potential strategies for our agent

|Strategy Name|Who|Description|
|:------------|:--|:----------|
|ESIGUAY|L|eats as many pieces of food as possible.|
|DANXIAOGUAY|?|tries to keep a certain distance against enemies bigger than self.|
|EDEDANXIAOGUAY|C|a mixture of DANXIAOGUAY and ESIGUAY.|
|GONGJIGUAY|S|tries to eliminate enemies within a certain range.|

## Coding style
* [Google JavaScript coding style guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

