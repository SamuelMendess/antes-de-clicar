const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const ler = nome => readFileSync(join(__dirname, nome), 'utf8');
const html = ler('index.html');
const css = ler('estilos.css');
const js = ler('oficina.js');

test('a página usa português brasileiro e carrega os recursos locais', () => {
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /<link rel="stylesheet" href="estilos.css">/);
  assert.match(html, /<script src="oficina.js" defer><\/script>/);
  assert.match(ler('marca.svg'), /<svg\b/);
  assert.match(css, /:focus-visible/);
});

test('os três casos de treino têm respostas recolhidas e as etapas têm rótulos', () => {
  assert.equal([...html.matchAll(/<label><input type="checkbox">[^<]+<\/label>/g)].length, 3);
  assert.equal([...html.matchAll(/<article class="caso" data-caso>/g)].length, 3);
  assert.equal([...html.matchAll(/<details>\s*<summary>[^<]+<\/summary>\s*<p>[^<]+<\/p>\s*<\/details>/g)].length, 3);
});

test('os controles funcionam com recursos locais e sem envio de respostas ou fotos', () => {
  assert.doesNotMatch(html, /<(?:script|img|link)\b[^>]+(?:src|href)="https?:\/\/|<form\b/i);
  assert.doesNotMatch(css, /@import|url\s*\(/i);
  assert.doesNotMatch(js, /\b(?:fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB)\b/);
});
