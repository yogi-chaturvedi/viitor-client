import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {
    ArrowDownward,
    ArrowUpward,
    ChevronLeft,
    ChevronRight,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon
} from '@material-ui/icons';
import {useHistory} from "react-router";
import patientService from "../../services/patient.service";
import _ from "lodash";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import WithLoader from "../hoc/WithLoader";

const TableWithLoader = WithLoader(TableContainer);

const useStyles = makeStyles({
        container: {
            display: "flex",
            flexDirection: "column",
            width: 1000,
            margin: "auto"
        },
        table: {
            margin: "auto"
        },
        toolbar: {display: "flex", justifyContent: "space-between"},
        searchContainer: {
            display: "flex",
            border: "2px solid #cecece",
            padding: "0px 10px",
            borderRadius: 10,
            height: 40
        },
        pageIcon: {
            padding: 10,
            border: "1px solid #4CAF50",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: 40,
            cursor: "pointer"
        },
        page: {
            backgroundColor: "#4CAF50",
            color: "#FFFFFF"
        },
        paginationContainer: {
            alignItems: "center",
            display: "flex"
        },
        rootPaginationContainer: {
            padding: 10,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
        },
        itemsPerPageContainer: {
            width: 120,
            marginRight: 20
        },
        clickable: {
            cursor: "pointer"
        },
        exportButton: {
            display: "flex",
            height: 40,
            marginRight: 20
        }
    })
;

const InitialFilter = {
    sortBy: "firstName",
    page: 1,
    query: "",
    ascending: true,
    itemsPerPage: 2
};

