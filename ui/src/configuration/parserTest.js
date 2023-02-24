const confStr = `
# configuration file /etc/nginx/nginx.conf:

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}

# configuration file /etc/nginx/mime.types:

types {
    text/html                                        html htm shtml;
    text/css                                         css;
    text/xml                                         xml;
    image/gif                                        gif;
    image/jpeg                                       jpeg jpg;
    application/javascript                           js;
    application/atom+xml                             atom;
    application/rss+xml                              rss;

    text/mathml                                      mml;
    text/plain                                       txt;
    text/vnd.sun.j2me.app-descriptor                 jad;
    text/vnd.wap.wml                                 wml;
    text/x-component                                 htc;

    image/avif                                       avif;
    image/png                                        png;
    image/svg+xml                                    svg svgz;
    image/tiff                                       tif tiff;
    image/vnd.wap.wbmp                               wbmp;
    image/webp                                       webp;
    image/x-icon                                     ico;
    image/x-jng                                      jng;
    image/x-ms-bmp                                   bmp;

    font/woff                                        woff;
    font/woff2                                       woff2;

    application/java-archive                         jar war ear;
    application/json                                 json;
    application/mac-binhex40                         hqx;
    application/msword                               doc;
    application/pdf                                  pdf;
    application/postscript                           ps eps ai;
    application/rtf                                  rtf;
    application/vnd.apple.mpegurl                    m3u8;
    application/vnd.google-earth.kml+xml             kml;
    application/vnd.google-earth.kmz                 kmz;
    application/vnd.ms-excel                         xls;
    application/vnd.ms-fontobject                    eot;
    application/vnd.ms-powerpoint                    ppt;
    application/vnd.oasis.opendocument.graphics      odg;
    application/vnd.oasis.opendocument.presentation  odp;
    application/vnd.oasis.opendocument.spreadsheet   ods;
    application/vnd.oasis.opendocument.text          odt;
    application/vnd.openxmlformats-officedocument.presentationml.presentation
                                                     pptx;
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                                                     xlsx;
    application/vnd.openxmlformats-officedocument.wordprocessingml.document
                                                     docx;
    application/vnd.wap.wmlc                         wmlc;
    application/wasm                                 wasm;
    application/x-7z-compressed                      7z;
    application/x-cocoa                              cco;
    application/x-java-archive-diff                  jardiff;
    application/x-java-jnlp-file                     jnlp;
    application/x-makeself                           run;
    application/x-perl                               pl pm;
    application/x-pilot                              prc pdb;
    application/x-rar-compressed                     rar;
    application/x-redhat-package-manager             rpm;
    application/x-sea                                sea;
    application/x-shockwave-flash                    swf;
    application/x-stuffit                            sit;
    application/x-tcl                                tcl tk;
    application/x-x509-ca-cert                       der pem crt;
    application/x-xpinstall                          xpi;
    application/xhtml+xml                            xhtml;
    application/xspf+xml                             xspf;
    application/zip                                  zip;

    application/octet-stream                         bin exe dll;
    application/octet-stream                         deb;
    application/octet-stream                         dmg;
    application/octet-stream                         iso img;
    application/octet-stream                         msi msp msm;

    audio/midi                                       mid midi kar;
    audio/mpeg                                       mp3;
    audio/ogg                                        ogg;
    audio/x-m4a                                      m4a;
    audio/x-realaudio                                ra;

    video/3gpp                                       3gpp 3gp;
    video/mp2t                                       ts;
    video/mp4                                        mp4;
    video/mpeg                                       mpeg mpg;
    video/quicktime                                  mov;
    video/webm                                       webm;
    video/x-flv                                      flv;
    video/x-m4v                                      m4v;
    video/x-mng                                      mng;
    video/x-ms-asf                                   asx asf;
    video/x-ms-wmv                                   wmv;
    video/x-msvideo                                  avi;
}

map $host $test {
  www.example.com 1;
  www.example.com 1;
}

# configuration file /etc/nginx/conf.d/default.conf:
server {
    listen       80;
    listen  [::]:80;
    server_name  server1;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
    
    server {
    listen  unix:/var/run/nginx.sock;
    listen  8090 default_server ssl http2;
    listen                  80;
    listen  [::]:80;
    server_name  server2;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
    
    location /test1/ { return 200 "OK  This works\n";}
    
    location /test2/ {
      return 200 "OK  This works\n";
    }
    
    location /test/ {
      proxy_pass http://127.0.0.1:8080;
    }
    
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
`

