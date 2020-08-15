import PouchyStore from "../../pouchy-store-master-cli/PouchyStore";
import config from "../config";

class ModelStoreCli extends PouchyStore {
  get name() {
    return this._name;
  }

  setName(name) {
    this._name = name;
  }

  get urlRemote() {
    return config.couchDBUrl;
  }

  get optionsRemmote() {
    return {
      auth: config.couchDBAuth,
    };
  }
}

export default new ModelStoreCli();
