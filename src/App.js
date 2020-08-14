import React from "react";
import ModelStore from "./model/ModelStore";

import { Container, withStyles, Button, Paper } from "@material-ui/core";

import FormInputTask from "./component/FormInputTask";
import TaskList from "./component/TaskList";

window.ModelStore = ModelStore;

class BaseComponent extends React.PureComponent {
  rerender = () => {
    this.setState({
      _rerender: new Date(),
    });
  };
}

const useStyles = () => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: "2rem",
    borderRadius: 0,
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.2), 0px 1px 3px 0px rgba(0,0,0,0.2)",
  },
  formContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  textField: {
    marginRight: "1rem",
    width: "250px",
  },
  textFieldTags: {
    width: "150px",
  },
  buttonStyle: {
    padding: "0.5rem 3rem",
  },
  buttonTask: {
    padding: "0.5rem 2rem",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
  },
  contentHeader: {
    display: "flex",
    alignItems: "center",
  },
  textStyle: {
    margin: 0,
    wordBreak: "break-word",
  },
});

class App extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isInitialized: false,
      isInputWarning: false,
      inputContent: "",
      inputTags: "",
      editableContentIndex: null,
      editInputContent: "",
      isEditWarning: false,
      isConnectionLoss: false,
    };
  }

  handleConnectionChange = () => {
    const condition = navigator.onLine ? "online" : "offline";
    if (condition === "offline") {
      return this.setState({ isConnectionLoss: true });
    }
    return this.setState({ isConnectionLoss: false });
  };

  async componentDidMount() {
    ModelStore.setName("todos_gegy");
    await ModelStore.initialize();
    this.setState({
      isInitialized: true,
    });
    this.unsubStore = ModelStore.subscribe(this.rerender);
    this.handleConnectionChange();
  }

  async componentDidUpdate() {
    if (!ModelStore.isInitialized) {
      console.log("popup initialize all offline data...");
      ModelStore.setName("todos_gegy");
      await ModelStore.initialize();
      console.log("popup done");
    }
    window.addEventListener("online", () => {
      this.handleConnectionChange();
    });
    window.addEventListener("offline", () => {
      this.handleConnectionChange();
    });
  }

  componentWillUnmount() {
    this.unsubStore();
    window.removeEventListener("online", this.handleConnectionChange());
    window.removeEventListener("offline", this.handleConnectionChange());
  }

  onChangeAddTask = (event) => {
    const {
      target: { id, value },
    } = event;

    if (id === "content")
      return this.setState({ inputContent: value, isInputWarning: false });
    return this.setState({ inputTags: value, isInputWarning: false });
  };

  handleAddTask = async (event) => {
    event.preventDefault();
    if (!this.state.inputContent || !this.state.inputTags) {
      this.setState({ isInputWarning: true });
    } else {
      await ModelStore.addItem({
        text: this.state.inputContent,
        tags: this.state.inputTags,
        done: false,
      });
      this.setState({ inputContent: "", inputTags: "", isInputWarning: false });
    }
  };

  handleDeleteTask = async (id) => {
    ModelStore.deleteItem(id);
  };

  handleOpenEditTask = (event, task, index) => {
    event.preventDefault();
    this.setState({
      editInputContent: task.text,
      editableContentIndex: index,
    });
  };

  onChangeEditTask = (event) => {
    this.setState({
      editInputContent: event.target.value,
      isEditWarning: false,
    });
  };

  handleEditTask = async (event, task) => {
    event.preventDefault();
    if (!this.state.editInputContent) {
      this.setState({ isEditWarning: true });
    } else {
      await ModelStore.editItem(task._id, {
        ...task,
        text: this.state.editInputContent,
      });
      this.setState({
        editInputContent: "",
        editableContentIndex: null,
        isEditWarning: false,
      });
    }
  };

  handleDoneTask = async (event, task) => {
    event.preventDefault();
    await ModelStore.editItem(task._id, {
      ...task,
      done: !task.done,
    });
  };

  handleUploadTask = async () => {
    console.log("uploading...");
    try {
      await ModelStore.upload();
      console.log("upload done");
    } catch (err) {
      alert(err.message);
      console.log("upload failed");
    }
  };

  render() {
    const { state, props } = this;
    const {
      inputContent,
      inputTags,
      isInputWarning,
      isInitialized,
      editableContentIndex,
      editInputContent,
      isEditWarning,
      isConnectionLoss,
    } = state;
    const { classes } = props;

    if (!isInitialized) {
      return null;
    }

    return (
      <div className={classes.root}>
        {isConnectionLoss && (
          <Paper
            className={classes.paper}
            style={{
              backgroundColor: "#F50000",
              height: "30px",
              padding: 0,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p className={classes.textStyle} style={{ color: "#ffffff" }}>
              CONNECTION LOST !
            </p>
          </Paper>
        )}

        <Container maxWidth="md">
          <h1 style={{ textAlign: "center" }}>Task List Manager</h1>
          <FormInputTask
            classes={classes}
            handleAddTask={this.handleAddTask}
            onChangeAddTask={this.onChangeAddTask}
            inputContent={inputContent}
            inputTags={inputTags}
            isInputWarning={isInputWarning}
          />
          <div
            style={{
              margin: "10px 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.buttonStyle}
              onClick={this.handleUploadTask}
            >
              {`Sync (${ModelStore.countUnuploadeds()})`}
            </Button>
          </div>
          <TaskList
            ModelStore={ModelStore}
            classes={classes}
            editableContentIndex={editableContentIndex}
            editInputContent={editInputContent}
            isEditWarning={isEditWarning}
            onEditTask={this.handleEditTask}
            onDoneTask={this.handleDoneTask}
            onOpenEditTask={this.handleOpenEditTask}
            onDeleteTask={this.handleDeleteTask}
            onChangeEditTask={this.onChangeEditTask}
          />
        </Container>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
