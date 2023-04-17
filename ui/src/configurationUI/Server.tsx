import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Grid,
    InputAdornment,
    TextField,
    Typography,
    ThemeProvider,
    createTheme, Tabs, Tab,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import {NetworkService} from "../network/NetworkService";
import DnsIcon from "@mui/icons-material/Dns";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TabPanel from "@mui/lab/TabPanel";
import {ConfigurationUi} from "./ConfigurationUi";
import {ConfigurationEditor} from "../configurationEditor/ConfigurationEditor";
import {TemplateStore} from "../templateStore/TemplateStore";
import TabContext from "@mui/lab/TabContext";
import {Autocomplete} from "@mui/lab";
import {ConfigurationUiService} from "./ConfigurationUiService";

interface ServerProps {
    nginxInstance: any

}

type ServerConfiguration = {
    file: string,
    serverName: string | undefined,
    listeners: string,
    upstream: string | undefined

}

export function Server(props: ServerProps) {

    const initServerConfiguration: ServerConfiguration = {
        file: "",
        serverName: "",
        listeners: "",
        upstream: ""

    }

    const [state, setState] = useState({});
    const [networkACFields, setNetworkACFields] = useState<Array<any>>([]);
    const [tabValue, setTabValue] = useState('1');
    const [serverConfig, setServerConfig] = useState<ServerConfiguration>(initServerConfiguration);


    const inputChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // input field id and value
        const {name, value} = event.target
        setServerConfig({...serverConfig, [name]: value})
        console.log(serverConfig)
    }
    const inputConfigFileHandler = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // input field id and value
        const {name, value} = event.target
        if (value.match("\\/.*$")) {
            setServerConfig({...serverConfig, ["file"]: value})
        } else {
            setServerConfig({...serverConfig, ["file"]: `/etc/nginx/conf.d/${value}`})
        }
        console.log(serverConfig)
    }

    const inputChangeHandlerACField = (event: React.ChangeEvent<any>) => {
        const upstream = networkACFields[event.target.dataset.optionIndex]
        console.log(upstream)
        setServerConfig({...serverConfig, upstream: `${upstream.network.ip}:${upstream.ports[0].private}`})
    }


    useEffect(() => {
        const networkService: NetworkService = new NetworkService();
        // Get the available Containers based on the current container network
        console.log(props.nginxInstance)
        const networkTopology = async () => {
            networkService.containersInNetwork(props.nginxInstance.networks[0][0]).then((containers: any) => {
                setState(containers)
                createACNetworkArray(containers)
            })
        }
        networkTopology().catch(console.error)
    }, [])


    //Implement Service functions to create names and friends.
    const createACNetworkArray = (containers: any) => {
        let network: Array<any> = []
        console.log(containers)
        containers.map((container: any) => {
            let ports: Array<any> = []
            container.Ports.map((portConfig: any) => {
                const port = {
                    private: portConfig.PrivatePort,
                    public: portConfig.PublicPort || undefined,
                    type: portConfig.Type
                }
                ports.push(port)
            })

            const c = {
                id: container.Id,
                currentActive: (props.nginxInstance.id === container.Id),
                name: container.Names[0].split('/')[1],
                network: {
                    ip: container.NetworkSettings.Networks[props.nginxInstance.networks[0][0]].IPAddress
                },
                ports: ports
            }
            network.push(c)
        })
        setNetworkACFields(network);
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const createProxyConfiguration = () => {
        console.log(serverConfig);
        const configUiService = new ConfigurationUiService();
        const configuration = configUiService.createNewServerConfiguration(serverConfig, props.nginxInstance.id);
    }

    return (
        <Grid container direction={"column"} sx={{margin: 0, padding: 5}}>
            <Typography variant={"h3"} sx={{marginBottom: 2}}>Add a Server</Typography>
            <Alert severity="info" sx={{marginBottom: 4}}>
                The new virtual server will be created in a new configuration file.
            </Alert>
            <TabContext value={tabValue}>
                <Box>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="icon label tabs example">
                        <Tab icon={<DnsIcon/>} label="Virtual Server" value={"1"}/>
                    </Tabs>
                </Box>
                <TabPanel value={"1"}>
                    <Box>
                        <TextField
                            label="Configuration File Name"
                            id="file" name="file"
                            onChange={(e: any) => inputConfigFileHandler(e)}
                        />
                        {serverConfig.file ? (<>{serverConfig.file}</>) : (<></>)}
                    </Box>
                    <Box marginTop={1}>
                        <TextField
                            label="Virtual Server Name"
                            id="serverName" name="serverName"
                            onChange={(e: any) => inputChangeHandler(e)}
                        />
                    </Box>
                    <Box marginTop={1}>
                        <TextField
                            label="Listen Port"
                            id="listeners" name="listeners"
                            onChange={(e: any) => inputChangeHandler(e)}
                        />
                    </Box>

                    <Autocomplete
                        freeSolo
                        id="upstream"
                        onChange={(e: any) => inputChangeHandlerACField(e)}
                        disableClearable
                        options={networkACFields.map((client) => `${client.name}:${client.ports[0].private} (${client.ports[0].type})`)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Upstream"
                                name="upstream"
                                value={serverConfig.upstream}
                                onChange={(e: any) => inputChangeHandler(e)}
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                            />
                        )}
                    />
                    <Typography>{`http://${serverConfig.upstream}`}</Typography>
                    <Box marginTop={2}>
                        <Button
                            variant={"outlined"}
                            startIcon={<PublishIcon/>}
                            onClick={createProxyConfiguration}>Publish
                        </Button>
                    </Box>
                </TabPanel>
            </TabContext>
        </Grid>
    )
}

