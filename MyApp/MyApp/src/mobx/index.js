import {ApplicationStore} from './ApplicationStore';
import {User} from './User';

class RootStore {
  constructor(){
    this.ApplicationStore = new ApplicationStore(this);
    this.User = new User(this);
  }
}

export default new RootStore();