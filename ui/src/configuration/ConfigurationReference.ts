interface Context {
    name: string
}

interface Directive {
    name: string,
    information: string,
    context: Array<Context>,
    example: string
}

interface DirectivesList {
    directive: Directive
}


export class ConfigurationReference {

    private directives: any = new Map([
        ["root", {name: "root", information: "root directive", context: []}],
        ["server", {
            name: "server",
            information: "Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the “Host” request header field) virtual servers",
            context: ["http"],
            syntax: "server { ... }"
        }],
        ["location", {name: "location", information: "location directive", context: []}],
        ["keepalive_timeout", {
            name: "keepalive_timeout",
            information: "The first parameter sets a timeout during which a keep-alive client connection will stay open on the server side. The zero value disables keep-alive client connections. The optional second parameter sets a value in the “Keep-Alive: timeout=time” response header field. Two parameters may differ. ",
            context: ["http", "server", "location"],
            syntax: "keepalive_timeout timeout [header_timeout];"
        }],
    ])

    constructor() {

    }

    getDirectiveInformation(directive: string): any {
        return this.directives.get(directive)
    }

}