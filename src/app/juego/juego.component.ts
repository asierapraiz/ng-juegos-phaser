import { Component, OnInit } from '@angular/core';
//import Phaser from './../../../node_modules/phaser-ce/build/phaser.min.js';
import { Partida } from './../models/partida';
import { Renderer2} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {

  juego: string;

  constructor( 
    private renderer: Renderer2,
    private route: ActivatedRoute,    
    private location: Location,
    private router: Router) {  }

  ngOnInit(): void {  
    this.juego = this.route.snapshot.paramMap.get('id');
    
   this.renderExternalScript('../../assets/scripts/librerias/storage.js').onload = () => {   
     console.log("Storage cargado");
   } 
   this.renderExternalScript('../../assets/'+ this.juego +'/src/Boot.js').onload = () => { 
    console.log("Boot de "+ this.juego +" cargado");    
   }

  } 
  
  
  renderExternalScript(src: string): HTMLScriptElement {
   const script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = src;
   script.async = true;
   script.defer = true;
   this.renderer.appendChild(document.body, script);
   return script;
 }
 
 next(){    
   console.log("Usuario:"+localStorage.getItem('usuario'));
   console.log("Puntos:"+ localStorage.getItem('bunny-points'));
   this.router.navigate(['/other']);
 }

}
