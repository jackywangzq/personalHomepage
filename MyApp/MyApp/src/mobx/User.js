import {observable, computed, action} from 'mobx';
import {AsyncStorage} from 'react-native';

export class User {
  rootStore;
  
  @observable userInfo = null;
  @observable userId = '';

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.getUserInfo();
  }

  @action
  async getUserInfo() {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if(userInfo) {
      // const {id, name, phone, email, orgName, org2Name, org3Name, orgId, org2Id} = userInfo;
      this.userInfo = JSON.parse(userInfo)
      this.userId = this.userInfo.id
    }
  }
}