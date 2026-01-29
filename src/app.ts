import express  from "express";
import TodoRoutes from "./routes/todo.routes";

class App {
    app:express.Application
    port:number | string = 3000
    constructor(){
        this.app=express();
        this.app.use(express.json());
        // this.initializeRoutes();
    }
    start(){
        this.app.listen(this.port, () => {
            console.log(`App started on http://localhost:${this.port}`);
        })
    }
}
export default App

