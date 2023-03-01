interface ServerConfiguration {
    names: Array<any>,
    listeners: Array<any>
    locations: Array<any>
}

interface NginxConfiguration {
    nginx: any,
    http: any,
    stream: any
}

export class ConfigurationParser {

    constructor() {
    }

    parse(rawConfiguration: string): NginxConfiguration {

        const indent = 4;
        let confArray = rawConfiguration.split('\n');
        // remove all empty lines from array
        confArray = confArray.filter(n => n)
        // Remove all Empty files from Array to make the map more efficient.

        // logic to write
        // detect open context block if HTTP or stream. Set in HTTP or in Stream. If in HTTP look for server config context
        // server can be a one-liner as well. BUT that means that the LAST character of the line text is a `}`
        let inHttpContext = false;
        let inServerContext = false;
        let inLocationContext = false;

        let currentServerConfiguration: ServerConfiguration = {names: [], listeners: [], locations: []};

        let locationConfiguration = {'location': undefined, 'configuration': []}
        // New JSON-based Configuration.
        // Each Object in HTTP is
        let configuration: NginxConfiguration = {
            nginx: {},
            http: {'configuration': [], 'servers': []},
            stream: {'configuration': [], 'servers': []}
        };

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
            if (line.substring(line.length - 1) === ';') {
                //remove `;` from line end.
                line = line.substring(0, line.length - 1)
                //split the configuration by SPACE.
                const config = line.split(' ').filter(n => n);
                //first will be directive, others values.
                const obj = {'directive': config[0], 'paramter': config[1]}

                // Get the context to know where to push the configuration to.
                if (inLocationContext) {
                    console.log(obj);
                    currentServerConfiguration.locations[index].configuration.push(obj)
                }
            }

            // Comment line - skip
            if (line.substring(0,1) === '#') {
                    return
                }

            if (line.length === 1 && line.substring(line.length - 1) === '}') {
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
            if (line.length > 1 && line.substring(line.length - 1) === '}') {
                console.log(`One-Liner: need special handling ${line}`);
                return
            }
            // Let's check for http-context.
            if (line.match('http') && line.substring(line.length - 1) === '{') {
                inHttpContext = true
                console.log("In Http Context! Welcome! Adding new level");
                return
            }

            if (line.match('server') && line.substring(line.length - 1) === '{') {
                // Add new Server Object in Array.
                console.log(`Begin of Server context`);
                currentServerConfiguration = {'names': [], 'listeners': [], 'locations': []}
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

            if (line.match('server_name')) {
                // Server Name found: Add to server names array:
                console.log(line.split(' ').filter(n => n));
                currentServerConfiguration.names.push(line.split(' ').filter(n => n)[1])

            }

            if (line.match('location') && line.substring(line.length - 1) === '{') {
                console.log("In location context");

                inLocationContext = true;
                let location = line.split(' ').filter(n => n);
                currentServerConfiguration.locations.push({
                    'location': `${location[location.length - 2]}`,
                    'configuration': []
                })
                //increment index.
                console.log(currentServerConfiguration.locations)
                index += 1
                return
            }
        })
        console.log(configuration)
        return configuration
    }
}