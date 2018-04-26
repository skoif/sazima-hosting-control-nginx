const { exec } = require('child_process');

function reloadNginx(){
    exec("nginx reload");
}

function siteEnable(filename){
    exec("ln -s /etc/nginx/sites-available/"+filename+" /etc/nginx/sites-enabled/");
    reloadNginx();
}

function siteDisable(filename){
    exec("rm /etc/nginx/sites-enabled/"+filename);
    reloadNginx();
}

function certbot(domain, email){
    exec('certbot certonly --webroot -w /var/www/acme/'+domain+" ")
}

function createAcmeFolder(domain){
    exec('mkdir /var/www/acme/'+domain);
}