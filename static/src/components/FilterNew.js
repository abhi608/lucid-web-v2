import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

class Filter extends React.Component {
  state = {
    name: [],
    filter_data: {"author":[]},
    author: [],
  };

  componentWillMount() {
    var parentThis = this;
    console.log("willmount");
    fetch("/api/getFilterData", {
      method: "GET",
    }).then((resp) => resp.json()).
      then(function(data){
        console.log("filterData: ", data);
        parentThis.setState({filter_data: data.filter_data});
        console.log("thisState: ", parentThis.state.filter_data);
      });
  }

  handleChangeAuthor = event => {
    this.setState({ author: event.target.value} , function(){
        console.log("test: ", this.state.author);
    });
  };

  render() {
    const { classes, theme } = this.props;
    var parentThis = this;

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-chip">Author</InputLabel>
          <Select
            multiple
            value={this.state.author}
            onChange={this.handleChangeAuthor}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(value => <Chip key={value} label={value} className={classes.chip} />)}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {parentThis.state.filter_data.author.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={{
                  fontWeight:
                    this.state.name.indexOf(name) === -1
                      ? theme.typography.fontWeightRegular
                      : theme.typography.fontWeightMedium,
                }}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-chip">Author</InputLabel>
          <Select
            multiple
            value={this.state.author}
            onChange={this.handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(value => <Chip key={value} label={value} className={classes.chip} />)}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {this.state.filter_data.author.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={{
                  fontWeight:
                    this.state.name.indexOf(name) === -1
                      ? theme.typography.fontWeightRegular
                      : theme.typography.fontWeightMedium,
                }}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </div>
    );
  }
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Filter);