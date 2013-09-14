module.exports = (function () {

  function Solenoid (subject) {
    this.subject = subject;
  };

  Solenoid.prototype.open = function () {
    return this.subject.onNext(255);
  };

  Solenoid.prototype.close = function() {
    return this.subject.onNext(0);
  };

  return Solenoid;

})();