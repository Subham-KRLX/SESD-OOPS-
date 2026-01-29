// import { Router,Request,Response} from 'express';

// class TodoRoutes {
//   router = Router();
//   constructor() {
//     this.router.get('/todos',(req:Request,res:Response) => {
//       console.log('hello world');
//     });
//   }
//   getRouter() {
//   }
// }
// export default TodoRoutes;


import express, { Router } from "express"
const route = express.Router()
route.get("/",(req,res)=>{
})

                                                                                                                                                                                                                                                                                                        
express.Router()
class TodoRoutes{
    path:string = '/todos'
    route:Router = Router()
    initializeRoutes(){
        // express.Router()
        this.route.get(this.path,(req,res)=>{
            res.send("Hello World")
})
this.route.post(`${this.path}/add`,(req,res)=>{
})
    }
}
export default TodoRoutes