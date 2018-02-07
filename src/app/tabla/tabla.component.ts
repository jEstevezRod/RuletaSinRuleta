import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  public name;
  public name2;
  public cajas: string = 'Esta es una frase';
  public cajasarray = [];

  constructor(public _Socket: SocketService) {
    this._Socket.getName().subscribe(data => {
      this.name2 = data;
      console.log("fsgfdgfddfd")
    })
  }

  ngOnInit() {


    for (let caja of this.cajas) {
      this.cajasarray.push(caja)
    }
  }

}
