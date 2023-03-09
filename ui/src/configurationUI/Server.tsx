import React, {useEffect} from "react";
import {Alert, Box, Button, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import {Editor} from "../prism/Editor";
import PublishIcon from "@mui/icons-material/Publish";

interface ServerProps {

}

export function Server(props: ServerProps) {

    useEffect(() => {

    })

    return(
        <Grid container direction={"column"} sx={{margin: 0, padding: 5}}>
            <Typography variant={"h2"} sx={{marginBottom: 2}}>Add a Server</Typography>
            <Alert severity="info" sx={{marginBottom: 4}}>
               Some information
            </Alert>

            <Box>
                <Button variant={"outlined"} startIcon={<PublishIcon/>}
                        onClick={() => {}}
                        style={{marginLeft: "0.5rem"}}>Publish</Button>
            </Box>
        </Grid>
    )

}

