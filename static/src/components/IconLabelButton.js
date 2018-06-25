import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

function IconLabelButtons(props){
  const {classes} = props;
  return (
    <div>
      <Button variant="contained" color="secondary" className={classes.button}>
        Load More Docs 
        <AddIcon className={classes.button} />
      </Button>
    </div>
  );
}

IconLabelButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconLabelButtons);
