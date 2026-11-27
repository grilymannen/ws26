import EventEmitter from 'node:events';

export const appEmitter = new EventEmitter();
appEmitter.setMaxListeners(0);
