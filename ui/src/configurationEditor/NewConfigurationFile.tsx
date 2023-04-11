import {Alert, Box, Button, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import React, {ChangeEvent, ChangeEventHandler, useState} from "react";
import {ConfigurationEditor} from "./ConfigurationEditor";
import {Editor} from "../prism/Editor";
import PublishIcon from "@mui/icons-material/Publish";
import {InstancesService} from "../instances/InstancesService";
import {Base64} from "js-base64";

interface NewConfigurationFileProps {
    nginxInstance: any
    instanceService: InstancesService

}

export function NewConfigurationFile(props: NewConfigurationFileProps) {
    const [configurationFileContent, setConfigurationFileContent] = useState<any>("");
    const [fileName, setFileName] = useState<any>("");

    const saveConfigurationToFile: any = () => {
        const content = Base64.encode(configurationFileContent)

        if (!fileName) {
            props.instanceService.displayErrorMessage(`Filename can not be empty!`);
            return;
        }
// Make the path configurable
        props.instanceService.sendConfigurationToFile(fileName, props.nginxInstance.id, content).then((data: any) => {
            props.instanceService.reloadNGINX(props.nginxInstance.id).then((data: any) => {
                props.instanceService.displaySuccessMessage("Configuration successfully updated!");
            }).catch((reason: any) => {
                props.instanceService.displayErrorMessage(`Error while updating configuration: ${reason.stderr.split("\n")[1]}`);
            })
        })
    }

    return (
        <Grid container direction={"column"} sx={{margin: 0, padding: 5}}>
            <Typography variant={"h2"} sx={{marginBottom: 2}}>Add a new configuration File</Typography>
            <Alert severity="info" sx={{marginBottom: 4}}>
                Make sure the configuration filename ends with a .conf file extension and is a absolute path.
                Example: /etc/nginx/conf.d/example.conf
            </Alert>
            <TextField
                label="Configuration File Name"
                onChange={(e: any) => {
                    setFileName(e.target.value)
                }}
            />
            <Editor setConfigurationFileContent={setConfigurationFileContent}
                    fileContent={configurationFileContent}
                    style={{minHeight: "20rem"}}
            />
            <Box>
                <Button variant={"contained"} startIcon={<PublishIcon/>}
                        onClick={saveConfigurationToFile}
                        style={{marginLeft: "0.5rem"}}>Publish</Button>
            </Box>
        </Grid>
    )
}