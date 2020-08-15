import ModelStore from "./model/ModelStoreCli";
const inquirer = require("inquirer");

const initialCli = async () => {
  console.log("popup initialize all offline data...");
  ModelStore.setName("todos_gegy");
  await ModelStore.initialize();
  console.log("popup done");
};

const showAllTask = () => {
  var taskData = ModelStore.data.map(function (item, index) {
    const { _id, text: content, tags, done } = item;
    return `No.${index + 1} ${JSON.stringify({ _id, content, tags, done })}`;
  });

  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "List Task",
        choices: [...taskData, new inquirer.Separator()],
      },
    ])
    .then((answers) => {
      return process.exit();
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
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
        choices: ["View Task", new inquirer.Separator(), "Input Task"],
      },
    ])
    .then((answers) => {
      const { choice } = answers;
      if (choice === "View Task") return showAllTask();
      return process.exit();
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });
};

initialCli().then(() => {
  actionCli();
});
