const Parser = require('@webantic/nginx-config-parser');
const express = require('express');
const request = require('request');
const Datastore = require('nedb');
const system = require('./system.js');

let parser = new Parser();
let domainstore = new Datastore({ filename: 'domains.db' });
let app = express();

const defaultConfig = {
    "server": {
        "listen": [
            "80",
            "443 ssl"
        ],
        "server_name": "DOMAIN",
        "ssl_certificate": "/etc/letsencrypt/live/DOMAIN/fullchain.pem",
        "ssl_certificate_key": "/etc/letsencrypt/live/DOMAIN/privkey.pem",
        "ssl_trusted_certificate": "/etc/letsencrypt/live/DOMAIN/chain.pem",
        "ssl_stapling": "on",
        "ssl_stapling_verify": "on",
        "resolver": "127.0.0.1 8.8.8.8",
        "location /.well-known": {
            "root": "/var/www/acme/DOMAIN"
        },
        "location /": {
            "proxy_pass": "LOCAL",
            "proxy_http_version": "1.1",
            "proxy_set_header": [
                "Upgrade $http_upgrade",
                "Connection 'upgrade'",
                "Host $host"
            ],
            "proxy_cache_bypass": "$http_upgrade"
        }
    }
};

function buildNginxConfig(domain, proxyto){
    let conf = defaultConfig;
    //conf.server.listen = [domain+":80", domain+":443 ssl", "www."+domain+":80", "www."+domain+":443 ssl"]
    conf.server.server_name = domain+" www."+domain;
    conf.server.ssl_certificate = "/etc/letsencrypt/live/"+domain+"/fullchain.pem";
    conf.server.ssl_certificate_key = "/etc/letsencrypt/live/"+domain+"/privkey.pem";
    conf.server.ssl_trusted_certificate = "/etc/letsencrypt/live/"+domain+"/chain.pem";
    conf.server["location /.well-known"].root = "/var/www/acme/"+domain;
    conf.server["location /"].proxy_pass = "http://"+proxyto;
    return conf;
}

