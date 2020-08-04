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
import PatientService from "../../services/patient.service";
import _ from "lodash";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import WithLoader from "../hoc/WithLoader";
import {toast} from "react-toastify";

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
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: 40,
            borderRadius: 20,
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
        },
        emptyTable: {
            textAlign: "center",
            minHeight: 150,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            color: "teal"
        }
    })

const InitialFilter = {
    sortBy: "firstName",
    page: 1,
    query: "",
    ascending: true,
    itemsPerPage: 5
};

export default function Dashboard() {
    const patientService = new PatientService();

    const classes = useStyles();
    const history = useHistory();

    const [patients, setPatients] = useState([]);
    const [filter, setFilter] = useState(InitialFilter);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        patientService.list()
            .then(res => {
                console.log(res);
                setPatients(res.data.data);
                setLoading(false);
            }).catch(e => {
            setLoading(false);
            toast.error("Failed to fetch patient list");
        })
    }, []);

    useEffect(() => {
        // Apply filter
        // 1. Query (Searching)
        let filteredData = _.filter(patients, row => {
            return (
                _.includes(row.firstName.toUpperCase(), filter.query.toUpperCase()) ||
                _.includes(row.lastName.toUpperCase(), filter.query.toUpperCase()) ||
                _.includes(row.email.toUpperCase(), filter.query.toUpperCase())
            );
        });

        // 2. Sorting and mode
        const mode = filter.ascending ? "asc" : "desc";
        filteredData = _.orderBy(filteredData, [item => {
            return item[filter.sortBy].toString().toLowerCase();
        }], [mode]);

        setFilteredData(filteredData || []);
    }, [patients, filter]);

    const getActivePageData = () => {
        const pagedData = _.chunk(filteredData, filter.itemsPerPage)[filter.page - 1];
        return pagedData || [];
    };

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

    const sort = (sortBy) => {
        if (filter.sortBy === sortBy) {
            setFilter({...filter, sortBy, ascending: !filter.ascending, page: 1});
        } else {
            setFilter({...filter, sortBy, ascending: true, page: 1});
        }
    };

    const nextPage = () => {
        if (filter.page < filteredData.length / filter.itemsPerPage) {
            setFilter({...filter, page: filter.page + 1});
        }
    };

    const prevPage = () => {
        if (filter.page !== 1) {
            setFilter({...filter, page: filter.page - 1});
        }
    };

    const searchChange = ({target: {value}}) => {
        setFilter({...filter, query: value, page: 1});
    };

    const onItemsPerPageChange = ({target: {value}}) => {
        setFilter({...filter, itemsPerPage: value, page: 1});
    };

    const exportToCSV = () => {
        console.log("CLICKED");
        const header = ["Name", "Email", "Age", "Diagnose With", "Address"];
        const data = _.map(filteredData, patient => {
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
                        onChange={searchChange}
                        placeholder="Enter name or email"
                        inputProps={{'aria-label': 'Enter name or email'}}
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
                            <TableCell align="center">Action</TableCell>
                            <FilterableCell title={"Name"}
                                            onClick={sort}
                                            field="firstName"
                                            sortBy={filter.sortBy}
                                            ascending={filter.ascending}
                            />
                            <FilterableCell title={"Email"}
                                            onClick={sort}
                                            field="email"
                                            sortBy={filter.sortBy}
                                            ascending={filter.ascending}
                            />
                            <FilterableCell title={"Gender"}
                                            onClick={sort}
                                            field="gender"
                                            sortBy={filter.sortBy}
                                            ascending={filter.ascending}
                            />
                            <FilterableCell title={"Age"}
                                            onClick={sort}
                                            field="age"
                                            sortBy={filter.sortBy}
                                            ascending={filter.ascending}
                            />
                            <TableCell align="left">Diagnose With</TableCell>
                            <TableCell align="left">Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getActivePageData().map((row) => (
                            <TableRow key={row.name}>
                                <TableCell align="center">
                                    <EditIcon fontSize="small" style={{color: "blue"}} className={classes.clickable}
                                              onClick={() => editPatient(row.id)}/>&nbsp;&nbsp;
                                    <DeleteIcon fontSize="small" style={{color: "red"}} className={classes.clickable}
                                                onClick={() => deletePatient(row.id)}/>
                                </TableCell>
                                <TableCell align="left">{`${row.firstName} ${row.lastName}`}</TableCell>
                                <TableCell align="left">{row.email}</TableCell>
                                <TableCell align="left">{row.gender}</TableCell>
                                <TableCell align="left">{row.age}</TableCell>
                                <TableCell align="left">{row.diagnoseWith || "-"}</TableCell>
                                <TableCell align="left">{`${row.city}, ${row.state}, ${row.country}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {
                    filteredData.length === 0 &&
                    <div className={classes.emptyTable}>No result found</div>
                }
            </TableWithLoader>
            <div className={classes.rootPaginationContainer}>
                <Button variant="contained" color="primary" onClick={exportToCSV} className={classes.exportButton}>
                    Export to CSV
                </Button>
                <ItemsPerPage onChange={onItemsPerPageChange} itemsPerPage={filter.itemsPerPage}/>
                <Pagination activePage={filter.page}
                            next={nextPage}
                            prev={prevPage}
                            itemsPerPage={filter.itemsPerPage}
                            totalItems={filteredData.length}/>
            </div>
        </Paper>
    );
}

const FilterableCell = ({title, onClick, sortBy, field, ascending}) => {
    const classes = useStyles();
    return <TableCell align="left" onClick={() => onClick(field)} className={classes.clickable}>
        {title}
        {
            sortBy === field && <>
                {
                    ascending ? <ArrowUpward/> : <ArrowDownward/>
                }
            </>
        }
    </TableCell>
};

const Pagination = ({activePage, prev, next, totalItems, itemsPerPage}) => {
    const classes = useStyles();
    return <div className={classes.paginationContainer}>
        <IconButton className={classes.pageIcon}
                    disabled={activePage === 1}>
            <ChevronLeft onClick={prev}/>
        </IconButton>
        <span className={`${classes.pageIcon} ${classes.page}`}>{activePage}</span>
        <IconButton className={classes.pageIcon}
                    disabled={activePage >= totalItems / itemsPerPage}>
            <ChevronRight onClick={next}/>
        </IconButton>
    </div>
};

const ItemsPerPage = ({onChange, itemsPerPage}) => {
    const classes = useStyles();
    return <div className={classes.itemsPerPageContainer}>
        <FormControl variant="outlined" fullWidth required>
            <InputLabel id="itemPerPage">Items per page</InputLabel>
            <Select
                labelId="itemPerPage"
                onChange={onChange}
                label="Items per page"
                value={itemsPerPage}
                name="itemsPerPage"
                id="itemsPerPage">
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
            </Select>
        </FormControl>
    </div>
}
