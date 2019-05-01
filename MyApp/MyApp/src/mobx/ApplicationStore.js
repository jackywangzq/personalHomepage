import {observable, computed, action, runInAction} from 'mobx';
import {Request} from '../utils/request';
import {getUserId} from '../utils/user';
import {dateFormat} from '../utils/calendar';
import {Alert} from 'react-native';

const baseFilterItems = {
  procType: 0,
  startTime: '',
  endTime: '',
  procStatus: 0,
  searchInput: '',
  pageSize: 500
};

export class ApplicationStore {
  rootStore;
  
  @observable unhandleApplications = [];
  @observable handleApplications = [];
  @observable mylaunchApplications = [];
  @observable applicationNum = {
    unhandleNum: 0,
    handleNum: 0,
    mylaunchNum: 0
  };
  @observable statusNow = 'unhandle';

  @observable filterItems = new Map([
    ['unhandle', baseFilterItems],
    ['handle', baseFilterItems],
    ['mylaunch', baseFilterItems],
  ])
  @observable filterResult = new Map([
    ['unhandle', new Map()],
    ['handle', new Map()],
    ['mylaunch', new Map()],
  ])
  @observable pageNum = 1;

  @observable isLoading = true

  @observable isFootLoading = false 

  @observable searchStatusNow = 'unhandle';

  @observable unhandleSearch = [];
  @observable handleSearch = [];
  @observable mylaunchSearch = [];

  @observable searchItems = new Map([
    ['unhandle', baseFilterItems],
    ['handle', baseFilterItems],
    ['mylaunch', baseFilterItems],
  ])

  @observable isSearchLoading = true

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  /**
   * 按照工单状态、筛选条件获取工单列表，状态分别为：
   * 1. unhandle: 我的待办
   * 2. handle: 我的已办
   * 3. mylaunch: 我的发起
   * 
   * 筛选条件包括:
   * procCode:  流程编号，默认值为''
   * startUser:  发起人
   * procType:  流程类型，默认为0，具体值包括：
   *    0: 全部
   *    material_approval: 案例申请
   *    aptitude: 资质申请
   *    oppo_process: 跨省支撑申请
   * startTime:  发起时间区间开始值，示例值: 2019-03-07
   * endTime: 发起时间区间结束值
   * page: 开始页面的索引，用于懒加载，默认为1
   * procStatus: 流程状态，仅在已办、待办中存在，默认值为0，具体值包括：
   *    0: 全部
   *    1: 完成
   *    2: 正在处理
   *    3: 废弃
   */


  /**
   * 获取当前的筛选条件
   * 
   */
  @computed get queriesMap() {
    const filterItemsMap = new Map(this.filterItems);
    let result = new Map();
    for (let [key, value] of filterItemsMap.entries()) {
      const query = {
        procType: value.procType,
        startTime: value.startTime,
        endTime: value.endTime,
        procStatus: value.procStatus,
        searchInput: value.searchInput,
        pageSize: value.pageSize
      }
      result.set(key, query)
    }
    return result; 
  }

  @computed get queriesSearchMap() {
    const filterItemsMap = new Map(this.searchItems);
    let result = new Map();
    for (let [key, value] of filterItemsMap.entries()) {
      // const query = `?procType=${value.procType}&startTime=${value.startTime}&endTime=${value.endTime}&procStatus=${value.procStatus}&searchInput=${value.searchInput}&pageSize=${value.pageSize}`
      const query = {
        procType: value.procType,
        startTime: value.startTime,
        endTime: value.endTime,
        procStatus: value.procStatus,
        searchInput: value.searchInput,
        pageSize: value.pageSize
      }
      result.set(key, query)
    }
    return result; 
  }


  @computed get filterNow() {
    return this.filterResult.get(this.statusNow);
  }

  @computed get listNow() {
    return this[`${this.statusNow}Applications`];
  }

  @computed get searchListNow() {
    return this[`${this.searchStatusNow}Search`];
  }
  
