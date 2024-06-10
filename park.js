document.addEventListener('DOMContentLoaded', () => {
    const parkingLot = document.getElementById('parking-lot');
    const totalChargesElement = document.getElementById('total-charges');
    const totalCollectedElement = document.getElementById('total-collected');
    const spacesLeftElement = document.getElementById('spaces-left');

    let totalCollected = parseInt(localStorage.getItem('totalCollected')) || 0;
    let slots = JSON.parse(localStorage.getItem('slots')) || [
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'small', booked: false, startTime: null },
        { type: 'large', booked: false, startTime: null },
        { type: 'large', booked: false, startTime: null },
        { type: 'large', booked: false, startTime: null },
        { type: 'large', booked: false, startTime: null },
        { type: 'large', booked: false, startTime: null },
    ];

    function renderSlots() {
        parkingLot.innerHTML = '';
        let spacesLeft = 0;
        slots.forEach((slot, index) => {
            const slotElement = document.createElement('div');
            slotElement.className = `slot ${slot.booked ? (isOvertime(slot) ? 'overtime' : 'booked') : 'free'}`;
            slotElement.textContent = index + 1;
            slotElement.onclick = () => {
                if (!slot.booked) {
                    document.getElementById('slot-number').value = index + 1;
                }
            };
            parkingLot.appendChild(slotElement);
            if (!slot.booked) spacesLeft++;
        });
        spacesLeftElement.textContent = spacesLeft;
        totalCollectedElement.textContent = totalCollected;
    }

    function isOvertime(slot) {
        if (!slot.booked || !slot.startTime) return false;
        const elapsedMinutes = (new Date().getTime() - slot.startTime) / (1000 * 60);
        return elapsedMinutes > 30;
    }

    window.bookSlot = function () {
        const slotNumber = document.getElementById('slot-number').value;
        if (slotNumber < 1 || slotNumber > 15) {
            alert('Invalid slot number');
            return;
        }
        const slot = slots[slotNumber - 1];
        if (slot.booked) {
            alert('Slot already booked');
            return;
        }
        slot.booked = true;
        slot.startTime = new Date().getTime();
        const charge = slot.type === 'small' ? 60 : 100;
        totalChargesElement.textContent = parseInt(totalChargesElement.textContent) + charge;
        totalCollected += charge;
        localStorage.setItem('slots', JSON.stringify(slots));
        localStorage.setItem('totalCollected', totalCollected);
        renderSlots();
    };

    window.freeSlot = function () {
        const slotNumber = document.getElementById('slot-number').value;
        if (slotNumber < 1 || slotNumber > 15) {
            alert('Invalid slot number');
            return;
        }
        const slot = slots[slotNumber - 1];
        if (!slot.booked) {
            alert('Slot is already free');
            return;
        }
        const endTime = new Date().getTime();
        const elapsedMinutes = (endTime - slot.startTime) / (1000 * 60);
        let extraCharge = 0;
        if (elapsedMinutes > 30) {
            extraCharge = Math.ceil((elapsedMinutes - 30) / 60) * 15;
        }
        const charge = slot.type === 'small' ? 60 : 100;
        const totalCharge = charge + extraCharge;
        alert(`Total charge for slot ${slotNumber}: ${totalCharge} USD`);
        totalChargesElement.textContent = parseInt(totalChargesElement.textContent) - charge;
        totalCollected += extraCharge;
        slot.booked = false;
        slot.startTime = null;
        localStorage.setItem('slots', JSON.stringify(slots));
        localStorage.setItem('totalCollected', totalCollected);
        renderSlots();
    };

    window.refresh = function () {
        location.reload();
    };

    window.validateSlotCharges = function () {
        slots.forEach((slot, index) => {
            if (slot.booked && slot.startTime) {
                const elapsedMinutes = (new Date().getTime() - slot.startTime) / (1000 * 60);
                const charge = slot.type === 'small' ? 60 : 100;
                let extraCharge = 0;
                if (elapsedMinutes > 30) {
                    extraCharge = Math.ceil((elapsedMinutes - 30) / 60) * 15;
                }
                const totalCharge = charge + extraCharge;
                console.log(`Slot ${index + 1}: Total charge = ${totalCharge} USD`);
            }
        });
    };

    renderSlots();
});
