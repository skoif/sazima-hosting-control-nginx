const { exec } = require('child_process');

function reloadNginx(){
    exec("service nginx reload");
}

function siteEnable(domain){
    exec("ln -s /etc/nginx/sites-available/"+domain+" /etc/nginx/sites-enabled/");
    reloadNginx();
}

function siteDisable(domain){
    exec("rm /etc/nginx/sites-enabled/"+domain);
    reloadNginx();
}

function siteRemove(domain){
    siteDisable(domain);
    exec("rm /etc/nginx/sites-available/"+domain);
    reloadNginx();
}

function certbot(domain){
    exec('certbot certonly --webroot -w /var/www/acme/'+domain+" -d "+domain+" -d www."+domain+" --non-interactive")
}

function createAcmeFolder(domain){
    exec('mkdir /var/www/acme/'+domain);
}