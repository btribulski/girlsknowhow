// ticketyboo Ticker object
function ticker(delta, id, direction, count, distance, interval, transition_events, transition_distance, pause_events, offset) {
   // ticker parameters
   this.delta = delta; // block delta from Drupal
   this.id = id; // id of the moving element
   this.direction = direction; // direction of movement
   this.count = count; // number of items in the ticker
   this.distance = distance; // distance to move each item
   this.interval = interval; // ticker interval
   this.transition_events = transition_events; // number of ticks to move the item
   this.transition_distance = transition_distance; // amount to move the item each tick
   this.pause_events = pause_events; // number of ticks in the pause event
   this.offset = offset; // initial starting point for ticker
   // current status of the ticker
   this.wrapper = id+'_wrapper';
   this.item = 0; // the current item being displayed
   this.status = 'initpause'; // initpause, pause, initmove, move
   this.events = 0; // number of events to go in the current status
   this.position = 0 // current position in ticker
   ticketypause[delta] = false;
   window.setInterval('tickevent('+delta+')', interval);
}

// array of tickers
var tick = new Array();
var ticketypause = new Array();

// perform the tick event
function tickevent(delta) {
   if (!ticketypause[delta]) {
      t = tick[delta];
      switch (t.status) {
         case 'initpause':
            tick[delta].events = t.pause_events;
            tick[delta].status = 'pause';
            tick[delta].position = t.item * t.distance;
            tickpos(delta);
            break;
         case 'pause':
            tick[delta].events = tick[delta].events - 1;
            if (tick[delta].events == 0) {
               tick[delta].status = 'initmove';
            }
            break;
         case 'initmove':
            tick[delta].events = t.transition_events;
            tick[delta].status = 'move';
            break;
         case 'move':
            tick[delta].position = tick[delta].position + t.transition_distance
            tick[delta].events = tick[delta].events - 1;
            tickpos(delta);
            if (tick[delta].events == 0) {
               tick[delta].status = 'initpause';
               tick[delta].item = tick[delta].item + 1;
               if (tick[delta].item == tick[delta].count) {
                  tick[delta].item = 0;
               }
            }
            break;
      }
   }
}

// position the element
function tickpos(delta) {
   t = tick[delta];
   pos = 0 + tick[delta].position-tick[delta].offset;
   pos = 0 - pos;
   if (t.direction == 'horizontal') {
      document.getElementById(t.wrapper).style.marginLeft = pos + 'px';
   } else {
      document.getElementById(t.wrapper).style.marginTop = pos + 'px';
   }
}
