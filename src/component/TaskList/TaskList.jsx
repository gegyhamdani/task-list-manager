import React from "react";

import { Paper, Grid, TextField, Button } from "@material-ui/core";

const TaskList = ({
  ModelStore,
  classes,
  editableContentIndex,
  editInputContent,
  isEditWarning,
  onEditTask,
  onDoneTask,
  onOpenEditTask,
  onDeleteTask,
  onChangeEditTask,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs>
        {ModelStore.data.length > 0 &&
          ModelStore.data.map((item, idx) => (
            <Paper
              className={classes.paper}
              key={item._id}
              style={{ backgroundColor: item.done ? "#F5F5F5" : "#FCFCFC" }}
            >
              <div className={classes.formContainer}>
                <div style={{ maxWidth: "400px" }}>
                  {editableContentIndex === idx ? (
                    <TextField
                      id="editContent"
                      label="Edit Content"
                      size="small"
                      value={editInputContent}
                      onChange={(e) => onChangeEditTask(e)}
                    />
                  ) : (
                    <div className={classes.contentHeader}>
                      <h2 className={classes.textStyle}>
                        {item.text || "No Content"}
                      </h2>
                      {item.done && (
                        <img
                          src="./done.png"
                          alt="Logo"
                          height={15}
                          style={{ marginLeft: "4px" }}
                        />
                      )}
                    </div>
                  )}
                  <p className={classes.textStyle}>{item.tags || "No Tags"}</p>
                  <p className={classes.textStyle}>
                    {item.createdAt || "No Date Time"}
                  </p>
                  {isEditWarning && editableContentIndex === idx && (
                    <p className={classes.textStyle} style={{ color: "red" }}>
                      Content Must Not Empty
                    </p>
                  )}
                </div>
                <div>
                  {editableContentIndex === idx ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      className={classes.buttonTask}
                      style={{ marginRight: "4px" }}
                      onClick={(e) => onEditTask(e, item._id)}
                    >
                      Done Editing
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        className={classes.buttonTask}
                        style={{ marginRight: "4px" }}
                        onClick={(e) => onDoneTask(e, item._id, item.done)}
                      >
                        {item.done ? "UnDone" : "Done"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        className={classes.buttonTask}
                        style={{
                          marginRight: "4px",
                          borderColor: "#FFA114",
                          color: "#FFA114",
                        }}
                        onClick={(e) => onOpenEditTask(e, item.text, idx)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        className={classes.buttonTask}
                        onClick={() => onDeleteTask(item._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Paper>
          ))}
      </Grid>
    </Grid>
  );
};

export default TaskList;
