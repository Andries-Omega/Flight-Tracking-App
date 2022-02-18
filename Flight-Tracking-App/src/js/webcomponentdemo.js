class MyCounter extends HTMLElement {
    constructor(){
        super();//calling the base class
        // creating our shadow dom
        this.shadow = this.attachShadow({mode: 'open'})
    }

    render() {

    }
    
}

