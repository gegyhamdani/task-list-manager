import ModelStore from "./model/ModelStoreCli";
const inquirer = require("inquirer");

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
    }).replace(/[{}]/g, "")}`;
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
        console.log("Something else when wrong");
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
        console.log("Something else when wrong");
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
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const { choice } = answers;
      if (choice === "View Task") return showAllTask();
      if (choice === "Input Task") return inputTask();
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
