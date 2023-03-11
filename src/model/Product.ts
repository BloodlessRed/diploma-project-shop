export class Product{
        id:number;
        name: string;
        img:string;
        prodLink:string;
        constructor(id?:number, name?:string, img?:string, prodLink?:string){
            if(id && name && img && prodLink){
                this.id = id;
                this.name = name;
                this.img = img;
                this.prodLink = prodLink            
            }else{
                this.id = -1;
                this.name = "";
                this.img = "";
                this.prodLink = "";           
            }
        }
        
        equals(o:Product):boolean{
            return o.name == this.name
            && o.prodLink == this.prodLink;
        }
    
}