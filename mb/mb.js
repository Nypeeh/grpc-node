const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

const protoObject = protoLoader.loadSync(path.resolve(__dirname, '..', 'todo.proto'))
const TodoClient = grpc.loadPackageDefinition(protoObject)

const client = new TodoClient.TodoService('localhost:50051', grpc.credentials.createInsecure())

setInterval(() => {
  client.list({}, (err, notes) => {
    if (err) throw err

    console.log(notes)
  }) 
}, 5000)