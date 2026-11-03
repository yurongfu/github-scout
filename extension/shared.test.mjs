import assert from 'node:assert/strict';
import {parseRepoUrl,feedUrl,normalizeFeed} from './shared.js';
assert.equal(parseRepoUrl('https://github.com/apache/hbase/tree/main'), 'apache/hbase');
assert.equal(parseRepoUrl('https://github.com/apache/hbase.git'), 'apache/hbase');
assert.equal(parseRepoUrl('https://evil.com/apache/hbase'),null);
assert.equal(parseRepoUrl('https://github.com/apache'),null);
assert.equal(feedUrl('yurongfu','github-scout'),'https://raw.githubusercontent.com/yurongfu/github-scout/main/data/feed.json');
assert.equal(normalizeFeed({schema_version:1,date:'2026-11-03',repos:[{full_name:'a/b',html_url:'https://github.com/a/b'}, {full_name:'x/y',html_url:'https://bad.test'}]}).repos.length,1);
console.log('Extension validation tests passed');
