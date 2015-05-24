var ai = ai || {};  //! @namespace ai


/*!
 * @class Base class for an Agent.
 */
ai.Agent = function() {};

/*!
 * @function Intializes something.
 */
ai.Agent.prototype.init = function() {};

/*!
 * @function Cleans up.
 */
ai.Agent.prototype.cleanup = function() {};

/*!
 * @function Runs the agent.
 */
ai.Agent.prototype.run = function() {};


/*!
 * @function Initialize function.
 *
 * @param [in] util The depenedency module `util`
 * @param [in] math The depenedency module `math`
 * @param [in] mark The depenedency module `mark`
 * @param [in] api The depenedency module `api`
 */
ai.init = function(util, math, mark, api) {
  /*!
   * @function Starts the AI.
   */
  ai.start = function() {
    if (ai._stopFlag == true) {
      ai._stopFlag = false;
      if (ai._state == ai._State.NOTHING) {
        window.setTimeout(ai._mainLoop, 0);
      }
      ai._agent.init();
    }
  };


  /*!
   * @function Stops the AI.
   */
  ai.stop = function() {
    if (ai._stopFlag == false) {
      ai._stopFlag = true;
      ai._agent.cleanup();
    }
  };


  /*!
   * @function Sets the agent.
   *
   * @param [in] agent The agent.
   */
  ai.setAgent = function(agent) {
    if (ai._stopFlag == false) {
      ai.stop();
      ai._agent = agent;
      ai.start();
    } else {
      ai._agent = agent;
    }
  };


  /*!
   * @function Sets the time interval.
   *
   * @param [in] time The time interval.
   */
  ai.setTimeInterval = function(time) {
    ai._deltaTime = time;
  };


  /*!
   * @enum The state.
   *
   * @var NOTHING The ai is not start yet.
   * @var RUNNING The ai program is running.
   * @var PENDING The ai program is currently sleeping.
   */
  ai._State = new util.Enum('NOTHING', 'RUNNING', 'PENDING');


  /*!
   * @function Main loop.
   */
  ai._mainLoop = function() {
    if (ai._stopFlag) {
      ai._state = ai._State.NOTHING;
      return;
    }

    ai._state = ai._State.RUNNING;
    if (api.getSelf().circles.length > 0) {
      ai._agent.run();
    }

    ai._state = ai._State.PENDING;
    window.setTimeout(ai._mainLoop, ai._deltaTime);
  };


  /*!
   * @var The current state.
   */
  ai._state = ai._State.NOTHING;


  /*!
   * @var Time interval.
   */
  ai._deltaTime = 100;


  /*!
   * @var Whether the loop should stop or not.
   */
  ai._stopFlag = true;


  /*!
   * @var Handler.
   */
  ai._agent = new ai.Agent();
};
