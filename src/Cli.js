import ModelStore from "./model/ModelStoreCli";
const inquirer = require("inquirer");

//Im sorry i can't finish Edit and Delete Task on CLI

const initialCli = async () => {
  console.log("popup initialize all offline data...");
  ModelStore.setName("todos_gegy");
  await ModelStore.initialize();
  console.log("popup done");
};

const listTask = () => {
  return ModelStore.data.map((item, index) => {
    const { _id, text: content, tags, done } = item;
    return `No.${index + 1} ${JSON.stringify({
      _id,
      content,
      tags,
      done,
    }).replace(/[{}]/g, "")} - ${
      !ModelStore.checkIsUploaded(item) ? "Not Sync" : "Sync"
    }`;
  });
};

const handleAddTask = async (task) => {
  const { taskName, taskTags } = task;
  await ModelStore.addItem({
    text: taskName,
    tags: taskTags,
    done: false,
  });
};

const handleUploadTask = async () => {
  console.log("uploading...");
  try {
    await ModelStore.upload();
    console.log("upload done");
  } catch (err) {
    alert(err.message);
    console.log("upload failed");
  }
};

const syncData = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choiceSync",
        message: `Sync Data to Server? (there are ${ModelStore.countUnuploadeds()} UnSync data)`,
        choices: ["Yes", new inquirer.Separator(), "No"],
      },
    ])
    .then((answers) => {
      const { choiceSync } = answers;
      if (choiceSync === "Yes") return handleUploadTask().then(actionCli());
      return actionCli();
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldnt be rendered in the current environment");
      } else {
        console.log("Something else when wrong On Uploading");
      }
    });
};

const showAllTask = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "list-task",
        message: "List Task",
        choices: [...listTask(), new inquirer.Separator()],
      },
    ])
    .then((answers) => {
      return actionCli();
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldnt be rendered in the current environment");
      } else {
        console.log("Something else when wrong on List Task");
      }
    });
};

const inputTask = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "taskName",
        message: "Input Your Task Name: ",
        validate: (input) => {
          return input.trim() !== "";
        },
      },
      {
        type: "input",
        name: "taskTags",
        message: "Input Your Task Tag: ",
        validate: (input) => {
          return input.trim() !== "";
        },
      },
    ])
    .then((answers) => {
      return handleAddTask(answers).then(actionCli());
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldnt be rendered in the current environment");
      } else {
        console.log("Something else when wrong on Add Task");
      }
    });
};

const actionCli = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What do you want?",
        choices: [
          "View Task",
          new inquirer.Separator(),
          "Input Task",
          new inquirer.Separator(),
          "Sync Data",
          new inquirer.Separator(),
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const { choice } = answers;
      if (choice === "View Task") return showAllTask();
      if (choice === "Input Task") return inputTask();
      if (choice === "Sync Data") return syncData();
      return process.exit();
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldnt be rendered in the current environment");
      } else {
        console.log("Something else when wrong");
      }
    });
};

initialCli().then(() => {
  actionCli();
});
