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
|sycLin|Complete the Interface|1|***not-yet***|
|lunaiovry|Complete the Interface|1|*not-yet*|
|cathook|Build Framework for Interface|0|*not-yet*|
|benchou1919|Contruct a crazy AI|2|*not-yet*|


**Milestone #2**

|Member|Responsibility|Priority|Done?|
|:-----|:-------------|:------:|:---:|
|sycLin| | | |
|lunaivory| | | |
|cathook| | | |
|benchou1919| | | |


**Milestone #3**

|Member|Responsibility|Priority|Done?|
|:-----|:-------------|:------:|:---:|
|sycLin| | | |
|lunaivory| | | |
|cathook| | | |
|benchou1919| | | |

## APIs for creating AI agent

```javascript
function getSelf(); // Returns the object of self.
function getOpponents(); // Returns the list of positions and sizes of the opponents within eyesight.
function getFoods(); // Returns the list of food objects.
function getSpikes(); // Returns the list of spike objects.
function nextPosition(); // Sends the next position to the server.
```

## Potential strategies for our agent

|Strategy Name|Description|
|:------------|:----------|
|ESIGUAY|eats as many pieces of food as possible.|
|DANXIAOGUAY|tries to keep a certain distance against enemies bigger than self.|
|HENEDEDANXIAOGUAY|a mixture of DANXIAOGUAY and ESIGUAY.|
|GONGJIGUAY|tries to eliminate enemies within a certain range.|
|ZHIZHANGGUAY|makes random moves.|
