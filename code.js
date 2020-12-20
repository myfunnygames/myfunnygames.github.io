let settings = {};
let state = {};

function save() {
    localStorage.setItem('settings', JSON.stringify(settings))
    localStorage.setItem('state', JSON.stringify(state))
}

function load() {
    $('#card-arrow').css('display', 'none');

    let task = tasks[state.level][state.player][state.number];
    if (task === undefined)
        return;

    if (Array.isArray(task)) {
        $('#card-text').text(task[0]);
        $('#card-arrow').css('display', 'block');
    } else $('#card-text').text(task);

    $('#card-icon').text(icons[state.player]);
    $('#card-number').text(state.number+1);

    save();
}

function load_second() {
    $('#card-arrow').css('display', 'none');

    let task = tasks[state.level][state.player][state.number];
    $('#card-text').text(task[1]);
}

function next() {
    state.player = settings.general.next[state.player];
    if (state.player === 'lion') {
        state.number += 1;
    }
    load();
}

function previous() {
    if (state.number === 0 && state.player === 'lion')
        return;

    state.number -= 1;
    next(); next();
}

function color_level() {
    let color = '#c67500';
    for (const level of ['l1', 'l2', 'l3', 'l4', 'l5']) {
        $('#'+level).css("background-color", color);
        if (level === state.level)
            color = '#bcbcbc';
    }
}

function set(level) {
    state.level = level;
    state.number = 0;
    state.player = 'lion';
    color_level();
    load();
}


document.addEventListener('readystatechange', () => {
    if (document.readyState !== 'complete') return;

    let stored_settings = localStorage.getItem('settings')
    if (stored_settings === null) {
        settings.general = {
            next: {
                lion: 'rabbit',
                rabbit: 'cat',
                cat: 'lion'
            }
        };
        settings.rabbit = {pieces_of_clothes: 5};
        settings.cat = {pieces_of_clothes: 5};
        settings.lion = {pieces_of_clothes: 5};
    }
    else settings = JSON.parse(stored_settings);

    let stored_state = localStorage.getItem('state');
    if (stored_state === null) set('l1');
    else {
        state = JSON.parse(stored_state);
        color_level();
        load();
    }
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowRight') next();
    else if (key === 'ArrowLeft') previous();
});
