var Rx            = require('rx'),
    Rx            = require('./rx.gpio'),
    Rx            = require('./rx.helpers'),
    FlowEmulator  = require('./testing/FlowEmulator')
    ;

// // These are essentially behavior subjects, but they work against Gpio's
var solenoidSubject = new Rx.GpioSubject(1, 'out');
var flowMeterSubject = new Rx.GpioSubject(2, 'in');

// This essentially maps one subject to another using an optional mapping function
var flowEmulator = new FlowEmulator(solenoidSubject, flowMeterSubject);

// This holds the number of pours that havent happened yet
var pendingPours = new Rx.BehaviorSubject(0);

var flowStatus =
  flowMeterSubject
    .select(function (x) { return x > 127 ? 'open' : 'closed'})
    .distinctUntilChanged();

var flowBegins =
  flowStatus
    .where(function (x) { return x === 'open'; });

var flowStops =
  flowStatus
    .throttle(2000)
    .where(function (x) { return x === 'closed'; });

function greaterThanZero (x) { return x > 0; };
function decrement (pours) { return pours - 1; };

// So it's possible that this is all the logic we need.
pendingPours
  .filter(greaterThanZero)
  .take(1)
  .log('preparing pour. {{x}} pending pour(s).')
  .map(decrement)
  .onNextToObserver(pendingPours) // sideEffect
  .log(' - opening solenoid')
  .onNextToObserver(solenoidSubject, 255)  // sideEffect
  .waitUntil(flowBegins)
  .log(' - user started pouring')
  .waitUntil(
    Rx.Observable.amb(
      flowStops
        .log(' - user stopped pouring'),
      Rx.Observable.timer(10000)
        .log(' - pour timed out')
    ))
  .log(' - closing solenoid')
  .onNextToObserver(solenoidSubject, 0)  // sideEffect
  .waitUntil(flowStops)
  .log('pour complete. {{x}} pending pour(s) remain.')
  .delay(5000)
  .observeOn(Rx.Scheduler.timeout)
  .repeat() // magics
  .subscribe();

flowEmulator.subscribe();

pendingPours.onNext(3);

// Rx.Observable.timer(3000).subscribe(function (x) {
//   pendingPours.onNext(pendingPours.value + 1);
// });