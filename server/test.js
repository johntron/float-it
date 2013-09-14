var Rx            = require('rx'),
    Rx            = require('./rx.gpio'),
    Solenoid      = require('./Solenoid'),
    FlowMeter     = require('./FlowMeter'),
    FlowEmulator  = require('./FlowEmulator')
    ;

// // These are essentially behavior subjects, but they work against Gpio's
var solenoidSubject = new Rx.GpioSubject(1, 'out');
var flowMeterSubject = new Rx.GpioSubject(2, 'in');

// This essentiall maps one subject to another using a mapping function
var flowEmulator = new FlowEmulator(solenoidSubject, flowMeterSubject).subscribe();

// This holds the number of pours that havent happened yet
var pendingPours = new Rx.BehaviorSubject(0);

var flowStatus =
  flowMeterSubject
    .select(function (x) { return x > 127 ? 'open' : 'closed'})
    .distinctUntilChanged();

var flowBegins =
  flowStatus
    .where(function (x) { return x === 'open'; })
    .take(1);

var flowStops =
  flowStatus
    .throttle(2000)
    .where(function (x) { return x === 'closed'; });

var pourComplete = Rx.Observable.amb(
      flowStops.doAction(function () { console.log(' - user stopped pouring'); }),
      Rx.Observable.timer(10000)).doAction(function () { console.log(' - pour timed out'); });

// So it's possible that this is all the logic we need.
pendingPours
  .where(function (x) { return x > 0; })
  .take(1)
  .doAction(function (pours) {
    console.log('pour starting. ' + pours + ' pending pour(s).');
  })
  .select(function (pours) { return pours - 1; })
  .doAction(function (pours) { pendingPours.onNext(pours); })
  .doAction(function (pours) {
    console.log(' - opening solenoid');
    solenoidSubject.onNext(255);
  })
  .selectMany(function (pours) {
    return flowBegins.select(function () { return pours; });
  })
  .doAction(function (pours) {
    console.log(' - user started pouring');
  })
  .selectMany(function (pours) {
    return pourComplete.select(function () { return pours; });
  })
  .doAction(function (pours) {
    console.log(' - closing solenoid');
    solenoidSubject.onNext(0);
  })
  .doAction(function (pours) {
    console.log('pour complete. ' + pours + ' pending pour(s) remain.');
  })
  .delay(2000)
  .observeOn(Rx.Scheduler.timeout)
  .repeat() // magics
  .subscribe();

pendingPours.onNext(3);

Rx.Observable.timer(3000).subscribe(function (x) {
  pendingPours.onNext(pendingPours.value + 1);
});

// // var checkins = new Rx.Subject();

// // checkins
//   // .where(function (x) { return x > 0; })
//   // .take(1)
//   // .doAction(function () {
//   //   console.log('open');
//   // })
//   // // .selectMany(function () {
//   // //   return
//   // //     flowMeterSubject
//   // //       .where(function (x) { return x > 127 })
//   // //       .take(1)
//   // //       .selectMany(function (x) {

//   // //         var closed = flowMeterSubject
//   // //           .select(function (x) { return x > 127 ? 'open' : 'closed'; })
//   // //           .distinctUntilChanged()
//   // //           .throttle(2000)
//   // //           .where(function (x) { return x === 'closed' })
//   // //           .take(1);

//   // //         return Observable.amb(closed, Rx.Observable.timer(10000));
//   // //       });
//   // // })
//   // // .doAction(function () {
//   // //   console.log('closed');
//   // // })
//   // // .delay(2000)
//   // .repeat()
//   // .subscribe(function (x) {
//   //   console.log(x);
//   // });

//   // checkins.onNext(1);
//   // checkins.onNext(2);
