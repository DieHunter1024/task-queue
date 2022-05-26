// @decoratorTaskQueue({ maxLen: 10 })
class Example {
  constructor(TaskQueue) {
    const taskQueue = new TaskQueue({ maxLen: 10 });
    taskQueue.push(task).then((res) => {
      console.log(res);
    });
    taskQueue.push(task2).then((res) => {
      console.log(res);
    });
    taskQueue.push(task3).then((res) => {
      console.log(res);
    });
    taskQueue.push(task4).then((res) => {
      console.log(res);
    });
  }
}

const syncFn = (args) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(args);
    }, 1000);
  });
};

const createFnList = (length, name) => {
  const task = {
    name,
    children: [],
  };
  while (length--) {
    task.children.push(syncFn.bind(null, "args"));
  }
  return task;
};

const task = createFnList(10, "task1");
const task2 = createFnList(2, "task2");
const task3 = createFnList(4, "task3");
const task4 = createFnList(11, "task4");
if (typeof define === "function" && define.amd) {
  // amd环境
  define(Example);
} else if (typeof exports === "object") {
  // cmd环境
  exports.Example = Example;
} else if (Window) {
  // 浏览器环境下
  window.Example = Example;
}
