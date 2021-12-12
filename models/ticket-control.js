const path = require('path');
const fs = require('fs');

class Ticket{
    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

 class TicketControl{



    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init();
        
    }
        
    get toJSON()    {
        return{ 
            ultimo: this.ultimo,       
            hoy: this.hoy,
            tickets: this.tickets,           
            ultimos4: this.ultimos4, 
        }
    }

    init(){
        const {hoy, tickets, ultimos4, ultimo} = require('../db/data.json');
        if (hoy === this.hoy){
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }else{
            //Es otro dia
            this.guardarDB();
        }
    }


    guardarDB(){
        const dbpath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbpath, JSON.stringify(this.toJSON));
    }


    siguiente(){
        //Genera un nuevo numero y agrega. 
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.guardarDB();
        return 'Ticket' + ticket.numero;
    }

    atenderTicket(escritorio){
        //No tenemos Ticket
        if (this.tickets.length ===0) {
            return null;
            
        }
        //Instancia sola de una nueva constante
        const ticket = this.tickets.shift(); //this.tickets[0];
        //Ticket que hay que atender y que se asigna a un escritorio
        ticket.escritorio= escritorio;

        this.ultimos4.unshift( ticket );
        //Se elimina el ultimo elemento
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1,1);

        }

        this.guardarDB();

        //El ticket que se esta atendiendo
        return ticket;
        

    }

}

module.exports= TicketControl;