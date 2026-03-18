import StartGame from './game/main';

import { Bugfender } from '@bugfender/sdk';
Bugfender.init({
    appKey: 'gPECF5e07VlV1lokwe2Glnhm7M3zPQir',
    // overrideConsoleMethods: true,
    // printToConsole: true,
    // registerErrorHandler: true,
    // logBrowserEvents: true,
    // logUIEvents: true,
    // version: '',
    // build: '',
});

document.addEventListener('DOMContentLoaded', () => {

    StartGame('game-container');

});