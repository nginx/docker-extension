


export class ConfigurationTemplates {

    public static simpleProxyServerTemplate = () => {
        return `
server {
  listen $$LISTEN;
  server_name $$SERVER_NAME;
  
  location / {
    proxy_pass $$UPSTREAM;
    proxy_set_header Host $host;
  }
}
`
    }

}