export class Product{
        id:number;
        description:string;
        manufacturer:string;
        vendorCode: string;
        category:string
        price:number
        img?:string;
        constructor(id?:number, description?:string, manufacturer?:string, category?:string, vendorCode?:string, price?:number, img?:string){
            if(id && description && manufacturer && category && vendorCode && price){
                this.id = id;
                this.description = description
                this.manufacturer = manufacturer
                this.category = category
                this.vendorCode = vendorCode;
                this.price = price                
                this.img = img;         
            }else{
                this.id = -1;
                this.description = 'no description'
                this.manufacturer = 'no manufacturer'
                this.category = 'no category'
                this.vendorCode = 'no vendorCode';
                this.price = 0                
                this.img = 'no image';       
            }
        }
        
        equals(o:Product):boolean{
            return o.vendorCode == this.vendorCode
        }
    
}