export default function Dashboard() {
    const classes = useStyles();
    const history = useHistory();

    const [patients, setPatients] = useState([]);
    const [filter, setFilter] = useState(InitialFilter);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        patientService.list()
            .then(res => {
                console.log(res);
                setPatients(res.data.data);
                setLoading(false);
            })
    }, []);

    const editPatient = (id) => {
        history.push(`/app/patient/${id}`);
    };

    const deletePatient = (id) => {
        setLoading(true);
        patientService.remove(id).then(res => {
            const remainingPatients = _.filter(patients, p => p.id !== id);
            setPatients(remainingPatients);
            setLoading(false);
        })
    };

    const getFilteredData = () => {
        // Query
        let filteredData = _.filter(patients, row => {
            return (
                _.includes(row.firstName.toUpperCase(), filter.query.toUpperCase()) ||
                _.includes(row.lastName.toUpperCase(), filter.query.toUpperCase()) ||
                _.includes(row.email.toUpperCase(), filter.query.toUpperCase())
            );
        });

        // Sorting
        const mode = filter.ascending ? "asc" : "desc";
        filteredData = _.orderBy(filteredData, [item => {
            return item[filter.sortBy].toLowerCase();
        }], [mode]);

        // Pagination
        filteredData = _.chunk(filteredData, filter.itemsPerPage)[filter.page - 1];
        return filteredData || [];
    };

    const sort = (sortBy) => {
        if (filter.sortBy === sortBy) {
            setFilter({...filter, sortBy, ascending: !filter.ascending});
        } else {
            setFilter({...filter, sortBy, ascending: true});
        }
    };

    const nextPage = () => {
        if (filter.page < patients.length / filter.itemsPerPage) {
            setFilter({...filter, page: filter.page + 1});
        }
    };

    const prevPage = () => {
        if (filter.page !== 1) {
            setFilter({...filter, page: filter.page - 1});
        }
    };

    const searchChange = ({target: {value}}) => {
        setFilter({...filter, query: value});
    };

    const onItemsPerPageChange = ({target: {value}}) => {
        setFilter({...filter, itemsPerPage: value});
    };

    const exportToCSV = () => {
        console.log("CLICKED");
        const header = ["Name", "Email", "Age", "Diagnose With", "Address"];
        const data = _.map(patients, patient => {
            const address = `${patient.city}-${patient.state} (${patient.country})`;
            return [`${patient.firstName} ${patient.lastName}`, patient.email, patient.age, patient.diagnoseWith, address];
        });

        const rows = [header, ...data];

        let csvContent = "data:text/csv;charset=utf-8,";

        rows.forEach(function (rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "patients.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <Paper className={classes.container}>
            <Toolbar className={classes.toolbar}>
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {`Patient list (${patients.length})`}
                </Typography>
                <div className={classes.searchContainer}>
                    <InputBase
                        className={classes.input}
                        onChange={searchChange}
                        placeholder="Enter keywords..."
                        inputProps={{'aria-label': 'Enter keywords...'}}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon/>
                    </IconButton>
                </div>
            </Toolbar>
            <TableWithLoader loading={loading}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Action</TableCell>
                            <FilterableCell title={"Name"}
                                            onClick={() => {
                                                sort("firstName")
                                            }}
                                            ascending={filter.sortBy === "name" ? filter.ascending : false}
                            />
                            <FilterableCell title={"Email"}
                                            onClick={() => {
                                                sort("email")
                                            }}
                                            ascending={filter.sortBy === "email" ? filter.ascending : false}
                            />
                            <TableCell align="right">Gender</TableCell>
                            <FilterableCell title={"Age"}
                                            onClick={() => {
                                                sort("age")
                                            }}
                                            ascending={filter.sortBy === "age" ? filter.ascending : false}
                            />
                            <TableCell align="right">Diagnose With</TableCell>
                            <TableCell align="right">Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getFilteredData().map((row) => (
                            <TableRow key={row.name}>
                                <TableCell align="right">
                                    <EditIcon fontSize="small" style={{color: "blue"}} className={classes.clickable}
                                              onClick={() => editPatient(row.id)}/>&nbsp;&nbsp;
                                    <DeleteIcon fontSize="small" style={{color: "red"}} className={classes.clickable}
                                                onClick={() => deletePatient(row.id)}/>
                                </TableCell>
                                <TableCell align="right">{`${row.firstName} ${row.lastName}`}</TableCell>
                                <TableCell align="right">{row.email}</TableCell>
                                <TableCell align="right">{row.gender}</TableCell>
                                <TableCell align="right">{row.age}</TableCell>
                                <TableCell align="right">{row.diagnoseWith || "-"}</TableCell>
                                <TableCell align="right">{`${row.city}, ${row.state}, ${row.country}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableWithLoader>
            <div className={classes.rootPaginationContainer}>
                <Button variant="contained" color="primary" onClick={exportToCSV} className={classes.exportButton}>
                    Export to CSV
                </Button>
                <ItemsPerPage onChange={onItemsPerPageChange} itemsPerPage={filter.itemsPerPage}/>
                <Pagination activePage={filter.page} next={nextPage} prev={prevPage}/>
            </div>
        </Paper>
    );
}

const FilterableCell = ({title, onClick, ascending}) => {
    const classes = useStyles();
    return <TableCell align="right" onClick={onClick} className={classes.clickable}>
        {title}
        {
            ascending ? <ArrowDownward/> : <ArrowUpward/>
        }
    </TableCell>
};

const Pagination = ({activePage, prev, next}) => {
    const classes = useStyles();
    return <div className={classes.paginationContainer}>
        <span className={classes.pageIcon}>
        <ChevronLeft onClick={prev}/>
        </span>
        <span className={`${classes.pageIcon} ${classes.page}`}>{activePage}</span>
        <span className={classes.pageIcon}>
        <ChevronRight onClick={next}/>
        </span>
    </div>
}

const ItemsPerPage = ({onChange, itemsPerPage}) => {
    const classes = useStyles();
    return <div className={classes.itemsPerPageContainer}>
        <FormControl variant="outlined" fullWidth required>
            <InputLabel id="itemPerPage">Items per page</InputLabel>
            <Select
                labelId="itemPerPage"
                onChange={onChange}
                label="Items per onChange"
                value={itemsPerPage}
                name="itemsPerPage"
                id="itemsPerPage">
                <MenuItem value={2}>
                    <em>2</em>
                </MenuItem>
                <MenuItem value={5}>
                    <em>5</em>
                </MenuItem>
                <MenuItem value={10}>
                    <em>10</em>
                </MenuItem>
            </Select>
        </FormControl>
    </div>
}
