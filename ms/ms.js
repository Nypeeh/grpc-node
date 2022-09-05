const grpc = require('grpc')
const path = require('path')
const todoProto = grpc.load(path.resolve(__dirname, '..', 'todo.proto'))
const server = new grpc.Server()

let fakeDB = [
  { id: 1, done: false, task: 'Tarefa 01' },
  { id: 2, done: false, task: 'Tarefa 02' },
]

function changeData(id, checked, task) {
  if(!task) task = 'not found.'
  let res = { id, done: false, task }

  for (const item of fakeDB) {
    if (item.id === id) {
      item.done = checked
      res = item
    }
  }

  return res
}

function removeTask(id) {
  fakeDB = fakeDB.filter(task => task.id !== id)
}

server.addService(todoProto.TodoService.service, {
  insert: (call, callback) => {
    const todo = call.request
    const data = changeData(fakeDB.length + 1, false, todo.task)
    if (todo.task) fakeDB.push(data)
    callback(null, data)
  },
  list: (_, callback) => {
    callback(null, fakeDB)
  },
  mark: (call, callback) => {
    const item = call.request
    callback(null, changeData(item.id, item.checked))
  },
  remove: (call, callback) => {
    const item = call.request
    removeTask(item.id)
    callback(null, {})
  }
})

const address = '127.0.0.1:50051'
server.bind(address, grpc.ServerCredentials.createInsecure())
console.log(`Server running at ${address}`)
server.start()