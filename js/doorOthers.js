// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;

        buttons.forEach(function(b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });

        //Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var isGestureStarted = false;
    var secretFlagsPositions = [20, 80, 40];

    var flagNumberMap = {
        "line line_0": 0,
        "line line_1": 1,
        "line line_2": 2
    };

    var flagNumber;
    var checker = [false, false, false];

    var flags = [
        this.popup.querySelector('.line_0'),
        this.popup.querySelector('.line_1'),
        this.popup.querySelector('.line_2')
    ];

    flags.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointermove', _onButtonPointerMove.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerCancel.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerCancel.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        isGestureStarted = true;
        e.target.setPointerCapture(e.pointerId);

        flagNumber = flagNumberMap[e.target.className];
    }

    function _onButtonPointerMove(e) {
        if (!isGestureStarted) {
            return;
        }

        var flagPosition = e.clientX;

        if ((flagPosition / e.target.offsetWidth) * 100 < secretFlagsPositions[flagNumber] + 10 && (flagPosition / e.target.offsetWidth) * 100 > secretFlagsPositions[flagNumber] - 10) {
            e.target.classList.add('line-right-flag-position');
            checker[flagNumber] = true;
        } else {
            e.target.classList.remove('line-right-flag-position');
            checker[flagNumber] = false;
        }

        this.popup.querySelector('.door-with-flags__flag_' + flagNumber).style.transform = 'translateX(' + flagPosition + 'px)';
    }

    function _onButtonPointerUp(e) {
        isGestureStarted = false;
        e.target.releasePointerCapture(e.pointerId);

        checkCondition.apply(this);
    }

    function _onButtonPointerCancel(e) {
        isGestureStarted = false;

        e.target.releasePointerCapture(e.pointerId);
    }

    function checkCondition() {
        var isOpened = true;

        for (var i = 0; i < checker.length; i++) {
            if (!checker[i]) {
                isOpened = false;
                break;
            }
        }

        //Если все три полоски стали зелеными, от откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var variants = ["12", "23", "13"];
    var variantsText = ["1↔2", "2↔3", "1↔3"];
    var randomCase = Math.floor(Math.random() * 3);
    var points = 0;
    var time = 10;
    var timerFired = false;
    var timerId;
    var popup = this.popup;

    this.popup.querySelector('.agility-door-additional-info').textContent = variantsText[randomCase];
    this.popup.querySelector('.agility-door-user-points').textContent = "Points: " + points;

    var buttons = [
        this.popup.querySelector('.agility-door__button_0'),
        this.popup.querySelector('.agility-door__button_1'),
        this.popup.querySelector('.agility-door__button_2')
    ];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('agility-door__button_pressed');
        checkCondition.apply(this);

        //После первого касания запускаем таймер
        if ((time === 10 || time === 0) && !timerFired) {
            timerFired = true;
            time = 10;

            //Запускаем таймер на 10 секунд
            timerId = setInterval(function() {
                time--;
                popup.querySelector('.agility-door-remained-time').textContent = time;

                if (time === 0) {
                    clearInterval(timerId);

                    if (points !== 10) {
                        alert("Time is out! Try again.");

                        timerFired = false;
                        points = 0;

                        popup.querySelector('.agility-door-remained-time').textContent = "Time: 10";
                        popup.querySelector('.agility-door-user-points').textContent = "Points: 0";

                        popup.classList.add('popup_hidden');
                    }
                }
            }, 1000);
        }
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('agility-door__button_pressed');
    }

    function checkCondition() {
        var pressedButtons = [];

        buttons.forEach(function(b, i) {
            if (b.classList.contains('agility-door__button_pressed')) {
                pressedButtons.push(i + 1);
            }
        });

        if (pressedButtons.length === 2) {
            if (pressedButtons.join("") === variants[randomCase]) {
                points++;
            } else {
                points--;
            }

            //Создаем новую требуемую комбинацию
            randomCase = Math.floor(Math.random() * 3);

            this.popup.querySelector('.agility-door-additional-info').textContent = variantsText[randomCase];
            this.popup.querySelector('.agility-door-user-points').textContent = "Points: " + points;
        }

        if (points === 10) {
            this.unlock();
        }
    }
}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var isGesturePressStarted = false;
    var isGestureMoveStarted = false;
    var startPosition = 0;
    var currentPosition = 0;

    var progressBar = this.popup.querySelector('.box-door-progress-bar');

    /**
     * Создаем отдельные обработчики для штурвала и секретной кнопки
     */
    var secretButton = this.popup.querySelector('.box-door-secret__button');
    secretButton.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
    secretButton.addEventListener('pointerup', _onButtonPointerUp.bind(this));
    secretButton.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
    secretButton.addEventListener('pointerleave', _onButtonPointerUp.bind(this));

    var circle = this.popup.querySelector('.box-door-circle');
    circle.addEventListener('pointerdown', _onCirclePointerDown.bind(this));
    circle.addEventListener('pointermove', _onCirclePointerMove.bind(this));
    circle.addEventListener('pointerup', _onCirclePointerUp.bind(this));
    circle.addEventListener('pointercancel', _onCirclePointerCancel.bind(this));
    circle.addEventListener('pointerleave', _onCirclePointerCancel.bind(this));

    function _onButtonPointerDown(e) {
        isGesturePressStarted = true;
    }

    function _onButtonPointerUp(e) {
        isGesturePressStarted = false;
    }

    function _onCirclePointerDown(e) {
        isGestureMoveStarted = true;
        startPosition = e.clientX;

        e.target.setPointerCapture(e.pointerId);
    }

    function _onCirclePointerUp(e) {
        isGestureMoveStarted = false;
        e.target.releasePointerCapture(e.pointerId);

        checkCondition.apply(this);
    }

    function _onCirclePointerCancel(e) {
        isGestureMoveStarted = false;
        e.target.releasePointerCapture(e.pointerId);
    }

    function _onCirclePointerMove(e) {

        if (!isGestureMoveStarted || !isGesturePressStarted) {
            return;
        }

        currentPosition += Math.max(0, e.clientX - startPosition);

        circle.style.transform = 'rotate(' + currentPosition / 50 + 'deg)';
        progressBar.style.background = 'linear-gradient(to right, #00f, #00f ' + currentPosition / 360 + '%, #fff 1%)';
    }

    function checkCondition() {
        if (currentPosition / 360 > 100) {
            this.unlock();
        }
    }

    this.showCongratulations = function() {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;