  /**
   * 
   * @param {*} type 当前tab的值，具体为：
   *    'unhandle'
   *    'handle'
   *    'mylaunch'
   */

  @action
  nextPage() {
    // this.pageNum += 1;
    this.fetchApplications(true, this.pageNum + 1);
  }

  
  @action
  async fetchApplications(isNextPage, pageNow) {
    if (isNextPage) {
      this.isFootLoading = true;
    } else {
      this.isLoading = true;
    }
    const status = this.statusNow;
    // this.isLoading = true;
    const userId = await getUserId();
    const queries = this.queriesMap.get(status);
    let url = ''
    switch(status) {
      case "unhandle":
        url = "userContl/getUnHandleTasks";
        break;
      case "handle":
        url = "userContl/getHandleTasks";
        break;
      case "mylaunch":
        url = "userContl/getMyLaunch"
    }
    const pageNum = isNextPage ? pageNow : this.pageNum;
    try {
      /* const resultPrimise =  Request.get(`${url}${queries}&userId=${userId}`);
      const applicationNumPromise =  Request.get(`userContl/getTaskCount?userId=${userId}`);
      const result = await resultPrimise;
      const applicationNum = await applicationNumPromise; */
      const [result, applicationNum] = await Promise.all([
        Request.post(url, Object.assign(queries, {userId, pageNum})),
        Request.post(`userContl/getTaskCount`, {
          userId
        })
      ]);
      const {respCode, respDesc, list} = result;
      if (respCode === '001') {
        const {unCount, doneCount, myCount} = applicationNum;
        const listFormat = status === 'unhandle' ? 
          list.map(item => {
            let result = JSON.parse(JSON.stringify(item.processInfo));
            result.currentHandler = '我'
            result.currentTask = item.taskInfo.taskName;
            result.taskId = item.taskInfo.taskId;
            return result
          }) : list;
        runInAction(() => {
          if (isNextPage) {
            this[`${status}Applications`] = [...this[`${status}Applications`], ...listFormat];
            this.isFootLoading = false;
            this.pageNum = pageNow;
          } else {
            this[`${status}Applications`] = listFormat;
            this.isLoading = false;
          }
          
          this.applicationNum = {
            unhandleNum: unCount,
            handleNum: doneCount,
            mylaunchNum: myCount
          }
          
        })
        /* this[`${status}Applications`] = listFormat;
        this.applicationNum = {
          unhandleNum: unCount,
          handleNum: doneCount,
          mylaunchNum: myCount
        }
        this.isLoading = false; */
        console.log(this.isLoading)
      } else {
        runInAction(() => {
          this.isLoading = false;
          this.isFootLoading = false;
        })
        Alert.alert(
          '出错啦',
          respDesc,
          [
            {text: '确定'},
          ],
          { cancelable: false }
        )
        
      }
    } catch (err) {
      //console.error(err);
      runInAction(() => {
        this.isLoading = false;
        this.isFootLoading = false;
      })
      Alert.alert(
        '请求失败，请重试',
        '',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
      
    }
  }


  @action
  async fetchSearchApplications(isNextPage, pageNow) {
    if (isNextPage) {
      this.isFootLoading = true;
    } else {
      this.isSearchLoading = true;
    }
    const status = this.searchStatusNow;
    // this.isLoading = true;
    const userId = await getUserId();
    const queries = this.queriesSearchMap.get(status);
    let url = ''
    switch(status) {
      case "unhandle":
        url = "userContl/getUnHandleTasks";
        break;
      case "handle":
        url = "userContl/getHandleTasks";
        break;
      case "mylaunch":
        url = "userContl/getMyLaunch"
    }
    const pageNum = isNextPage ? pageNow : this.pageNum;
    try {
      const result = await Request.post(url, Object.assign(queries, {userId, pageNum}));
      const {respCode, respDesc, list} = result;
      if (respCode === '001') {
        const listFormat = status === 'unhandle' ? 
          list.map(item => {
            let result = JSON.parse(JSON.stringify(item.processInfo));
            result.currentHandler = '我'
            result.currentTask = item.taskInfo.taskName;
            result.taskId = item.taskInfo.taskId;
            return result
          }) : list;
        runInAction(() => {
          if (isNextPage) {
            this[`${status}Search`] = [...this[`${status}Search`], ...listFormat];
            this.isFootLoading = false;
            this.pageNum = pageNow;
          } else {
            this[`${status}Search`] = listFormat;
            this.isSearchLoading = false;
          } 
        })
      } else {
        runInAction(() => {
          this.isSearchLoading = false;
          this.isFootLoading = false;
        })
        Alert.alert(
          '出错啦',
          respDesc,
          [
            {text: '确定'},
          ],
          { cancelable: false }
        )
        
      }
    } catch (err) {
      //console.error(err);
      runInAction(() => {
        this.isSearchLoading = false;
        this.isFootLoading = false;
      })
      Alert.alert(
        '请求失败，请重试',
        '',
        [
          {text: '确定'},
        ],
        { cancelable: false }
      )
      
    }
  }

  @action clearSearchResult() {
    this.unhandleSearch = [];
    this.handleSearch = [];
    this.mylaunchSearch = [];
  }

  /**
   * 筛选动作
   * @param {*} type 筛选的条目
   * @param {*} data 筛选的值
   */
  /* @action
  filter(type, data) {
    const itemNow = this.filterItems.get(this.statusNow);
    itemNow[type] = data;
    this.fetchApplications();
  } */
  @action
  filter(options) {
    this.pageNum = 1
    const itemNow = this.filterItems.get(this.statusNow);
    this.filterResult.set(this.statusNow, options);
    for (let key of options.keys()) {
      let valueNow;
      if (key === 'procType') {
        valueNow = [...options.get(key)].filter(item => item[1]).map(item => item[0])[0];
        if (valueNow) {
          itemNow[key] = valueNow;
        } else {
          itemNow[key] = 0;
        }
      } else if (key === 'date') {
        valueNow = [...options.get(key)].filter(item => item[1]).map(item => item[0])[0];
        switch(valueNow) {
          case 0:
            itemNow.startTime = dateFormat(new Date().getTime(), 'L');
            itemNow.endTime = dateFormat(new Date().getTime(), 'L');
            break;
          case 1:
            itemNow.startTime = dateFormat(new Date().getTime() - 86400000, 'L');
            itemNow.endTime = dateFormat(new Date().getTime() - 86400000, 'L');
            break;
          case 2:
            itemNow.startTime = dateFormat(new Date().getTime() - 86400000 * 5, 'L');
            itemNow.endTime = dateFormat(new Date().getTime(), 'L');
            break;
          default:
            itemNow.startTime = '';
            itemNow.endTime = '';
        } 
      } else if (key === 'procStatus') {
        valueNow = [...options.get(key)].filter(item => item[1]).map(item => item[0])[0];
        if (valueNow) {
          itemNow[key] = valueNow;
        } else {
          itemNow[key] = 0;
        }
      }
      
    }
    /* options.map(option => {
      itemNow[option.name] = option.data.join(',')
    })
    console.log(itemNow) */
    this.fetchApplications();
  }

  @action
  changeStatus(status) {
    this.statusNow = status;
    this.pageNum = 1;
    this.fetchApplications();
  }

  @action
  changeSearchStatus(status) {
    this.searchStatusNow = status;
    this.pageNum = 1;
    const length = this[`${this.searchStatusNow}Search`].length;
    console.log(length)
    if(length == 0) {
      this.fetchSearchApplications();
    }
  }

  @action
  search(value) {
    ['unhandle', 'handle', 'mylaunch'].map(item => {
      let itemNow = this.searchItems.get(item);
      itemNow.searchInput = value;
      this.searchItems.set(item, itemNow)
    })
    this.clearSearchResult()
    this.fetchSearchApplications()
  }
}