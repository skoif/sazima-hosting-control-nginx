const parser = require('@webantic/nginx-config-parser');
const express = require('express');
const request = require('request');
const Datastore = require('nedb');
const system = require('./system.js');

let domainstore = new Datastore({ filename: 'domains.db' });
let app = express();

