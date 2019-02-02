export class AppHeader {
    gridColDef: String = "90,*,10,30";
    logoShowDef: String = "visible";
    menuShowDef: String = "visible";
    searchColDef: String = "1";
    public gridCol: String;
    public logoShow: String;
    public searchCol: String;
    public menuShow: String;
    constructor(
        
    ){
        this.logoShow = this.logoShowDef;
        this.menuShow = this.menuShowDef;
        this.gridCol = this.gridColDef;
        this.searchCol = this.searchColDef;
    }

    public reset(){
        this.logoShow = this.logoShowDef;
        this.menuShow = this.menuShowDef
        this.gridCol = this.gridColDef
        this.searchCol = this.searchColDef;
    }

    public searchBarFocus() {
        console.log("Search Bar Focused");
        this.gridCol="*"
        this.searchCol="0"
        this.logoShow = "hidden";
        this.menuShow = "hidden";
    }
}