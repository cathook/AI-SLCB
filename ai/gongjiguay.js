var ai = ai || {}; //!< namespace ai

ai.gongjiguay = ai.gongjiguay || {}; //!< namespace ai.gongjiguay

//! Starts to use this agent.
ai.gongjiguay.start = function() {
	;
};


//! Stops using this agent.
ai.gongjiguay.stop = function() {
	ai.gongjiguay._runFlag = false;
	api.removeMark(ai.gongjiguay._targetPoint);
};

// need some arguments?
ai.gongjiguay.getAttackTargetPosition = function() {
	;
};

ai.gongjiguay._run = function() {
	;
};

ai.gongjiguay._targetPoint = null;