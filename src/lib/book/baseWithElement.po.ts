import BasePO from "./base.po"

export default class BaseWithIdentifier extends BasePO {
    public id: string 
    public page: BasePO  

    constructor(pageObject?:BasePO,identifier?:string){
        super()
        this.page = pageObject|| new BasePO()
        this.id = identifier || "-1" 
    }

}