const indent = 4;
let confArray = confStr.split('\n');
// remove all empty lines from array
confArray = confArray.filter(n => n)
// Remove all Empty files from Array to make the map more efficient.

// logic to write
// detect open context block if HTTP or stream. Set in HTTP or in Stream. If in HTTP look for server config context

// server can be a one liner as well. BUT that means that the LAST character of the line text is a `}`
let inHttpContext = false;
let inStreamContext = false;
let inServerContext = false;
let inLocationContext = false;


let currentServerConfiguration = {}

let locationConfiguration = {'location': undefined, 'configuration': []}
// New JSON-based Configuration.
// Each Object in HTTP is
let configuration = {"nginx": {}, "http": {'configuration': [], 'servers': []}, "stream": {'configuration': [], 'servers': []}};

//save current array to push configuration to it.
let index = -1;

confArray.map(line => {
    // Detecting comments first and skip

    // We have to check for context - based directives first. These are
    // http, map, upstream, server, location, if. These are basically opening a new context.
    // If it is not a context directive we can treat is a directive with params.

    // remove all whitespaces. They will be re-implemented using the ident.
    line = line.trim();


    // if line ends with `;` it is a value line. Check current context and proceed.
    if (line.substring(line.length -1) === ';') {
        //remove `;` from line end.
        line = line.substring(0, line.length-1)
        //split the configuration by SPACE.
        const config = line.split(' ').filter(n => n);
        console.log(config)
        //first will be directive, others values.
        const obj = {'directive': config[0], 'paramter': config[1]}

        // Get the context to know where to push the configuration to.
        if (inLocationContext) {
            console.log(obj);
            currentServerConfiguration.locations[index].configuration.push(obj)
        }
    }

    if (line.length === 1 && line.substring(line.length -1) === '}') {
        if (inLocationContext) {
            console.log(`Closing Location configuration block`)
            inLocationContext = false
            //reset array index
            return
        }

        if (inServerContext) {
            console.log(`Closing Server configuration block`)
            inServerContext = false
            configuration.http.servers.push(currentServerConfiguration)
            index = -1;
            return
        }
    }
    // special one liner treatment! ::)
    if (line.length > 1 && line.substring(line.length -1) === '}') {
      console.log(`One-Liner: need special handling ${line}`);
      return
    }
    // Let' s check for http-context.
        if (line.match('http') && line.substring(line.length - 1) === '{') {
            inHttpContext = true
            console.log("In Http Context! Welcome! Adding new level");
            return
    }

    if (line.match('server') && line.substring(line.length -1) === '{') {
        // Add new Server Object in Array.
        console.log(`Begin of Server context`);
        currentServerConfiguration =  {'listeners': [], 'locations': []}
        inServerContext = true
        //?
        inLocationContext = false
        return
    }

    if (line.match('listen')) {
        // Listeners found: Configuration:
        console.log(line.split(' ').filter(n => n));
        currentServerConfiguration.listeners.push(line.split(' ').filter(n => n)[1])

    }

    if (line.match('location') && line.substring(line.length -1) === '{') {
        console.log("In location context");

        inLocationContext = true;
        let location = line.split(' ').filter(n => n);
        currentServerConfiguration.locations.push({'location': `${location[location.length-2]}`, 'configuration': []})
        //increment index.
        console.log(currentServerConfiguration.locations)
        index += 1
        return
    }
})

console.log(configuration)