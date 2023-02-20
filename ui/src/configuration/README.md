## NGINX TypeScript configuration parser

Parse the configuration and display help messages from nginx.org


Parse the configuration file by newline.

Create an array of configuration lines. Do NOT alter / change the main configuration file.
Do not remove Line-Breaks or spaces / tabs. This will destroy the formatting in the NGINX config file.

Parser can be copied form the `nginxinfo-tool`. To parse the overall NGINX configuration use the output of `nginx -T`
The manual include resolver is not needed in this case.

Load the list of directives and links to the documentation in the Extension on build time.
This will insure a fast and seamless experience to look them up for the user (even in case they will be offline).

```typescript
interface ConfigurationDirective {
    name: string,
    link: string,
    helpMessage: string    
}
```
