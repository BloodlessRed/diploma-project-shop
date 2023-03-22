export class Product{
        id:number;
        vendorCode: string;
        name:string
        price:number
        img:string;
        constructor(id?:number, vendorCode?:string, price?:number, name?:string, img?:string, prodLink?:string){
            if(id && vendorCode && price && name && img && prodLink){
                this.id = id;
                this.vendorCode = vendorCode;
                this.price = price
                this.name = name;
                this.img = img;         
            }else{
                this.id = -1;
                this.vendorCode = ""
                this.price = -1
                this.name = "";
                this.img = "";       
            }
        }
        
        equals(o:Product):boolean{
            return o.vendorCode == this.vendorCode
        }
    
}