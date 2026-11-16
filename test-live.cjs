const {test} = require('node:test');
const assert = require('node:assert/strict');
const {EventEmitter} = require('node:events');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');

test('switching LIVE accounts routes gifts and ignores stale connections', async () => {
  const routes = new Map(), connections = [], messages = [];
  const app = {use(){}, get(){}, post(path, ...handlers){routes.set(path,handlers.at(-1));}, listen(){return {};}};
  const express = Object.assign(() => app, {json:()=>()=>{}, static:()=>()=>{}});
  class SocketServer extends EventEmitter {
    constructor(){super(); this.clients = [{readyState:1, send:text=>messages.push(JSON.parse(text))}];}
  }
  class Connection extends EventEmitter {
    constructor(username){super(); this.username=username; connections.push(this);}
    async connect(){}
    disconnect(){this.emit('disconnected');}
  }
  const dependencies = {
    express, ws:{WebSocketServer:SocketServer}, 'node:crypto':require('node:crypto'),
    'tiktok-live-connector':{TikTokLiveConnection:Connection, WebcastEvent:{CHAT:'chat', LIKE:'like', GIFT:'gift'}}
  };
  const context = vm.createContext({require:name=>dependencies[name], process:{env:{}}, Buffer, console,
    setTimeout, clearTimeout, __dirname});
  vm.runInContext(readFileSync('server.cjs','utf8'), context);
  const connect = async username => {
    routes.get('/api/connect')({body:{username}}, {json(){}, status(){return this;}});
    await Promise.resolve();
  };
  const rose = {user:{idStr:'123', displayId:'viewer'}, giftId:5655, gift:{name:'Rose', diamondCount:1}, groupId:'batch', repeatCount:1};
  await connect('first.account');
  connections[0].emit('gift', rose);
  await connect('@erll.04');
  assert.equal(connections[1].username,'erll.04');
  connections[1].emit('gift', rose);
  assert.equal(messages.filter(m=>m.type==='gift').length,2,'same gift key is valid after switching accounts');
  assert.equal(messages.filter(m=>m.type==='gift').at(-1).action,'join');
  connections[1].emit('gift', rose);
  assert.equal(messages.filter(m=>m.type==='gift').length,2,'duplicate combo does not add another guest');
  connections[0].emit('gift', {...rose, groupId:'late'});
  assert.equal(messages.filter(m=>m.type==='gift').length,2,'old account cannot deliver gifts');
  connections[1].emit('error',new Error('test connection error'));
  assert.equal(messages.at(-1).issue,'test connection error');
  connections[1].emit('gift',{giftId:5655});
  assert.ok(messages.at(-1).issue,'missing sender is visible in diagnostics');
  // A superseded retry uses the same generation; identity must also be checked.
  await vm.runInContext('connect(generation)', context);
  connections[1].emit('gift',{...rose,groupId:'old-retry'});
  assert.equal(messages.filter(m=>m.type==='gift').length,2);
  connections[2].emit('gift',{...rose,groupId:'new-retry'});
  assert.equal(messages.filter(m=>m.type==='gift').length,3);
  assert.equal(messages.filter(m=>m.type==='status').at(-1).username,'erll.04');
});
