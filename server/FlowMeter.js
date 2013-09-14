module.exports = (function () {

  function FlowMeter (subject) {
    this.subject = subject;
  };

  FlowMeter.prototype.getFlow = function() {
    return this.subject.asObservable();
  };

  return FlowMeter;

})();