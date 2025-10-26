const { Subject } = require('rxjs');

const bonusSubject = new Subject(); // observers subscribe to bonus events

function publishBonus(event) {
    // event = { employee_id, year, suggestedBonus }
    bonusSubject.next(event);
}

function subscribe(listener) {
    return bonusSubject.subscribe(listener);
}

module.exports = { publishBonus, subscribe };
