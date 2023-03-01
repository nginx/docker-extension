import React, {useEffect, useState} from "react";
import {ConfigurationUiService} from "./ConfigurationUiService";
import {
    Box, Button,
    Chip, IconButton,
    Paper, Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import {Add, ArrowBackIosNewOutlined, PlusOne} from "@mui/icons-material";
import {Location} from "./Location";
import {Server} from "./Server";

interface ConfigurationUiProps {
    containerId: string,
    nginxInstance: any
}

export function ConfigurationUi(props: ConfigurationUiProps) {

    const [state, setState] = useState({configuration: {http: {servers: []}}})
    const configurationUiService: any = new ConfigurationUiService()

    useEffect(() => {
        const configuration = async () => {
            configurationUiService.getConfiguration(props.containerId).then((configuration: any) => {
                setState({configuration: configuration})
            })
        }
        configuration().catch(console.error)
    }, []);

    const renderMountsIfAny: any = () => {
        console.log(props.nginxInstance);
        if (props.nginxInstance.mounts.length > 0) {
            return (
                <>
                    <Typography variant={"h3"}>Mounts</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mount-Point</TableCell>
                                    <TableCell align="right">Type</TableCell>
                                    <TableCell align="right">Source</TableCell>
                                    <TableCell align="right">Destination</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.nginxInstance.mounts.map((mount: any, index: number) => (
                                    <TableRow
                                        key={index}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">
                                        </TableCell>
                                        <TableCell align="right">
                                            {mount.Type}
                                        </TableCell>
                                        <TableCell align="right">
                                            {mount.Source}
                                        </TableCell>
                                        <TableCell align="right">
                                            {mount.Destination}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )
        }
    }

    const [serverSlide, setServerSlide] = useState(false);
    const handleChangeServer = () => {
        setServerSlide((prev) => !prev);
    };

    const content = (
        <Box
            sx={{ width: "100%", height: "100vh" }}
            style={{
                position: "absolute",
                top: "0",
                zIndex: "99",
                right: "0",
                display: "flex",
                flexDirection: "row-reverse",
                backgroundColor: "transparent"
            }}
        >
            <Box
                style={{
                    display: "flex",
                    width: "75%",
                    height: "100vh",
                    borderLeft: "2px solid blue",
                    flexDirection: "column",
                    backgroundColor: "rgba(255,255,255,1)",
                    alignItems: "flex-start"
                }}
            >
                <Button onClick={handleChangeServer}>Close</Button>
                <Server/>
            </Box>
        </Box>
    );

    const [locationSlide, setLocationSlide] = useState(false);
    const handleChangeLocation = () => {
        setLocationSlide((prev) => !prev);
    };

    const contentLocation = (
        <Box
            sx={{ width: "100%", height: "100vh" }}
            style={{
                position: "absolute",
                top: "0",
                zIndex: "99",
                right: "0",
                display: "flex",
                flexDirection: "row-reverse",
                backgroundColor: "transparent"
            }}
        >
            <Box
                style={{
                    display: "flex",
                    width: "75%",
                    height: "100vh",
                    borderLeft: "2px solid blue",
                    flexDirection: "column",
                    backgroundColor: "rgba(255,255,255,1)",
                    alignItems: "flex-start"
                }}
            >
                <Button onClick={handleChangeLocation}>Close</Button>
                <Location/>
            </Box>
        </Box>
    );

    return (
        <>
            <Slide direction="left" in={serverSlide} mountOnEnter unmountOnExit>
                {content}
            </Slide>
            <Slide direction="left" in={locationSlide} mountOnEnter unmountOnExit>
                {contentLocation}
            </Slide>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Server
                                <Tooltip title="New Virtual Server">
                                    <IconButton onClick={handleChangeServer} sx={{fontSize:"0.9rem"}}>
                                        <Add/>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">Ports</TableCell>
                            <TableCell align="right">Locations</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.configuration.http.servers.map((server: any, index: number) => (
                            <TableRow
                                key={index}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {server.names.join(',')}
                                </TableCell>
                                <TableCell align="right">
                                    {server.listeners.map((listener: any, index: number) => (
                                        <Chip key={index} label={listener} variant="outlined"/>
                                    ))}
                                </TableCell>
                                <TableCell align="right">
                                    {server.locations.map((location: any, index: number) => (
                                        <Chip key={index} label={location.location} variant="outlined"/>
                                    ))}
                                    <Tooltip title="Add New Location">
                                        <IconButton className={"ngx-back-button"} onClick={handleChangeLocation} sx={{fontSize:"0.9rem"}}>
                                            <Add/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">Edit, Delete</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box>
                {renderMountsIfAny()}
            </Box>
        </>
    )
}

