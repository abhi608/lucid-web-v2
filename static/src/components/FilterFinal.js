import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Button from '@material-ui/core/Button';
import {browserHistory} from 'react-router';




class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event);
  };

  render() {
    const { children, isFocused, isSelected, onFocus } = this.props;

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    );
  }
}

function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <Select
      optionComponent={Option}
      noResultsText={<Typography>{'No results found'}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
      }}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps;

        const onDelete = event => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          );
        }

        return <div className="Select-value">{children}</div>;
      }}
      {...other}
    />
  );
}

const ITEM_HEIGHT = 48;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto',
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
  },
});

class Filter extends React.Component {
  state = {
    single: null,
    multi: null,
    multiLabel: null,
    filter_data: {"author":[], "bench":[], "divtype":[], "source":[]},
    author: null,
    bench: null,
    divtype: null,
    source: null,
    search_phrase: null
  };

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  componentWillMount() {
    var parentThis = this;
    var search = this.props.location.search;
    var decode = decodeURIComponent;
    if(search.charAt(0) == '?'){
        search = search.substr(1);
    }
    console.log("search: ", search);
    search = search.split('&');
    var toSet = {};
    for(var i in search){
        var tmp = search[i].split("=");
        console.log("tmp: ", tmp);
        toSet[tmp[0]] = decode(tmp[1]);
    }
    console.log("willmount", toSet);
    this.setState(toSet, function(){
        fetch("/api/getFilterData", {
            method: "GET",
        }).then((resp) => resp.json()).
        then(function(data){
            var obj = {}
            for(var key in data.filter_data){
                // console.log("rest: ", data.filter_data[key]);
                obj[key] = [];
                for(var item in data.filter_data[key]){
                    // console.log(item, data.filter_data[key][item])
                    obj[key].push({
                        label: data.filter_data[key][item],
                        value: data.filter_data[key][item]
                    })
                }
            }
            // console.log("obj: ", obj)
            // console.log("filterData: ", data);
            parentThis.setState({filter_data: obj});
            // console.log("thisState: ", parentThis.state.filter_data);
        });
    });
  }

  applyFilter() {
    console.log("You need to apply filter!");
    var queryData = {}
    if(this.state.author) queryData['author'] = this.state.author;
    if(this.state.bench) queryData['bench'] = this.state.bench;
    if(this.state.benchcount) queryData['benchcount'] = this.state.benchcount;
    if(this.state.divtype) queryData['divtype'] = this.state.divtype;
    if(this.state.source) queryData['source'] = this.state.source;
    if(this.state.search_phrase) queryData['search_phrase'] = this.state.search_phrase;
    queryData['is_filter'] = true;
    var esc = encodeURIComponent;
    var query = Object.keys(queryData)
            .map(k => esc(k) + '=' + esc(queryData[k]))
            .join('&');

    var parentThis = this;
    // var query = "author=" + this.state.author + "&bench=" + this.state.bench + "&divtype=" + this.state.divtype + "&source=" + this.state.source;
    fetch("/api/search?"+query, {
        method: "GET",
    }).then((resp) => resp.json()).
    then(function(data){
        console.log("DATA: ", data, parentThis.props);
        // browserHistory.push('/results?'+query);
        data['load_more'] = false;
        parentThis.props.router.push({
            pathname: '/results',
            search: "?"+query,
            state: {response: data}
        });
        }
    );
  };

  handleChange = name => value => {
    this.setState({
      [name]: value,
    }, function(){
        console.log("afterChange: ", this.state.author)
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div style={{height: 90}}>
        <TextField
          style={{fontSize: "200px"}}
          margin='none'
          fullWidth
          value={this.state.author}
          onChange={this.handleChange('author')}
          placeholder="Select multiple authors"
          name="react-select-chip-label"
          label="Authors"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: SelectWrapped,
            inputProps: {
              classes,
              multi: true,
              instanceId: 'react-select-chip-label',
              id: 'react-select-chip-label',
              simpleValue: true,
              options: this.state.filter_data.author,
            },
          }}
        />
        </div>

        <div style={{height: 90}}>
        <TextField
          fullWidth
          value={this.state.bench}
          onChange={this.handleChange('bench')}
          placeholder="Select multiple benches"
          name="react-select-chip-label"
          label="Benches"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: SelectWrapped,
            inputProps: {
              classes,
              multi: true,
              instanceId: 'react-select-chip-label',
              id: 'react-select-chip-label',
              simpleValue: true,
              options: this.state.filter_data.bench,
            },
          }}
        />
        </div>

        <div style={{height: 90}}>
        <TextField
          fullWidth
          value={this.state.benchcount}
          onChange={this.handleChange('benchcount')}
          placeholder="Select multiple bench counts"
          name="react-select-chip-label"
          label="Bench Count"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: SelectWrapped,
            inputProps: {
              classes,
              multi: true,
              instanceId: 'react-select-chip-label',
              id: 'react-select-chip-label',
              simpleValue: true,
              options: this.state.filter_data.benchcount,
            },
          }}
        />
        </div>
        
        <div style={{height: 90}}>
        <TextField
          fullWidth
          value={this.state.divtype}
          onChange={this.handleChange('divtype')}
          placeholder="Select multiple Document Types"
          name="react-select-chip-label"
          label="Divtypes"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: SelectWrapped,
            inputProps: {
              classes,
              multi: true,
              instanceId: 'react-select-chip-label',
              id: 'react-select-chip-label',
              simpleValue: true,
              options: this.state.filter_data.divtype,
            },
          }}
        />
        </div>

        <div style={{height: 90}}>
        <TextField
          fullWidth
          value={this.state.source}
          onChange={this.handleChange('source')}
          placeholder="Select multiple sources"
          name="react-select-chip-label"
          label="Sources"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: SelectWrapped,
            inputProps: {
              classes,
              multi: true,
              instanceId: 'react-select-chip-label',
              id: 'react-select-chip-label',
              simpleValue: true,
              options: this.state.filter_data.source,
            },
          }}
        />
        </div>
        {/* <Button  color="primary">
              Disagree
        </Button>
        <Button  color="primary">
              Disagree
        </Button> */}
      </div>
    );
  }
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);
