import test from 'node:test';
import assert from 'node:assert/strict';
import { googleDirections, googlePlaceSearch } from '../js/map/GoogleMapsLinks.js';

test('directions sends only the selected destination, lets Google determine origin, and preserves zero coordinates', () => {
  const url = new URL(googleDirections({ lat:0, lng:0, title:'Private task', notes:'Do not share', address:'Other' }));
  assert.equal(url.searchParams.get('destination'), '0,0');
  assert.equal(url.searchParams.get('api'), '1');
  assert.equal(url.searchParams.has('origin'), false);
  assert.equal(url.href.includes('Private'), false);
  assert.equal(googleDirections({ title:'Private task' }), null);
});

test('address directions and place lookup encode Vietnamese venue names', () => {
  const url = new URL(googleDirections({ address:'Quán A & B, Bát Tràng' }));
  assert.equal(url.searchParams.get('destination'), 'Quán A & B, Bát Tràng');
  const search = new URL(googlePlaceSearch({title:'Cà phê A',lat:20.96,lng:105.9}));
  assert.equal(search.hostname, 'www.google.com');
  assert.ok(search.searchParams.get('query').includes('Cà phê A'));
});
