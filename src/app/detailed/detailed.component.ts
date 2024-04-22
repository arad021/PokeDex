import {Component, Input, OnInit,} from '@angular/core';
import {Pokemon} from "../pokemon-api-type";
import {HttpClient} from "@angular/common/http";
import {HeaderComponent} from "../header/header.component";
import {PokemonServiceService} from "../Services/pokemon-service.service";
import {Observable, Observer} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-detailed',
  standalone: true,
  imports: [
    HeaderComponent,
    AsyncPipe
  ],
  templateUrl: './detailed.component.html',
  styleUrl: './detailed.component.css'
})
export class DetailedComponent implements OnInit{

  @Input() pokemonName !: string;
  public pokemon$ !:Observable<Pokemon>;

   constructor(private httpClient: HttpClient, private pokemonService: PokemonServiceService) {
   }
   ngOnInit() {
     this.pokemon$ = this.pokemonService.getPokemon$(this.pokemonName);

   }


}
