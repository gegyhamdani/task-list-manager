import React from "react";

import { Paper, Grid, TextField, Button } from "@material-ui/core";

const FormInputTask = ({
  classes,
  handleAddTask,
  onChangeAddTask,
  inputContent,
  inputTags,
  isInputWarning,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper} style={{ backgroundColor: "#FCFCFC" }}>
          <h3 style={{ textAlign: "center", margin: "-1rem 0 1.5rem 0" }}>
            Add New Task
          </h3>
          <form
            noValidate
            autoComplete="off"
            className={classes.formContainer}
            onSubmit={(e) => handleAddTask(e)}
          >
            <div>
              <TextField
                id="content"
                label="Content"
                variant="outlined"
                size="small"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                value={inputContent}
                onChange={(e) => onChangeAddTask(e)}
              />
              <TextField
                id="tags"
                label="Tags"
                variant="outlined"
                size="small"
                className={(classes.textField, classes.textFieldTags)}
                InputLabelProps={{
                  shrink: true,
                }}
                value={inputTags}
                onChange={(e) => onChangeAddTask(e)}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color={isInputWarning ? "secondary" : "primary"}
              size="large"
              className={classes.buttonStyle}
            >
              Submit
            </Button>
          </form>
          {isInputWarning && (
            <p className={classes.textStyle} style={{ color: "red" }}>
              Form Must Not Empty
            </p>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FormInputTask;
